"use client";

import { useState, useSyncExternalStore } from "react";
import { PortfolioSettings, defaultSettings } from "@/data/portfolioSettings";

const emptySubscribe = () => () => {};

export function usePortfolioSettings() {
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [settings] = useState<PortfolioSettings>(defaultSettings);

  return {
    settings,
    isLoaded,
  };
}
