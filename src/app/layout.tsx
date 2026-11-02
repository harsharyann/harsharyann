import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { MagazineNav } from "@/components/MagazineNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { FluidBackground } from "@/components/FluidBackground";
import { getStoredPortfolioData } from "@/lib/portfolioStore";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://harsharyan.dev";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Harsh Aryan | AI & Data Science Developer • Teaching Assistant @ IIT Madras",
    template: "%s | Harsh Aryan",
  },
  description:
    "Official sketchbook portfolio of Harsh Aryan — Teaching Assistant at IIT Madras, Machine Learning Developer & AI Researcher specializing in Deep Learning, Scientific Computing, and Python.",
  keywords: [
    "Harsh Aryan",
    "Harsh Aryan IIT Madras",
    "Teaching Assistant IIT Madras",
    "AI Developer",
    "Data Science",
    "Machine Learning Engineer",
    "Python Developer",
    "IIT Madras Data Science",
    "Scientific Computing",
    "Deep Learning",
    "Creative Developer Portfolio",
    "Portfolio",
    "AI & Data Science",
  ],
  authors: [{ name: "Harsh Aryan", url: "https://github.com/harsharyann" }],
  creator: "Harsh Aryan",
  publisher: "Harsh Aryan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Harsh Aryan | AI & Data Science Developer • IIT Madras",
    description:
      "Hand-drawn sketchbook portfolio of Harsh Aryan — Teaching Assistant at IIT Madras, Machine Learning Developer & AI Researcher.",
    url: "/",
    siteName: "Harsh Aryan Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/app-logo.png",
        width: 1200,
        height: 630,
        alt: "Harsh Aryan — AI & Data Science Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Aryan | AI & Data Science Developer • IIT Madras",
    description:
      "Hand-drawn sketchbook portfolio of Harsh Aryan — Teaching Assistant at IIT Madras, Machine Learning Developer & AI Researcher.",
    creator: "@harsharyann",
    images: ["/app-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/app-logo.png",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialPortfolioData = getStoredPortfolioData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Harsh Aryan",
        jobTitle: "Teaching Assistant & AI Developer",
        worksFor: {
          "@type": "CollegeOrUniversity",
          name: "IIT Madras",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "IIT Madras",
        },
        knowsAbout: [
          "Artificial Intelligence",
          "Machine Learning",
          "Data Science",
          "Python",
          "Deep Learning",
          "Scientific Computing",
        ],
        sameAs: [
          "https://github.com/harsharyann",
          "https://linkedin.com",
          "https://kaggle.com",
        ],
        url: siteUrl,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Harsh Aryan Portfolio",
        description:
          "Official hand-drawn sketchbook portfolio of Harsh Aryan — AI & Data Science Developer at IIT Madras.",
        url: siteUrl,
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
        inLanguage: "en-US",
      },
    ],
  };

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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
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
          <PortfolioProvider initialData={initialPortfolioData}>
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
