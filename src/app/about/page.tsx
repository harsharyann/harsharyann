"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AboutSection } from "@/components/sections/AboutSection";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#about");
  }, [router]);

  return <AboutSection id="about" />;
}
