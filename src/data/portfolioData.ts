export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  technologies: string[];
  metrics: string[];
  features: string[];
  githubUrl: string;
  liveUrl?: string;
  imageGradient: string;
  color?: string;
  isVisible?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  category: string;
  skillsLearned: string[];
  description: string;
  verificationSource?: string;
  color?: string;
  isVisible?: boolean;
}

export interface LaurelItem {
  id: string;
  type: "award" | "paper" | "book" | "patent" | "fellowship" | "talk" | "hackathon" | "article" | string;
  title: string;
  issuerOrPublisher: string;
  date: string;
  roleOrAward?: string;
  link?: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  isVisible?: boolean;
  color?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  period: string;
  type?: string;
  description: string;
  highlights?: string[];
  skillsUsed?: string[];
  isCurrent?: boolean;
}

export interface TimelineMilestone {
  phaseNumber: string;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  status?: "completed" | "active" | "next" | "planned" | "research" | string;
  statusLabel?: string;
  statusColor?: string;
}

export interface DailyThought {
  dayIndex: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayName: string;
  persona: string;
  quote: string;
  personaColor?: string;
}

export const DEFAULT_DAY_PERSONA_COLORS: Record<number, string> = {
  0: "#8b5cf6", // Sunday (Purple • The Philosopher)
  1: "#a855f7", // Monday (Violet • The Dreamer)
  2: "#f97316", // Tuesday (Orange • The Builder)
  3: "#06b6d4", // Wednesday (Cyan • The Thinker)
  4: "#10b981", // Thursday (Emerald • The Explorer)
  5: "#ec4899", // Friday (Pink • The Creator)
  6: "#eab308", // Saturday (Gold • The Rebel)
};

export function resolveDailyThoughtColor(dayIndex: number, customColor?: string): string {
  if (customColor && customColor.trim()) return customColor.trim();
  return DEFAULT_DAY_PERSONA_COLORS[dayIndex] || "#8b5cf6";
}

export const DEFAULT_DAILY_THOUGHTS: DailyThought[] = [
  {
    dayIndex: 0,
    dayName: "Sunday",
    persona: "The Philosopher",
    quote: "Teach machines to learn. Never stop learning yourself.",
    personaColor: "#8b5cf6",
  },
  {
    dayIndex: 1,
    dayName: "Monday",
    persona: "The Dreamer",
    quote: "Every great invention begins with an unreasonable idea.",
    personaColor: "#a855f7",
  },
  {
    dayIndex: 2,
    dayName: "Tuesday",
    persona: "The Builder",
    quote: "Dreams don't compile themselves. Start building.",
    personaColor: "#f97316",
  },
  {
    dayIndex: 3,
    dayName: "Wednesday",
    persona: "The Thinker",
    quote: "Somewhere between logic and imagination, I build.",
    personaColor: "#06b6d4",
  },
  {
    dayIndex: 4,
    dayName: "Thursday",
    persona: "The Explorer",
    quote: "Stay curious. The universe has more bugs than features.",
    personaColor: "#10b981",
  },
  {
    dayIndex: 5,
    dayName: "Friday",
    persona: "The Creator",
    quote: "Code is how I turn 'what if' into 'what's next'.",
    personaColor: "#ec4899",
  },
  {
    dayIndex: 6,
    dayName: "Saturday",
    persona: "The Rebel",
    quote: "Why follow the blueprint when you can invent one?",
    personaColor: "#eab308",
  },
];

export interface PortfolioData {
  personal: {
    name: string;
    role: string;
    headline: string;
    bio: string;
    college: string;
    degree: string;
    year: string;
    cgpa?: string;
    location: string;
    availability: string;
    email: string;
    resumeUrl: string;
    aboutPhotoUrl?: string;
    aboutPhotoZoom?: number;
    aboutPhotoPositionX?: number;
    aboutPhotoPositionY?: number;
    coverPhotoUrl?: string;
    coverPhotoZoom?: number;
    coverPhotoPositionX?: number;
    coverPhotoPositionY?: number;
    desktopPhotoUrl?: string;
    desktopPhotoZoom?: number;
    desktopPhotoPositionX?: number;
    desktopPhotoPositionY?: number;
    mobilePhotoUrl?: string;
    mobilePhotoZoom?: number;
    mobilePhotoPositionX?: number;
    mobilePhotoPositionY?: number;
    desktopWordmark?: string;
    desktopRole?: string;
    desktopHeadline?: string;
    desktopTagline?: string;
    desktopPhotoChip?: string;
    desktopPhotoTag?: string;
    desktopEyebrow?: string;
    mobileBadge1?: string;
    mobileBadge2?: string;
    mobileTagline?: string;
    showDesktopCurrentRole?: boolean;
    showMobileCurrentRole?: boolean;
    coverPersonaColor?: string;
    coverRoleTrackColor?: string;
    locationBadgeColor?: string;
    showAboutRole?: boolean;
    showEducationBadge?: boolean;
    aboutEducationDegree?: string;
    aboutEducationCollege?: string;
    showDevelopmentTrajectory?: boolean;
    showExperienceSection?: boolean;
    showLaurelsSection?: boolean;
    laurelsTitle?: string;
    laurelsSubtitle?: string;
    aboutPhotoTag?: string;
    aboutCurrentWork?: string;
    aboutWorkPlace?: string;
    aboutRoleType?: string;
    aboutRoleTag?: string;
    aboutHighlightedWords?: string;
    aboutHighlightColor?: string;
    aboutZoneBadge?: string;
    aboutHeading?: string;
    aboutSubtitle?: string;
    projectsHeading?: string;
    projectsSubtitle?: string;
    certificatesHeading?: string;
    certificatesSubtitle?: string;
    experienceTitle?: string;
    experienceSubtitle?: string;
    currentCountry?: string;
    currentCity?: string;
    currentWork?: string;
    currentStatusNote?: string;
    currentTimezone?: string;
    currentTimezoneIana?: string;
    contactTitle?: string;
    contactSubtitle?: string;
    contactDoodleNote?: string;
    contactFormTitle?: string;
    contactMailboxNote?: string;
    contactButtonText?: string;
    contactSuccessMessage?: string;
    contactEmailLabel?: string;
    contactCoordinatesTitle?: string;
    currentStationBadge?: string;
    contactStampText?: string;
    contactStampCode?: string;
    projectsNavIcon?: "foldercode" | "code" | "folder" | "terminal" | "layers";
    coverDailyThoughtHeader?: string;
    coverDailyThoughtQuote?: string;
    coverDailyThoughtAuthor?: string;
    coverDailyThoughtSignature?: string;
    footerBrandName?: string;
    footerSubtitle?: string;
    footerTagline?: string;
    footerEasterEggText?: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    kaggle?: string;
    leetcode?: string;
    email: string;
  };
  quickStats: {
    value: string;
    label: string;
    sublabel: string;
    tag?: string;
    icon?: string;
    color?: string;
  }[];
  education: {
    institution: string;
    degree: string;
    duration: string;
    status: string;
    score: string;
    courses: string[];
  };
  schooling: {
    institution: string;
    board: string;
    stream: string;
    year: string;
    percentage: string;
  };
  projectCategories?: string[];
  projects: Project[];
  skills: {
    category: string;
    items: string[];
    icon?: string;
    color?: string;
  }[];
  experiences?: Experience[];
  milestones?: TimelineMilestone[];
  certificateCategories?: string[];
  certificates: Certificate[];
  laurelItems?: LaurelItem[];
  dailyThoughts?: DailyThought[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Harsh Aryan",
    role: "AI & Data Science Specialist & Teaching Assistant",
    headline: "Exploring Data Science, Machine Learning Foundations & Scientific Computing.",
    bio: "Hi! I am Harsh Aryan, a curious 1st-year undergraduate student passionate about Artificial Intelligence, Data Science, and Mathematics. I spend my time mastering Python, Linear Algebra, Exploratory Data Analysis, and fundamental Machine Learning algorithms. I am eager to learn, build practical projects, participate in hackathons, and secure early internship opportunities.",
    college: "IIT Madras",
    degree: "Data Science and Applications",
    year: "Undergraduate",
    cgpa: "Active Student",
    location: "India & Open for Remote Opportunities",
    availability: "Seeking Summer 2026 Early Internships & Hackathon Collaborations",
    email: "harsharyan@outlook.com",
    resumeUrl: "/Harsh_Aryan_Resume.pdf",
    aboutPhotoUrl: "https://drive.google.com/file/d/1xLUZJagj-wfrrB2I3KAg-OLb95feTxHA/view?usp=sharing",
    aboutPhotoZoom: 1,
    aboutPhotoPositionX: 50,
    aboutPhotoPositionY: 20,
    coverPhotoUrl: "https://drive.google.com/file/d/1xLUZJagj-wfrrB2I3KAg-OLb95feTxHA/view?usp=sharing",
    coverPhotoZoom: 1,
    coverPhotoPositionX: 50,
    coverPhotoPositionY: 20,
    desktopPhotoUrl: "https://drive.google.com/file/d/1xLUZJagj-wfrrB2I3KAg-OLb95feTxHA/view?usp=sharing",
    desktopPhotoZoom: 1,
    desktopPhotoPositionX: 50,
    desktopPhotoPositionY: 20,
    mobilePhotoUrl: "https://drive.google.com/file/d/1xLUZJagj-wfrrB2I3KAg-OLb95feTxHA/view?usp=sharing",
    mobilePhotoZoom: 1,
    mobilePhotoPositionX: 50,
    mobilePhotoPositionY: 20,
    desktopWordmark: "HARSH ARYAN",
    desktopRole: "Teaching Assistant • IIT Madras",
    desktopHeadline: "Exploring Data Science, Machine Learning Foundations & Scientific Computing.",
    desktopTagline: "DESIGN · CODE · MACHINE LEARNING",
    mobileBadge1: "TA IIT Madras",
    mobileBadge2: "AI & Data Science",
    mobileTagline: "Teaching Machines To Learn • Building Scientific Software",
    showDesktopCurrentRole: true,
    showMobileCurrentRole: true,
    coverPersonaColor: "",
    coverRoleTrackColor: "",
    locationBadgeColor: "",
    showAboutRole: true,
    showEducationBadge: true,
    aboutEducationDegree: "Data Science and Applications",
    aboutEducationCollege: "IIT Madras",
    showDevelopmentTrajectory: true,
    showExperienceSection: true,
    showLaurelsSection: true,
    laurelsTitle: "LAURELS",
    laurelsSubtitle: "Academic accolades, hackathon triumphs, research publications & technical literature.",
    aboutPhotoTag: "✦ TA @ IIT MADRAS",
    aboutCurrentWork: "Teaching Assistant",
    aboutWorkPlace: "IIT Madras",
    aboutRoleType: "auto",
    aboutRoleTag: "",
    aboutHighlightedWords: "Harsh Aryan, IIT Madras, Artificial Intelligence, Data Science, Machine Learning",
    aboutHighlightColor: "#f59e0b",
    aboutZoneBadge: "✦ THE ARCHITECT & MIND",
    aboutHeading: "Behind the Terminal",
    aboutSubtitle: "Curious mind blending machine learning fundamentals with expressive software architecture. Here is who I am, how I build, and where I am headed.",
    projectsHeading: "Projects and Builds",
    projectsSubtitle: "End-to-end exploratory data analysis, foundational machine learning algorithms, and scientific Python tools engineered with clean code and mathematical rigor.",
    certificatesHeading: "Certifications and Laurels",
    certificatesSubtitle: "Verified academic achievements, hackathon laurels, and institutional recognitions presented in compact widescreen landscape prints.",
    experienceTitle: "WORK & LEADERSHIP",
    experienceSubtitle: "A chronological flight track of engineering leadership, academic mentorship, and industry contributions.",
    currentCountry: "India",
    currentCity: "Chennai, India",
    currentWork: "Teaching Assistant @ IIT Madras",
    currentStatusNote: "Active & Open for Opportunities",
    currentTimezone: "Asia/Kolkata (UTC+5:30 IST)",
    currentTimezoneIana: "Asia/Kolkata",
    contactTitle: "Send a Dispatch",
    contactSubtitle: "Have an interesting machine learning challenge, internship opportunity, or algorithmic project in mind? Drop your inquiry directly into my terminal.",
    contactDoodleNote: "drop a note anytime 💌",
    contactFormTitle: "DIRECT INQUIRY DISPATCH",
    contactMailboxNote: "direct dispatch 📬",
    contactButtonText: "SEND DISPATCH",
    contactSuccessMessage: "Thank you! Your message has been received directly. I will follow up shortly.",
    contactEmailLabel: "ELECTRONIC MAIL",
    contactCoordinatesTitle: "CURRENT COORDINATES",
    currentStationBadge: "LIVE STATION",
    projectsNavIcon: "foldercode",
    coverDailyThoughtHeader: "A LITTLE THOUGHT FOR TODAY",
    coverDailyThoughtQuote: "Every great invention begins with an unreasonable idea.",
    coverDailyThoughtAuthor: "The Dreamer",
    coverDailyThoughtSignature: "Harsh's Daily Thoughts",
    footerBrandName: "HARSH ARYAN",
    footerSubtitle: "Teaching machines to learn • Scientific software",
    footerTagline: "crafting with code & mathematics",
    footerEasterEggText: "socius",
  },

  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    kaggle: "https://kaggle.com",
    leetcode: "https://leetcode.com",
    email: "mailto:harsharyan@outlook.com",
  },

  quickStats: [
    { value: "AI & DS", label: "Specialization", sublabel: "Machine Learning & Analytics", tag: "SPECIALTY", icon: "✨", color: "amber" },
    { value: "6+", label: "Python & ML Projects", sublabel: "Hands-on implementations", tag: "PROJECTS", icon: "⚡", color: "emerald" },
    { value: "5+", label: "Certifications", sublabel: "Courses & Hackathons", tag: "HONORS", icon: "🏆", color: "cyan" },
    { value: "150+", label: "Coding Problems", sublabel: "Python, DSA & Logic building", tag: "SOLVED", icon: "🔥", color: "rose" },
  ],

  education: {
    institution: "Department of Computer Science & Engineering",
    degree: "Computer Science & Engineering (Artificial Intelligence & Data Science)",
    duration: "2025 — 2029",
    status: "Active Academic Program",
    score: "Active Semesters",
    courses: [
      "Programming in Python & C",
      "Calculus & Linear Algebra",
      "Discrete Mathematics",
      "Basic Electronics & Logic Design",
      "Engineering Physics",
      "Introduction to Data Analysis",
    ],
  },

  schooling: {
    institution: "Higher Secondary School / Junior College",
    board: "CBSE / State Board",
    stream: "Science (Physics, Chemistry, Mathematics & Computer Science)",
    year: "Completed 2025",
    percentage: "90%+",
  },

  projectCategories: [],

  projects: [],

  skills: [
    {
      category: "Programming & Core Tools",
      items: ["Python (Primary)", "C / C++ (Data Structures)", "SQL (Basic Queries)", "Git & GitHub", "Linux / Bash (Basics)", "VS Code"],
      icon: "code",
      color: "amber",
    },
    {
      category: "Data Science & Analysis",
      items: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "Data Cleaning & EDA"],
      icon: "laptop",
      color: "emerald",
    },
    {
      category: "Machine Learning (Foundations)",
      items: ["Scikit-Learn", "Linear & Logistic Regression", "Decision Trees & Random Forests", "PyTorch (Basic Tensors & CNNs)", "Transfer Learning"],
      icon: "brain",
      color: "indigo",
    },
    {
      category: "Web & Deployment Basics",
      items: ["Streamlit (Interactive Apps)", "FastAPI (Basic Endpoints)", "HTML5 & Tailwind CSS", "Kaggle Notebooks", "Google Colab"],
      icon: "git",
      color: "cyan",
    },
    {
      category: "Mathematics for ML",
      items: ["Linear Algebra (Matrices & Vectors)", "Calculus (Derivatives & Gradients)", "Probability & Descriptive Statistics", "Discrete Math"],
      icon: "math",
      color: "rose",
    },
  ],

  experiences: [
    {
      id: "exp-1",
      role: "Teaching Assistant",
      company: "Indian Institute of Technology Madras (IIT Madras)",
      companyUrl: "https://www.iitm.ac.in",
      location: "Chennai, India",
      period: "2024 – Present",
      type: "Academic & Mentorship",
      isCurrent: true,
      description: "Guiding undergraduate student cohorts in fundamental computer science, Python programming, and algorithmic problem-solving methodologies.",
      highlights: [
        "Mentoring 150+ students through hands-on computational labs and code reviews.",
        "Assisting course instructors in designing rigorous algorithm and data structure problem sets.",
        "Hosting interactive problem-solving clinics bridging mathematical theory with Python code."
      ],
      skillsUsed: ["Python", "Algorithms", "Data Structures", "Computational Thinking", "Mentorship"]
    }
  ],

  certificateCategories: [],

  certificates: [],
  milestones: [
    {
      phaseNumber: "01",
      period: "Foundations",
      title: "Algorithmic Intuition & Logic",
      subtitle: "Python, C & Core Problem Solving",
      description:
        "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems.",
    },
    {
      phaseNumber: "02",
      period: "Data & Math",
      title: "Exploratory Modeling & Linear Algebra",
      subtitle: "Vectorized Computations & Analytics",
      description:
        "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks.",
    },
    {
      phaseNumber: "03",
      period: "Frontiers",
      title: "Modern AI Systems & Interactive Tools",
      subtitle: "Full-Stack AI Prototypes & Deployment",
      description:
        "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows.",
    },
  ],
  laurelItems: [],
  dailyThoughts: DEFAULT_DAILY_THOUGHTS,
};
