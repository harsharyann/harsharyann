"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface AutoPageTurnProps {
  nextPath: string;
  nextTitle: string;
  subtitle?: string;
  isReturnToStart?: boolean;
}

export function AutoPageTurn({
  nextPath,
  nextTitle,
  isReturnToStart = false,
}: AutoPageTurnProps) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const [isFading, setIsFading] = useState(false);

  // Pre-load the next route in background for instantaneous zero-lag loading
  useEffect(() => {
    router.prefetch(nextPath);
  }, [nextPath, router]);

  // Clean, buttery smooth navigation with zero screen jumping
  const goToNext = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsFading(true);

    setTimeout(() => {
      router.push(nextPath);
    }, 180);
  }, [nextPath, router]);

  // Natural scroll detection at the bottom of the page
  // Only triggers when the user has already scrolled all the way to the bottom
  // and deliberately scrolls down once more (natural page-turn gesture)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigatingRef.current) return;

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 15;

      // Only trigger if user is at the bottom AND scrolling downward deliberately
      if (isAtBottom && e.deltaY > 28) {
        goToNext();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isNavigatingRef.current || touchStartYRef.current === null) return;

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 15;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartYRef.current - currentY;

      // User swiped upward at the bottom -> proceed to next page
      if (isAtBottom && diffY > 38) {
        goToNext();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [goToNext]);

  return (
    <div
      className={`mt-16 pt-10 pb-12 border-t-2 border-dashed border-black flex flex-col items-center justify-center text-center space-y-4 transition-all duration-200 ${
        isFading ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <span className="font-mono text-[11px] font-bold text-stone-500 uppercase tracking-widest">
        {isReturnToStart ? "End of Portfolio" : "End of Section"}
      </span>

      <button
        type="button"
        onClick={goToNext}
        className="sketch-button-solid text-sm px-8 py-3.5 inline-flex items-center gap-2 group shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] transition-all"
        aria-label={`Go to ${nextTitle}`}
      >
        <span>Continue to {nextTitle}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>

      <p className="font-mono text-[11px] text-stone-500">
        Scroll down or click to continue →
      </p>
    </div>
  );
}
