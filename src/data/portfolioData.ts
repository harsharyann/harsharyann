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
}

export interface LaurelItem {
  id: string;
  type: "award" | "paper" | "book";
  title: string;
  issuerOrPublisher: string;
  date: string;
  roleOrAward?: string;
  link?: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  isVisible?: boolean;
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
}

export interface DailyThought {
  dayIndex: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayName: string;
  persona: string;
  quote: string;
}

export const DEFAULT_DAILY_THOUGHTS: DailyThought[] = [
  {
    dayIndex: 0,
    dayName: "Sunday",
    persona: "The Philosopher",
    quote: "Teach machines to learn. Never stop learning yourself.",
  },
  {
    dayIndex: 1,
    dayName: "Monday",
    persona: "The Dreamer",
    quote: "Every great invention begins with an unreasonable idea.",
  },
  {
    dayIndex: 2,
    dayName: "Tuesday",
    persona: "The Builder",
    quote: "Dreams don't compile themselves. Start building.",
  },
  {
    dayIndex: 3,
    dayName: "Wednesday",
    persona: "The Thinker",
    quote: "Somewhere between logic and imagination, I build.",
  },
  {
    dayIndex: 4,
    dayName: "Thursday",
    persona: "The Explorer",
    quote: "Stay curious. The universe has more bugs than features.",
  },
  {
    dayIndex: 5,
    dayName: "Friday",
    persona: "The Creator",
    quote: "Code is how I turn 'what if' into 'what's next'.",
  },
  {
    dayIndex: 6,
    dayName: "Saturday",
    persona: "The Rebel",
    quote: "Why follow the blueprint when you can invent one?",
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
    coverPhotoUrl?: string;
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
    showMobileCurrentRole?: boolean;
    showDevelopmentTrajectory?: boolean;
    showExperienceSection?: boolean;
    showLaurelsSection?: boolean;
    laurelsTitle?: string;
    laurelsSubtitle?: string;
    aboutPhotoTag?: string;
    aboutCurrentWork?: string;
    aboutWorkPlace?: string;
    aboutHighlightedWords?: string;
    aboutHighlightColor?: string;
    aboutZoneBadge?: string;
    aboutHeading?: string;
    aboutSubtitle?: string;
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
    coverPhotoUrl: "https://drive.google.com/file/d/1xLUZJagj-wfrrB2I3KAg-OLb95feTxHA/view?usp=sharing",
    desktopWordmark: "HARSH ARYAN",
    desktopRole: "Teaching Assistant • IIT Madras",
    desktopHeadline: "Exploring Data Science, Machine Learning Foundations & Scientific Computing.",
    desktopTagline: "DESIGN · CODE · MACHINE LEARNING",
    mobileBadge1: "TA IIT Madras",
    mobileBadge2: "AI & Data Science",
    mobileTagline: "Teaching Machines To Learn • Building Scientific Software",
    showMobileCurrentRole: true,
    showDevelopmentTrajectory: true,
    showExperienceSection: true,
    showLaurelsSection: true,
    laurelsTitle: "Laurels, Research & Published Works",
    laurelsSubtitle: "Academic accolades, peer-reviewed research papers, and published technical literature.",
    aboutPhotoTag: "✦ TA @ IIT MADRAS",
    aboutCurrentWork: "Teaching Assistant",
    aboutWorkPlace: "IIT Madras",
    aboutHighlightedWords: "Harsh Aryan, IIT Madras, Artificial Intelligence, Data Science, Machine Learning",
    aboutHighlightColor: "#f59e0b",
    aboutZoneBadge: "✦ THE ARCHITECT & MIND",
    aboutHeading: "Behind the Terminal",
    aboutSubtitle: "Curious mind blending machine learning fundamentals with expressive software architecture. Here is who I am, how I build, and where I am headed.",
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
    contactStampText: "DISPATCH VERIFIED",
    contactStampCode: "IND // 2026",
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
    { value: "AI & DS", label: "Specialization", sublabel: "Machine Learning & Analytics" },
    { value: "6+", label: "Python & ML Projects", sublabel: "Hands-on implementations" },
    { value: "6", label: "Certifications", sublabel: "Courses & Hackathons" },
    { value: "150+", label: "Coding Problems", sublabel: "Python, C & Logic building" },
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
    },
    {
      category: "Data Science & Analysis",
      items: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "Data Cleaning & EDA"],
    },
    {
      category: "Machine Learning (Foundations)",
      items: ["Scikit-Learn", "Linear & Logistic Regression", "Decision Trees & Random Forests", "PyTorch (Basic Tensors & CNNs)", "Transfer Learning"],
    },
    {
      category: "Web & Deployment Basics",
      items: ["Streamlit (Interactive Apps)", "FastAPI (Basic Endpoints)", "HTML5 & Tailwind CSS", "Kaggle Notebooks", "Google Colab"],
    },
    {
      category: "Mathematics for ML",
      items: ["Linear Algebra (Matrices & Vectors)", "Calculus (Derivatives & Gradients)", "Probability & Descriptive Statistics", "Discrete Math"],
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

  certificateCategories: [
    "Machine Learning",
    "Data Science",
    "Programming",
    "Mathematics & Hackathons",
  ],

  certificates: [
    {
      id: "deeplearning-ai-ml",
      title: "Supervised Machine Learning: Regression and Classification",
      issuer: "DeepLearning.AI & Stanford Online (Coursera)",
      issueDate: "2025",
      credentialId: "DLAI-ML-2025-HA",
      credentialUrl: "https://coursera.org",
      category: "Machine Learning",
      skillsLearned: ["Linear Regression", "Logistic Regression", "Gradient Descent", "Cost Functions", "Overfitting & Regularization"],
      description: "Mastered core supervised learning algorithms taught by Andrew Ng, including cost function formulation, vectorization in NumPy, and feature scaling.",
    },
    {
      id: "imperial-linear-algebra",
      title: "Mathematics for Machine Learning: Linear Algebra",
      issuer: "Imperial College London (Coursera)",
      issueDate: "2025",
      credentialId: "ICL-LA-2025-98",
      credentialUrl: "https://coursera.org",
      category: "Mathematics & Hackathons",
      skillsLearned: ["Matrix Transformations", "Eigenvalues & Eigenvectors", "Dot Products", "Basis Vectors", "Gram-Schmidt"],
      description: "Rigorous mathematical course on vector spaces, linear transformations, orthogonal projections, and principal component analysis (PCA) intuition.",
    },
    {
      id: "ibm-python-ds",
      title: "Python for Data Science, AI & Development",
      issuer: "IBM (Coursera)",
      issueDate: "2025",
      credentialId: "IBM-PYDS-2025",
      credentialUrl: "https://coursera.org",
      category: "Data Science",
      skillsLearned: ["Python OOP", "Pandas", "NumPy", "REST APIs", "Web Scraping with BeautifulSoup"],
      description: "Comprehensive hands-on training in Python programming, working with external APIs, data extraction, and manipulation using Pandas dataframes.",
    },
    {
      id: "kaggle-pandas-ml",
      title: "Kaggle Learn: Intro to Machine Learning & Pandas",
      issuer: "Kaggle / Google",
      issueDate: "2025",
      credentialId: "KAGGLE-CERT-HA",
      credentialUrl: "https://kaggle.com",
      category: "Data Science",
      skillsLearned: ["Data Exploration", "Model Validation (MAE)", "Random Forests", "Handling Missing Values"],
      description: "Practical micro-courses completing real-world housing price prediction benchmarks and data cleaning challenges on Kaggle.",
    },
    {
      id: "hackerrank-sql",
      title: "SQL (Basic & Intermediate) Skill Certificate",
      issuer: "HackerRank",
      issueDate: "2025",
      credentialId: "HR-SQL-VERIFIED",
      credentialUrl: "https://hackerrank.com",
      category: "Programming",
      skillsLearned: ["Joins & Unions", "GROUP BY & HAVING", "Subqueries", "Aggregations", "Conditional Queries"],
      description: "Verified assessment validating relational database query skills, joining multiple tables, and extracting analytical insights.",
    },
    {
      id: "college-hackathon-2025",
      title: "Freshman TechFest Hackathon — 2nd Runner Up",
      issuer: "College Innovation Council & Student Chapter",
      issueDate: "2025",
      credentialId: "TF-HACK-2025-03",
      category: "Mathematics & Hackathons",
      skillsLearned: ["Fast Prototyping", "Streamlit", "Team Collaboration", "Pitching to Faculty Judges"],
      description: "Built and pitched CampusIQ student assistant within 24 hours among 45+ competing teams, awarded Best Freshman Innovation.",
    },
  ],
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
  laurelItems: [
    {
      id: "laurel-1",
      type: "award",
      title: "Freshman TechFest Hackathon — 2nd Runner Up",
      issuerOrPublisher: "College Innovation Council & Student Chapter",
      date: "2025",
      roleOrAward: "2nd Runner Up (45+ Teams)",
      link: "https://github.com/harsharyann",
      description: "Pitched CampusIQ AI student assistant within 24 hours among 45+ collegiate teams, recognized for rapid prototyping and utility.",
      badge: "Hackathon Laurel",
      isVisible: true,
    },
    {
      id: "laurel-2",
      type: "paper",
      title: "Exploratory Latency Optimization in Edge Convolutional Networks",
      issuerOrPublisher: "Undergraduate Research Preprint / Symposium",
      date: "2025",
      roleOrAward: "Lead Author",
      link: "https://arxiv.org",
      description: "Study exploring tensor quantization techniques to achieve sub-15ms inference latencies on embedded edge devices using PyTorch.",
      badge: "Research Preprint",
      isVisible: true,
    },
    {
      id: "laurel-3",
      type: "book",
      title: "Foundations of Linear Algebra & Python for Beginners",
      issuerOrPublisher: "Self-Published Technical Monograph & Guide",
      date: "2026",
      roleOrAward: "Author & Compiler",
      link: "https://github.com/harsharyann",
      description: "A compact illustrated reference guide bridging matrix transformations, vector spaces, and NumPy code for machine learning students.",
      badge: "Open Volume",
      isVisible: true,
    },
  ],
  dailyThoughts: DEFAULT_DAILY_THOUGHTS,
};
