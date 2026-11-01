"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CertificatesSection } from "@/components/sections/CertificatesSection";

export default function CertificatesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#certificates");
  }, [router]);

  return <CertificatesSection id="certificates" />;
}
