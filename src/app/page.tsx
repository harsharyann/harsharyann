"use client";

import React from "react";
import { DoodleCrewCover } from "@/components/DoodleCrewCover";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* 01 — BLACK & WHITE DOODLE CREW COVER PAGE */}
      <DoodleCrewCover />
    </main>
  );
}
