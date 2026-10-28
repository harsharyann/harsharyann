"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PortfolioSettings,
  defaultSettings,
  SETTINGS_STORAGE_KEY,
} from "@/data/portfolioSettings";

export function usePortfolioSettings() {
  // Synchronous initial state from localStorage (eliminates any visual flash on refresh)
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with disk API & setup storage listeners
  useEffect(() => {
    // 1. Sync from server disk persistence
    fetch("/api/upload-cover")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData && serverData.coverImage) {
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

    setIsLoaded(true);

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
    window.addEventListener(
      "portfolio-settings-updated",
      handleStorageUpdate
    );

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener(
        "portfolio-settings-updated",
        handleStorageUpdate
      );
    };
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<PortfolioSettings>) => {
    // Persist all settings & images to server disk API
    try {
      const res = await fetch("/api/upload-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          newSettings.coverImage = data.url;
        }
      }
    } catch (err) {
      console.warn("Could not save to disk API, using storage fallback", err);
    }

    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("portfolio-settings-updated"));
      } catch (err) {
        console.warn("localStorage quota warning, handled via disk persistence", err);
      }
      return updated;
    });
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("portfolio-settings-updated"));
    } catch {}
    setSettings(defaultSettings);
  }, []);

  return { settings, updateSettings, resetSettings, isLoaded };
}
