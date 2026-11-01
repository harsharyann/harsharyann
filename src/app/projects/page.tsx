"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectsSection } from "@/components/sections/ProjectsSection";

export default function ProjectsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#projects");
  }, [router]);

  return <ProjectsSection id="projects" />;
}
