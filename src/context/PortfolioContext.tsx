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

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(initialDefaultData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json && json.personal) {
          setData(json);
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote portfolio data, using defaults:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateData = async (newData: PortfolioData): Promise<boolean> => {
    try {
      setData(newData);
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update portfolio data:", err);
      return false;
    }
  };

  const resetData = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/portfolio", { method: "PUT" });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Failed to reset portfolio data:", err);
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
