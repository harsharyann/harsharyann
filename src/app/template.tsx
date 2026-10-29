"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Instantly scroll new page to top so it never jumps from old scroll position
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // Root cover page (P.01) must NOT be trapped in ancestor 3D transforms or perspective bounds
  if (pathname === "/") {
    return <div className="w-full min-h-screen flex-1">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
