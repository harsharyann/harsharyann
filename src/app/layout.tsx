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

/**
 * Dynamic Pro SEO Metadata Generator
 * Automatically updates whenever user modifies personal info, projects, skills or headline in Admin!
 */
export async function generateMetadata(): Promise<Metadata> {
  const data = getStoredPortfolioData();
  const personal = data.personal || {};
  const name = personal.name?.trim() || "Harsh Aryan";
  const role = (personal.role || personal.currentWork || "AI & Data Science Developer").trim();
  const headline = (personal.headline || personal.bio || "Exploring Data Science, Machine Learning Foundations & Scientific Computing.").slice(0, 160).trim();
  const college = personal.college?.trim() || "IIT Madras";
  const photoUrl = personal.aboutPhotoUrl || personal.coverPhotoUrl || "/app-logo.png";

  // Dynamic SEO keywords extracted from user's current projects, skills & technologies
  const skillNames = (data.skills || []).flatMap((g) => g.items || []);
  const projectTitles = (data.projects || []).map((p) => p.title);
  const projectTechs = (data.projects || []).flatMap((p) => p.technologies || []);
  const customKeywords = Array.from(
    new Set([
      name,
      `${name} ${college}`,
      `${name} Portfolio`,
      role,
      `${role} ${college}`,
      college,
      "AI Developer",
      "Data Science",
      "Machine Learning Engineer",
      "Python Developer",
      "IIT Madras Data Science",
      "Scientific Computing",
      "Deep Learning",
      "Creative Developer Portfolio",
      ...skillNames.slice(0, 10),
      ...projectTitles.slice(0, 6),
      ...projectTechs.slice(0, 6),
    ])
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Harsh Aryan",
      template: `%s | Harsh Aryan`,
    },
    description: headline,
    keywords: customKeywords,
    authors: [
      {
        name,
        url: data.socialLinks?.github || "https://github.com/harsharyann",
      },
    ],
    creator: name,
    publisher: name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${name} | ${role} • ${college}`,
      description: headline,
      url: "/",
      siteName: `${name} Portfolio`,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: photoUrl,
          width: 1200,
          height: 630,
          alt: `${name} — ${role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${role} • ${college}`,
      description: headline,
      creator: "@harsharyann",
      images: [photoUrl],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialPortfolioData = getStoredPortfolioData();
  const personal = initialPortfolioData.personal || {};
  const name = personal.name?.trim() || "Harsh Aryan";
  const role = (personal.role || personal.currentWork || "Teaching Assistant & AI Developer").trim();
  const college = personal.college?.trim() || "IIT Madras";
  const bio = personal.bio || personal.headline || "Machine Learning & Scientific Computing Developer.";
  const headline = personal.headline || bio;
  const photoUrl = personal.aboutPhotoUrl || personal.coverPhotoUrl || `${siteUrl}/app-logo.png`;

  const allSkills = (initialPortfolioData.skills || []).flatMap((g) => g.items || []);
  const sameAsList = Object.values(initialPortfolioData.socialLinks || {}).filter(
    (u): u is string => typeof u === "string" && u.startsWith("http")
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name,
        jobTitle: role,
        worksFor: {
          "@type": "CollegeOrUniversity",
          name: college,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: college,
        },
        description: bio,
        image: photoUrl,
        email: personal.email ? `mailto:${personal.email}` : undefined,
        url: siteUrl,
        sameAs: sameAsList,
        knowsAbout: allSkills.length > 0 ? allSkills : [
          "Artificial Intelligence",
          "Machine Learning",
          "Data Science",
          "Python",
          "Deep Learning",
          "Scientific Computing",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: personal.currentCity || "Chennai",
          addressCountry: personal.currentCountry || "India",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: `${name} Portfolio`,
        url: siteUrl,
        description: headline,
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: `${name} | Official Sketchbook Portfolio`,
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
      },
      // Dynamic CreativeWork / SoftwareSourceCode for all live projects
      ...((initialPortfolioData.projects && initialPortfolioData.projects.length > 0)
        ? [
            {
              "@type": "ItemList",
              name: "Featured Engineering & AI Projects",
              itemListElement: initialPortfolioData.projects.map((p, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                item: {
                  "@type": "SoftwareSourceCode",
                  name: p.title,
                  description: p.description,
                  programmingLanguage: p.technologies?.join(", "),
                  codeRepository: p.githubUrl || undefined,
                  url: p.liveUrl || p.githubUrl || `${siteUrl}/#projects`,
                },
              })),
            },
          ]
        : []),
      // Dynamic Laurels / Certificates Credentials
      ...((initialPortfolioData.certificates && initialPortfolioData.certificates.length > 0)
        ? [
            {
              "@type": "ItemList",
              name: "Academic Honors & Professional Certifications",
              itemListElement: initialPortfolioData.certificates.map((c, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                item: {
                  "@type": "EducationalOccupationalCredential",
                  name: c.title,
                  credentialCategory: c.issuer,
                  url: c.credentialUrl || `${siteUrl}/#certificates`,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <html lang="en" className="bg-transparent text-black" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
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
