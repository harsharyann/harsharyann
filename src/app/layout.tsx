import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { MagazineNav } from "@/components/MagazineNav";
import { MagazineColophon } from "@/components/MagazineColophon";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090c",
};

export const metadata: Metadata = {
  title: "Harsh Aryan — Editorial Portfolio",
  description:
    "Personal magazine and editorial portfolio of Harsh Aryan — Designer, Developer, AI & Data Science.",
  keywords: [
    "Harsh Aryan",
    "Editorial Portfolio",
    "Designer",
    "Developer",
    "AI & Data Science",
    "Design Code Create",
  ],
  authors: [{ name: "Harsh Aryan" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-news-texture flex flex-col antialiased selection:bg-[#e5c07b] selection:text-stone-950">
        <ScrollProgressBar />
        <MagazineNav />
        {children}
        <MagazineColophon />
      </body>
    </html>
  );
}
