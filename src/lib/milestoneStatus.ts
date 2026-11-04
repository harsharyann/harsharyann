import React from "react";
import { TimelineMilestone } from "@/data/portfolioData";

export interface MilestoneStatusPreset {
  id: string;
  label: string;
  color: string;
  bg: string;
  badgeBg: string;
}

export const MILESTONE_STATUS_PRESETS: MilestoneStatusPreset[] = [
  {
    id: "completed",
    label: "COMPLETED ✦",
    color: "#10b981",
    bg: "bg-emerald-500 text-white border-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "active",
    label: "ACTIVE EXECUTION 🟢",
    color: "#f59e0b",
    bg: "bg-amber-400 text-black border-black",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    id: "next",
    label: "NEXT HORIZON 🚀",
    color: "#6366f1",
    bg: "bg-indigo-500 text-white border-indigo-600",
    badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-300",
  },
  {
    id: "planned",
    label: "PLANNED ⏳",
    color: "#0284c7",
    bg: "bg-sky-500 text-white border-sky-600",
    badgeBg: "bg-sky-100 text-sky-900 border-sky-300",
  },
  {
    id: "research",
    label: "IN RESEARCH 🔬",
    color: "#06b6d4",
    bg: "bg-cyan-500 text-white border-cyan-600",
    badgeBg: "bg-cyan-100 text-cyan-900 border-cyan-300",
  },
];

export function resolveMilestoneStatus(m: TimelineMilestone, idx = 0): {
  label: string;
  bg: string;
  color: string;
  style?: React.CSSProperties;
} {
  const rawStatus = (m.status || "").toLowerCase().trim();
  const rawLabel = (m.statusLabel || "").trim();

  // If a custom statusLabel is explicitly given
  if (rawLabel) {
    if (m.statusColor) {
      return {
        label: rawLabel,
        bg: "text-white border-black/20",
        color: m.statusColor,
        style: { backgroundColor: m.statusColor, borderColor: m.statusColor },
      };
    }
    // Check known presets
    const match = MILESTONE_STATUS_PRESETS.find(
      (p) => p.id === rawStatus || rawLabel.toLowerCase().includes(p.id)
    );
    if (match) {
      return { label: rawLabel, bg: match.bg, color: match.color };
    }
    return {
      label: rawLabel,
      bg: "bg-stone-800 text-white border-stone-900",
      color: "#292524",
    };
  }

  // If status is a known key
  if (rawStatus) {
    const match = MILESTONE_STATUS_PRESETS.find((p) => p.id === rawStatus);
    if (match) {
      return { label: match.label, bg: match.bg, color: match.color };
    }
  }

  // Default intelligent fallback based on position index
  if (idx === 0) {
    return {
      label: "COMPLETED ✦",
      bg: "bg-emerald-500 text-white border-emerald-600",
      color: "#10b981",
    };
  }
  if (idx === 1) {
    return {
      label: "ACTIVE EXECUTION 🟢",
      bg: "bg-amber-400 text-black border-black",
      color: "#f59e0b",
    };
  }
  return {
    label: "NEXT HORIZON 🚀",
    bg: "bg-indigo-500 text-white border-indigo-600",
    color: "#6366f1",
  };
}
