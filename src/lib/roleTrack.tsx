import React from "react";
import { FlaskConical, Briefcase, GraduationCap, Award, Zap } from "lucide-react";

export type RoleTrackType = "auto" | "research" | "internship" | "job" | "academic" | "fellowship";

export interface ResolvedRoleTrack {
  track: "research" | "internship" | "job" | "academic" | "fellowship";
  label: string;
  defaultTag: string;
  activeColor: string;
  isCustomColor: boolean;
  icon: React.ReactNode;
  beaconRing: string;
  beaconCore: string;
  labelColor: string;
  tagBg: string;
  cardBg: string;
  workplaceBadgeBg: string;
  workplaceAtColor: string;
  tagStyle?: React.CSSProperties;
  workplaceBadgeStyle?: React.CSSProperties;
  workplaceAtStyle?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
}

export const ROLE_TRACK_THEMES: Record<
  "research" | "internship" | "job" | "academic" | "fellowship",
  {
    hex: string;
    label: string;
    defaultTag: string;
    icon: (color?: string) => React.ReactNode;
    beaconRing: string;
    beaconCore: string;
    labelColor: string;
    tagBg: string;
    cardBg: string;
    workplaceBadgeBg: string;
    workplaceAtColor: string;
  }
> = {
  research: {
    hex: "#06b6d4",
    label: "Research · Active",
    defaultTag: "Research Lab",
    icon: (color) => <FlaskConical className="w-3 h-3 text-current shrink-0" style={color ? { color } : undefined} />,
    beaconRing: "bg-cyan-400",
    beaconCore: "bg-cyan-500",
    labelColor: "text-cyan-700 dark:text-cyan-400",
    tagBg: "bg-cyan-100/90 dark:bg-cyan-950/70 text-cyan-900 dark:text-cyan-200 border-cyan-400/40",
    cardBg: "from-cyan-50/95 via-sky-50/70 to-emerald-50/90 dark:from-[#0d1c24] dark:via-[#132533] dark:to-[#0d1c24]",
    workplaceBadgeBg: "bg-cyan-200/90 dark:bg-cyan-900/60 border-cyan-950/25 dark:border-cyan-400/30 text-cyan-950 dark:text-cyan-200",
    workplaceAtColor: "text-cyan-700 dark:text-cyan-400",
  },
  internship: {
    hex: "#f59e0b",
    label: "Internship · Active",
    defaultTag: "Industry Tech",
    icon: (color) => <Briefcase className="w-3 h-3 text-current shrink-0" style={color ? { color } : undefined} />,
    beaconRing: "bg-amber-400",
    beaconCore: "bg-amber-500",
    labelColor: "text-amber-800 dark:text-amber-400",
    tagBg: "bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-400/40",
    cardBg: "from-amber-50/95 via-orange-50/60 to-amber-50/95 dark:from-[#211910] dark:via-[#2b2015] dark:to-[#211910]",
    workplaceBadgeBg: "bg-amber-200/90 dark:bg-amber-900/60 border-amber-950/25 dark:border-amber-400/30 text-amber-950 dark:text-amber-200",
    workplaceAtColor: "text-amber-700 dark:text-amber-400",
  },
  fellowship: {
    hex: "#8b5cf6",
    label: "Fellowship · Appointed",
    defaultTag: "Fellowship",
    icon: (color) => <Award className="w-3 h-3 text-current shrink-0" style={color ? { color } : undefined} />,
    beaconRing: "bg-purple-400",
    beaconCore: "bg-purple-500",
    labelColor: "text-purple-700 dark:text-purple-400",
    tagBg: "bg-purple-100/90 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 border-purple-400/40",
    cardBg: "from-purple-50/95 via-indigo-50/60 to-purple-50/95 dark:from-[#1b122c] dark:via-[#23173a] dark:to-[#1b122c]",
    workplaceBadgeBg: "bg-purple-200/90 dark:bg-purple-900/60 border-purple-950/25 dark:border-purple-400/30 text-purple-950 dark:text-purple-200",
    workplaceAtColor: "text-purple-700 dark:text-purple-400",
  },
  academic: {
    hex: "#10b981",
    label: "Academic · Teaching",
    defaultTag: "Affiliation",
    icon: (color) => <GraduationCap className="w-3 h-3 text-current shrink-0" style={color ? { color } : undefined} />,
    beaconRing: "bg-emerald-400",
    beaconCore: "bg-emerald-500",
    labelColor: "text-emerald-700 dark:text-emerald-400",
    tagBg: "bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-400/40",
    cardBg: "from-emerald-50/95 via-teal-50/60 to-emerald-50/95 dark:from-[#102018] dark:via-[#162a20] dark:to-[#102018]",
    workplaceBadgeBg: "bg-emerald-200/90 dark:bg-emerald-900/60 border-emerald-950/25 dark:border-emerald-400/30 text-emerald-950 dark:text-emerald-200",
    workplaceAtColor: "text-emerald-700 dark:text-emerald-400",
  },
  job: {
    hex: "#10b981",
    label: "Active Role · Current",
    defaultTag: "Production",
    icon: (color) => <Zap className="w-3 h-3 text-current shrink-0" style={color ? { color } : undefined} />,
    beaconRing: "bg-emerald-400",
    beaconCore: "bg-emerald-500",
    labelColor: "text-emerald-700 dark:text-emerald-400",
    tagBg: "bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-400/40",
    cardBg: "from-emerald-50/95 via-teal-50/60 to-emerald-50/95 dark:from-[#102018] dark:via-[#162a20] dark:to-[#102018]",
    workplaceBadgeBg: "bg-emerald-200/90 dark:bg-emerald-900/60 border-emerald-950/25 dark:border-emerald-400/30 text-emerald-950 dark:text-emerald-200",
    workplaceAtColor: "text-emerald-700 dark:text-emerald-400",
  },
};

export function resolveRoleTrack(
  role = "",
  workplace = "",
  explicitType = "auto",
  customColor = "",
  customStatusText = "",
  customIcon = "",
  cardStyleMode = "paper"
): ResolvedRoleTrack {
  const combined = `${role} ${workplace}`.toLowerCase();
  
  let track: "research" | "internship" | "job" | "academic" | "fellowship" = "job";
  
  if (explicitType && explicitType !== "auto") {
    track = explicitType as any;
  } else {
    // Smart auto-detection based on keywords
    if (combined.includes("research") || combined.includes("fellow") || combined.includes("scientist") || combined.includes("lab")) {
      track = "research";
    } else if (combined.includes("intern") || combined.includes("co-op") || combined.includes("trainee")) {
      track = "internship";
    } else if (combined.includes("teaching") || combined.includes("ta") || combined.includes("mentor") || combined.includes("tutor") || combined.includes("nptel")) {
      track = "academic";
    } else if (combined.includes("scholar") || combined.includes("fellowship")) {
      track = "fellowship";
    } else {
      track = "job";
    }
  }

  const chosenTheme = ROLE_TRACK_THEMES[track] || ROLE_TRACK_THEMES.job;
  const isCustomColor = Boolean(customColor && customColor.trim());
  const activeColor = isCustomColor ? customColor.trim() : chosenTheme.hex;

  // Custom status label override if provided
  const label = customStatusText && customStatusText.trim() ? customStatusText.trim() : chosenTheme.label;

  // Custom icon override if provided
  const icon = customIcon && customIcon.trim() ? (
    <span className="text-[11px] leading-none shrink-0" aria-hidden="true">
      {customIcon.trim()}
    </span>
  ) : (
    chosenTheme.icon(activeColor)
  );

  // Compute dynamic styles that guarantee 100% color sync
  const tagStyle: React.CSSProperties = {
    backgroundColor: `${activeColor}16`,
    borderColor: `${activeColor}55`,
    color: activeColor,
  };

  const workplaceBadgeStyle: React.CSSProperties = {
    backgroundColor: `${activeColor}1a`,
    borderColor: `${activeColor}60`,
    color: activeColor,
  };

  const workplaceAtStyle: React.CSSProperties = {
    color: activeColor,
  };

  const cardStyle: React.CSSProperties | undefined =
    cardStyleMode === "bordered"
      ? { borderColor: activeColor }
      : cardStyleMode === "tinted"
      ? {
          borderColor: activeColor,
          background: `linear-gradient(135deg, rgba(255, 253, 246, 0.98) 0%, ${activeColor}12 50%, rgba(255, 253, 246, 0.98) 100%)`,
        }
      : undefined;

  return {
    track,
    label,
    defaultTag: chosenTheme.defaultTag,
    activeColor,
    isCustomColor,
    icon,
    beaconRing: chosenTheme.beaconRing,
    beaconCore: chosenTheme.beaconCore,
    labelColor: chosenTheme.labelColor,
    tagBg: chosenTheme.tagBg,
    cardBg: chosenTheme.cardBg,
    workplaceBadgeBg: chosenTheme.workplaceBadgeBg,
    workplaceAtColor: chosenTheme.workplaceAtColor,
    tagStyle,
    workplaceBadgeStyle,
    workplaceAtStyle,
    cardStyle,
  };
}
