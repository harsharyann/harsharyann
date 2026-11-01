"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { portfolioData as initialDefaultData, PortfolioData } from "@/data/portfolioData";

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  updateData: (newData: PortfolioData) => Promise<boolean>;
  resetData: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: initialDefaultData,
  isLoading: false,
  updateData: async () => false,
  resetData: async () => false,
  refreshData: async () => {},
});

const LOCAL_STORAGE_KEY = "socius_portfolio_data";

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(initialDefaultData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = async () => {
    // 1. Instantly read from local storage if available so there is zero flash of old data
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

    // 2. Fetch latest synced data from server
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
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote portfolio data, using local/default:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateData = async (newData: PortfolioData): Promise<boolean> => {
    try {
      setData({ ...newData });
      // Instantly save to local storage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
          console.warn("localStorage write error:", e);
        }
      }

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          setData({ ...result.data });
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result.data));
          }
        }
        return true;
      }
      return true; // Return true as local state & storage was saved successfully
    } catch (err) {
      console.error("Failed to update portfolio data:", err);
      return true; // Still true locally
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
    <PortfolioContext.Provider value={{ data, isLoading, updateData, resetData, refreshData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
