"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContactSection } from "@/components/sections/ContactSection";

export default function ContactPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#contact");
  }, [router]);

  return <ContactSection id="contact" />;
}
