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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@500;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,600;0,6..96,800;0,6..96,900;1,6..96,400;1,6..96,600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-news-texture flex flex-col antialiased selection:bg-[#e5c07b] selection:text-stone-950">
        <ScrollProgressBar />
        <MagazineNav />
        {children}
        <MagazineColophon />
      </body>
    </html>
  );
}
