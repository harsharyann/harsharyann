"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { portfolioData as initialDefaultData, PortfolioData } from "@/data/portfolioData";

export interface SaveResult {
  success: boolean;
  error?: string;
  data?: PortfolioData;
}

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
  lastSaveError: string | null;
  updateData: (newData: PortfolioData) => Promise<SaveResult>;
  resetData: () => Promise<boolean>;
  refreshData: () => Promise<void>;
  isCoverOpen: boolean;
  openCover: () => void;
  closeCover: () => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: initialDefaultData,
  isLoading: false,
  isSaving: false,
  lastSaveError: null,
  updateData: async () => ({ success: false, error: "Not initialized" }),
  resetData: async () => false,
  refreshData: async () => {},
  isCoverOpen: true,
  openCover: () => {},
  closeCover: () => {},
});

const LOCAL_STORAGE_KEY = "harsh_portfolio_data_v3";
const COVER_SESSION_KEY = "socius_cover_dismissed";
const LAST_SECTION_KEY = "socius_last_section";

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: PortfolioData;
}) {
  const [data, setData] = useState<PortfolioData>(initialData || initialDefaultData);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaveError, setLastSaveError] = useState<string | null>(null);
  const [isCoverOpen, setIsCoverOpen] = useState<boolean>(true);

  const isSavingRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);

  // Clear legacy poisoned localStorage cache (e.g. from previous dummy projects)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("socius_portfolio_data");
    } catch {}
  }, []);

  // Sync Cover State on initial load / refresh so user STAYS on the page they were on
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const isDismissed = sessionStorage.getItem(COVER_SESSION_KEY) === "true";
      const hash = window.location.hash;
      const hasSpecificSectionHash = Boolean(hash && hash !== "#cover" && hash !== "#");
      const isNotHomeRoot = window.location.pathname !== "/";

      // If already dismissed in this session, or user has section hash, or is on another route:
      if (isDismissed || hasSpecificSectionHash || isNotHomeRoot) {
        setIsCoverOpen(false);

        // If there is a section hash (e.g. #projects, #about, #contact, #certificates), scroll right to it!
        if (hasSpecificSectionHash) {
          const targetId = hash.replace("#", "");
          setTimeout(() => {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: "instant" });
            }
          }, 80);
        } else {
          // If no hash in URL, check if there was a recorded last section
          const lastSec = sessionStorage.getItem(LAST_SECTION_KEY);
          if (lastSec && lastSec !== "cover") {
            setTimeout(() => {
              const targetEl = document.getElementById(lastSec);
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: "instant" });
              }
            }, 80);
          }
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const openCover = useCallback(() => {
    setIsCoverOpen(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(COVER_SESSION_KEY);
        sessionStorage.removeItem(LAST_SECTION_KEY);
      } catch {}
      window.scrollTo({ top: 0, behavior: "instant" });
      if (window.history && window.location.hash) {
        window.history.pushState(null, "", "/");
      }
    }
  }, []);

  const closeCover = useCallback(() => {
    setIsCoverOpen(false);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(COVER_SESSION_KEY, "true");
      } catch {}
    }
  }, []);

  const refreshData = useCallback(async (force = false) => {
    // Prevent refetching while a save is currently in progress
    if (isSavingRef.current && !force) return;

    const now = Date.now();
    // Throttle background refreshes to at most once every 30 seconds unless forced
    if (!force && now - lastRefreshTimeRef.current < 30000) return;
    lastRefreshTimeRef.current = now;

    // 1. Fetch latest synced data from server in the background (authoritative source)
    try {
      const res = await fetch(`/api/portfolio?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.personal && !isSavingRef.current) {
          // IMPORTANT: Check if localStorage has newer edits than server!
          if (typeof window !== "undefined") {
            try {
              const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
              if (localRaw) {
                const localParsed = JSON.parse(localRaw);
                const localTime = (localParsed as any)?._lastSavedAt || 0;
                const serverTime = (json as any)?._lastSavedAt || 0;
                if (localTime > serverTime) {
                  // LocalStorage has more recent edits! Keep local data, do not overwrite!
                  setData(localParsed);
                  return;
                }
              }
            } catch {}
          }
          setData(json);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
            } catch (quotaErr) {
              console.warn("localStorage quota warning:", quotaErr);
            }
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote portfolio data, falling back to local:", err);
    } finally {
      setIsLoading(false);
    }

    // 2. Offline fallback to localStorage only if server is unreachable
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && parsed.personal && !isSavingRef.current) {
            setData(parsed);
          }
        }
      } catch {}
    }
  }, []);

  // Hydrate from localStorage immediately on mount for zero-lag initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && parsed.personal) {
            setData(parsed);
          }
        }
      } catch {}
    }
    refreshData(true);
  }, [refreshData]);

  // ── Instant Cross-Tab & In-Tab Sync Listener ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Cross-tab storage listener: fires when another tab (e.g. /admin) writes to localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue && !isSavingRef.current) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.personal) {
            setData(parsed);
          }
        } catch {}
      }
    };

    // 2. In-tab custom sync event
    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.personal) {
        setData(customEvent.detail);
      }
    };

    // 3. Tab visibility / focus refetch (safe, throttled, and non-disruptive)
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !isSavingRef.current) {
        refreshData(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio-data-synced", handleCustomSync);
    window.addEventListener("focus", handleVisibility);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio-data-synced", handleCustomSync);
      window.removeEventListener("focus", handleVisibility);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshData]);

  const updateData = async (newData: PortfolioData): Promise<SaveResult> => {
    isSavingRef.current = true;
    setIsSaving(true);
    setLastSaveError(null);

    const dataWithTimestamp = {
      ...newData,
      _lastSavedAt: Date.now(),
    };

    // Optimistically update React state and local storage immediately
    setData({ ...dataWithTimestamp });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataWithTimestamp));
        window.dispatchEvent(new CustomEvent("portfolio-data-synced", { detail: dataWithTimestamp }));
      } catch (e) {
        console.warn("localStorage write warning:", e);
      }
    }

    // Abort controller with 10s maximum timeout so saving NEVER gets stuck indefinitely
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataWithTimestamp),
        signal: controller.signal,
      });

      clearTimeout(timeoutTimer);

      if (res.ok) {
        const result = await res.json();
        const savedData = result.data || dataWithTimestamp;
        setData({ ...savedData });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedData));
          } catch (e) {
            console.warn("localStorage write warning:", e);
          }
        }
        isSavingRef.current = false;
        setIsSaving(false);
        return { success: true, data: savedData };
      }

      const errResult = await res.json().catch(() => ({}));
      const errorMsg =
        res.status === 401
          ? "Admin session expired or unauthorized. Please re-login with Google."
          : res.status === 413
          ? "Data payload is too large. If you uploaded an image, please use a Google Drive direct link."
          : errResult.error || `Server returned error (${res.status})`;

      console.error("Save to /api/portfolio failed:", res.status, errResult);
      setLastSaveError(errorMsg);
      isSavingRef.current = false;
      setIsSaving(false);
      return { success: false, error: errorMsg };
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      const isTimeout = err?.name === "AbortError";
      const errorMsg = isTimeout
        ? "Network timed out. Changes saved locally in browser, but server took too long to reply."
        : err?.message
        ? `Network error: ${err.message}`
        : "Failed to connect to server.";

      console.error("Failed to update portfolio data:", err);
      setLastSaveError(errorMsg);
      isSavingRef.current = false;
      setIsSaving(false);
      return { success: false, error: errorMsg };
    }
  };

  const resetData = async (): Promise<boolean> => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      const res = await fetch("/api/portfolio", { method: "PUT" });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data);
          return true;
        }
      }
      setData(initialDefaultData);
      return true;
    } catch (err) {
      console.error("Failed to reset portfolio data:", err);
      setData(initialDefaultData);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        lastSaveError,
        updateData,
        resetData,
        refreshData,
        isCoverOpen,
        openCover,
        closeCover,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
