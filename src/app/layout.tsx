import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { MagazineNav } from "@/components/MagazineNav";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Harsh Aryan — Creative Sketchbook Portfolio",
  description:
    "Hand-drawn sketchbook portfolio of Harsh Aryan — AI & Data Science Developer.",
  keywords: [
    "Harsh Aryan",
    "Portfolio",
    "Sketchbook",
    "AI & Data Science",
    "Machine Learning",
    "Creative Developer",
  ],
  authors: [{ name: "Harsh Aryan" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white text-black" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-news-texture flex flex-col antialiased selection:bg-indigo-600 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
        <ThemeProvider>
          <ScrollProgressBar />
          <MagazineNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
