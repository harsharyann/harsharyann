"use client";

import { useState, useSyncExternalStore } from "react";
import {
  PortfolioSettings,
  defaultSettings,
  SETTINGS_STORAGE_KEY,
} from "@/data/portfolioSettings";

const emptySubscribe = () => () => {};

export function usePortfolioSettings() {
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [settings] = useState<PortfolioSettings>(() => {
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

  return {
    settings,
    isLoaded,
  };
}
