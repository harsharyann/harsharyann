"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Root cover page (P.01) must NOT be trapped in ancestor 3D transforms or perspective bounds
  if (pathname === "/") {
    return <div className="w-full min-h-screen flex-1">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
