"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { portfolioData as initialDefaultData, PortfolioData } from "@/data/portfolioData";

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  updateData: (newData: PortfolioData) => Promise<boolean>;
  resetData: () => Promise<boolean>;
  refreshData: () => Promise<void>;
  isCoverOpen: boolean;
  openCover: () => void;
  closeCover: () => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: initialDefaultData,
  isLoading: false,
  updateData: async () => false,
  resetData: async () => false,
  refreshData: async () => {},
  isCoverOpen: true,
  openCover: () => {},
  closeCover: () => {},
});

const LOCAL_STORAGE_KEY = "socius_portfolio_data";
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
  const [isCoverOpen, setIsCoverOpen] = useState<boolean>(true);

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

  const refreshData = async () => {
    // 1. Fetch latest synced data from server in the background (always fresh across all browsers)
    try {
      const res = await fetch(`/api/portfolio?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.personal) {
          setData(json);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
            } catch {}
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote portfolio data, falling back to local:", err);
    } finally {
      setIsLoading(false);
    }

    // 2. Offline fallback to localStorage
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
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateData = async (newData: PortfolioData): Promise<boolean> => {
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newData),
      });

      if (res.ok) {
        const result = await res.json();
        const savedData = result.data || newData;
        setData({ ...savedData });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedData));
          } catch (e) {
            console.warn("localStorage write error:", e);
          }
        }
        return true;
      }

      const errResult = await res.json().catch(() => ({}));
      console.error("Save to /api/portfolio failed:", res.status, errResult);
      return false;
    } catch (err) {
      console.error("Failed to update portfolio data:", err);
      return false;
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
