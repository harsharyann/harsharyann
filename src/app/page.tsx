"use client";

import React from "react";
import { DoodleCrewCover } from "@/components/DoodleCrewCover";
import { MobileDoodleCover } from "@/components/MobileDoodleCover";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-transparent text-black dark:text-white selection:bg-indigo-600 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      {/* Phone Cover (iOS & Android) — Dedicated Clean Portrait Layout */}
      <div className="block md:hidden w-full min-h-screen">
        <MobileDoodleCover />
      </div>

      {/* Desktop Cover (Tablet & Laptop) — Full Interactive Doodle Crew */}
      <div className="hidden md:block w-full min-h-screen">
        <DoodleCrewCover />
      </div>
    </main>
  );
}
