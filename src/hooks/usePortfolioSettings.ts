"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
  PortfolioSettings,
  defaultSettings,
  SETTINGS_STORAGE_KEY,
} from "@/data/portfolioSettings";

const emptySubscribe = () => () => {};

export function usePortfolioSettings() {
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Synchronous initial state from localStorage (eliminates visual flash on refresh)
  const [settings, setSettings] = useState<PortfolioSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          return { ...defaultSettings, ...JSON.parse(stored) };
        }
      } catch {
        // Fallback to default
      }
    }
    return defaultSettings;
  });

  // Sync with disk API & setup storage listeners
  useEffect(() => {
    // 1. Sync from server disk persistence
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData && (serverData.coverMediaUrl || serverData.coverImage)) {
          setSettings((prev) => {
            const merged = { ...prev, ...serverData };
            try {
              localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});

    const handleStorageUpdate = () => {
      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          setSettings({ ...defaultSettings, ...JSON.parse(stored) });
        } else {
          setSettings(defaultSettings);
        }
      } catch {
        // Fallback
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("portfolio-settings-updated", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("portfolio-settings-updated", handleStorageUpdate);
    };
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<PortfolioSettings>) => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (err) {
      console.warn("Could not save to disk API, using storage fallback", err);
    }

    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("portfolio-settings-updated"));
      } catch {}
      return updated;
    });
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultSettings),
      });
    } catch {}

    setSettings(defaultSettings);
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("portfolio-settings-updated"));
    } catch {}
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
  };
}
