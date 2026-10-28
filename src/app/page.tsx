"use client";

import React from "react";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";
import { PhotoAwareCover } from "@/components/PhotoAwareCover";

export default function Home() {
  const { settings } = usePortfolioSettings();

  return (
    <main className="w-full min-h-screen bg-[#08090c] text-[#f5f3ef] selection:bg-[#e5c07b] selection:text-stone-950 font-sans">
      {/* 01 — DYNAMIC PHOTO-AWARE MAGAZINE COVER */}
      <PhotoAwareCover settings={settings} />
    </main>
  );
}
