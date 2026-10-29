export type CoverMediaType = "image" | "video";
export type MagazineBgType = "kinetic-masthead" | "ticker-stream" | "minimal-grid" | "none";

export interface PortfolioSettings {
  coverMediaUrl: string;
  coverMediaType: CoverMediaType;
  coverImage?: string; // backwards compatibility
  coverImageFit: "cover" | "contain";
  coverImagePosition: "top" | "center" | "bottom";
  name: string;
  tagline: string;
  subrole: string;
  role?: string;
  location?: string;
  whereAndWhat?: string;
  statement?: string;
  showName?: boolean;
  showRole?: boolean;
  showLocation?: boolean;
  showWhereAndWhat?: boolean;
  showStatement?: boolean;
  showSocialLinks?: boolean;
  bgDesignType?: MagazineBgType;
  bgDesignText?: string;
  showBgDesign?: boolean;
  greetingText?: string;
  showGreeting?: boolean;
  currentPositionTag?: string;
  showQuickMatrix?: boolean;
  showChapterLinks?: boolean;
  whatIDo?: {
    number: string;
    title: string;
    description: string;
  }[];
  currentlyExploring?: {
    number: string;
    title: string;
    description: string;
  }[];
}

export const defaultSettings: PortfolioSettings = {
  coverMediaUrl: "https://ik.imagekit.io/1mkdyxchg/mine%20(1).png",
  coverMediaType: "image",
  coverImage: "https://ik.imagekit.io/1mkdyxchg/mine%20(1).png",
  coverImageFit: "cover",
  coverImagePosition: "top",
  name: "HARSH ARYAN",
  tagline: "DESIGN · CODE · CREATE",
  subrole: "Designer · Developer · AI & Data Science",
  role: "Teaching Assistant At IIT Madras",
  location: "Chennai, India",
  whereAndWhat: "1st Year B.Tech CSE (AI & Data Science) · Building foundations in Code, Math & Models",
  statement: "Crafting interfaces at the intersection of modern design and artificial intelligence.",
  showName: true,
  showRole: true,
  showLocation: true,
  showWhereAndWhat: false,
  showStatement: false,
  showSocialLinks: true,
  bgDesignType: "none",
  bgDesignText: "HARSH ARYAN",
  showBgDesign: false,
  greetingText: "HEY THERE, I'M HARSH — WELCOME TO MY ARCHIVE",
  showGreeting: true,
  currentPositionTag: "CURRENT WORKING POSITION",
  showQuickMatrix: true,
  showChapterLinks: true,
  whatIDo: [
    {
      number: "01",
      title: "Design",
      description: "Crafting intuitive, restrained, and typography-driven visual experiences.",
    },
    {
      number: "02",
      title: "Development",
      description: "Building performant, modern web applications from the ground up.",
    },
    {
      number: "03",
      title: "AI & Data",
      description: "Exploring applied machine learning, exploratory analysis, and data modeling.",
    },
    {
      number: "04",
      title: "Creative Experiments",
      description: "Prototyping interactive tools, creative computing, and novel ideas.",
    },
  ],
  currentlyExploring: [
    {
      number: "01",
      title: "Web Development",
      description: "Modern full-stack architectures, Next.js, and fluid web experiences.",
    },
    {
      number: "02",
      title: "UI/UX",
      description: "Minimalist aesthetics, micro-interactions, and typography hierarchy.",
    },
    {
      number: "03",
      title: "Artificial Intelligence",
      description: "Foundational algorithms, linear algebra, and machine learning models.",
    },
    {
      number: "04",
      title: "Data Science",
      description: "Data wrangling, statistical analysis, and visual storytelling.",
    },
  ],
};

export const SETTINGS_STORAGE_KEY = "harsh_editorial_portfolio_settings_v2";
