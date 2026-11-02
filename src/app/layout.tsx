import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { MagazineNav } from "@/components/MagazineNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { FluidBackground } from "@/components/FluidBackground";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Harsh Aryan",
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
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/app-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-transparent text-black" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/app-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee&family=Caveat:wght@600;700&family=Dela+Gothic+One&family=Patrick+Hand&family=Permanent+Marker&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;900&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio-theme');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-news-texture flex flex-col antialiased selection:bg-indigo-600 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200 pb-24 md:pb-0">
        <ThemeProvider>
          <PortfolioProvider>
            <FluidBackground />
            <ScrollProgressBar />
            <MagazineNav />
            <div className="relative z-10 flex-1 flex flex-col">{children}</div>
          </PortfolioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
