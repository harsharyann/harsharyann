export interface PortfolioSettings {
  coverImage: string;
  coverImageFit: "cover" | "contain";
  coverImagePosition: "top" | "center" | "bottom";
  name: string;
  tagline: string;
  subrole: string;
  statement: string;
  location?: string;
  role?: string;
  whereAndWhat?: string;
  showLocation?: boolean;
  showRole?: boolean;
  showWhereAndWhat?: boolean;
  showStatement?: boolean;
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
  coverImage: "/harsh-cover.jpg",
  coverImageFit: "cover",
  coverImagePosition: "top",
  name: "HARSH ARYAN",
  tagline: "DESIGN · CODE · CREATE",
  subrole: "Designer · Developer · AI & Data Science",
  role: "Designer · Developer · AI & Data Science",
  location: "Chennai, India",
  whereAndWhat: "1st Year B.Tech CSE (AI & Data Science) · Building foundations in Code, Math & Models",
  statement: "Crafting interfaces at the intersection of modern design and artificial intelligence.",
  showLocation: true,
  showRole: true,
  showWhereAndWhat: true,
  showStatement: true,
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

export const SETTINGS_STORAGE_KEY = "harsh_editorial_portfolio_settings_v1";
