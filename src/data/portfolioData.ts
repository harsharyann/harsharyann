export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "Machine Learning" | "Data Analysis" | "Web & AI Tools" | "Python Basics";
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
  category: "Machine Learning" | "Data Science" | "Programming" | "Mathematics & Hackathons";
  skillsLearned: string[];
  description: string;
}

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
  projects: Project[];
  skills: {
    category: string;
    items: string[];
  }[];
  certificates: Certificate[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Harsh Aryan",
    role: "1st Year B.Tech Student & AI/Data Science Enthusiast",
    headline: "Exploring Data Science, Machine Learning Foundations & Scientific Computing.",
    bio: "Hi! I am Harsh Aryan, a curious 1st-year undergraduate student passionate about Artificial Intelligence, Data Science, and Mathematics. I spend my time mastering Python, Linear Algebra, Exploratory Data Analysis, and fundamental Machine Learning algorithms. I am eager to learn, build practical projects, participate in hackathons, and secure early internship opportunities.",
    college: "Engineering College / University",
    degree: "B.Tech in Computer Science & Engineering (AI & Data Science)",
    year: "1st Year (Class of 2029)",
    cgpa: "Current 1st Year Student",
    location: "India & Open for Remote Opportunities",
    availability: "Seeking Summer 2026 Early Internships & Hackathon Collaborations",
    email: "harsharyan.dev@gmail.com",
    resumeUrl: "/Harsh_Aryan_Resume.pdf",
  },

  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    kaggle: "https://kaggle.com",
    leetcode: "https://leetcode.com",
    email: "mailto:harsharyan.dev@gmail.com",
  },

  quickStats: [
    { value: "1st Year", label: "Academic Standing", sublabel: "B.Tech CSE (AI & DS)" },
    { value: "6+", label: "Python & ML Projects", sublabel: "Hands-on implementations" },
    { value: "6", label: "Certifications", sublabel: "Courses & Hackathons" },
    { value: "150+", label: "Coding Problems", sublabel: "Python, C & Logic building" },
  ],

  education: {
    institution: "Department of Computer Science & Engineering",
    degree: "Bachelor of Technology (B.Tech) in CSE (Artificial Intelligence & Data Science)",
    duration: "2025 — 2029",
    status: "Currently in 1st Year (Semester 1 & 2)",
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

  projects: [
    {
      id: "student-score-analyzer",
      title: "Student Exam Performance EDA & Predictor",
      tagline: "Exploratory Data Analysis and regression modeling to predict exam scores.",
      description:
        "Analyzed a dataset of 1,000+ student records to uncover correlations between study hours, parental background, test preparation, and final test scores. Built an interactive Streamlit web dashboard with interactive Seaborn and Plotly charts.",
      category: "Data Analysis",
      technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-Learn", "Streamlit"],
      metrics: ["R² Score: 0.88", "1,000+ Records Analyzed", "Interactive UI"],
      features: [
        "Comprehensive data cleaning, outlier removal, and correlation heatmap visualization",
        "Trained Multiple Linear Regression and Random Forest models to estimate final marks",
        "Streamlit web interface allowing students to input weekly study hours and receive score estimates",
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://demo.example.com",
      imageGradient: "from-blue-600 via-indigo-700 to-purple-800",
    },
    {
      id: "pneumonia-xray-classifier",
      title: "Pneumonia Chest X-Ray Image Classifier",
      tagline: "Convolutional Neural Network (CNN) for chest radiography screening.",
      description:
        "Trained a binary image classifier using transfer learning on ResNet18 to distinguish healthy lungs from pneumonia in chest X-ray scans. Applied image augmentation techniques (rotation, zooming, normalization) to prevent overfitting.",
      category: "Machine Learning",
      technologies: ["Python", "PyTorch", "Torchvision", "OpenCV", "Matplotlib", "Kaggle API"],
      metrics: ["91.2% Test Accuracy", "5,800+ X-Ray Images", "ResNet18 Fine-Tuned"],
      features: [
        "Data preprocessing pipeline with random horizontal flips and intensity normalization",
        "Fine-tuned pre-trained weights using cross-entropy loss and Adam optimizer",
        "Generated confusion matrix and classification reports with Scikit-learn",
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://demo.example.com",
      imageGradient: "from-emerald-600 via-teal-700 to-cyan-800",
    },
    {
      id: "campus-bot",
      title: "CampusIQ — Smart Student Resource & FAQ Bot",
      tagline: "Intelligent Q&A tool for 1st-year college syllabus, timetables, and notes.",
      description:
        "Developed a lightweight local document assistant that parses 1st-year college syllabus PDFs and academic calendars to answer common freshman queries instantly using TF-IDF and keyword matching.",
      category: "Web & AI Tools",
      technologies: ["Python", "FastAPI", "NLTK", "PyPDF2", "Tailwind CSS", "HTML5"],
      metrics: ["Sub-50ms response", "100% Offline Capable", "Freshman Friendly"],
      features: [
        "PDF text extraction and cleaning pipeline for university syllabi and course schedules",
        "Cosine similarity matcher returning relevant book recommendations and exam dates",
        "Clean responsive web interface accessible from mobile phones across campus Wi-Fi",
      ],
      githubUrl: "https://github.com",
      imageGradient: "from-amber-600 via-orange-700 to-red-800",
    },
    {
      id: "crypto-stock-tracker",
      title: "MarketPulse — Financial Trend & Moving Average Dashboard",
      tagline: "Real-time stock price tracker with technical moving average indicators.",
      description:
        "A Python project fetching daily financial data using Yahoo Finance API, calculating 20-day & 50-day Simple Moving Averages (SMA), and rendering interactive candlestick charts.",
      category: "Python Basics",
      technologies: ["Python", "yfinance", "Plotly", "Pandas", "Streamlit"],
      metrics: ["Real-Time Ticker API", "50-Day SMA Trends", "Zero Latency"],
      features: [
        "Vectorized calculation of Exponential and Simple Moving Averages in Pandas",
        "Interactive zoomable candlestick charts powered by Plotly",
        "Exportable summary reports in CSV format for personal tracking",
      ],
      githubUrl: "https://github.com",
      imageGradient: "from-purple-600 via-pink-700 to-rose-800",
    },
  ],

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
};
