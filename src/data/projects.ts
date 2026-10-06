// Curated information about projects, keyed by GitHub repository name.
//
// How it fits together (see src/lib/projects.ts):
//   - GitHub (live API, or the build-time snapshot) decides WHICH of my repositories exist.
//   - This file adds what GitHub can't know: category, featured status, a better summary,
//     a screenshot and the detail write-up. Everything here was verified from each repo's
//     code/README — don't add claims that the code doesn't support.
//   - A new public repo with no entry here still appears under "All projects" automatically,
//     using its GitHub description and language.

export type ProjectCategory = "fullstack" | "frontend" | "backend" | "ai" | "college" | "other";

export const categoryLabels: Record<ProjectCategory, string> = {
  fullstack: "Full Stack",
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI / ML",
  college: "College",
  other: "Other",
};

export interface ProjectDetails {
  overview: string;
  problem?: string;
  features: string[];
  frontend?: string[];
  backend?: string[];
  database?: string[];
  ml?: string[];
  architecture?: string;
  note?: string;
}

export interface CuratedProject {
  repo: string;
  /** Repository owner when it isn't my account (e.g. a team project hosted by a teammate). */
  owner?: string;
  title: string;
  summary: string;
  /** Short label shown on the card, e.g. "Full-stack web app". */
  kind: string;
  categories: ProjectCategory[];
  tech: string[];
  featured?: boolean;
  /** Lower comes first. Featured projects are ordered by this; others by last update. */
  order?: number;
  liveUrl?: string;
  /** Screenshot in public/projects/ — base name; a 480w and 960w .webp exist for each. */
  image?: string;
  details?: ProjectDetails;
}

/** Repositories that aren't projects (profile/config repos, this website itself). */
export const excludedRepos = new Set(["pratiksijapati", "MyPortfolio"]);

export const curatedProjects: CuratedProject[] = [
  {
    repo: "discipline-os",
    title: "Discipline OS",
    kind: "Full-stack web app · PWA",
    summary:
      "An installable personal-discipline app that brings schedule, tasks, habits, workouts and goals into one place and turns them into a daily discipline score.",
    categories: ["fullstack", "frontend", "backend"],
    tech: ["React", "TypeScript", "Django", "DRF", "PostgreSQL", "JWT", "PWA"],
    featured: true,
    order: 1,
    liveUrl: "https://discipline-os-omega.vercel.app",
    details: {
      overview:
        "A mobile-first Progressive Web App for personal discipline: a daily schedule built from repeating templates, tasks, habits, workouts, goals and a short night review, combined into a computed 0–100 discipline score with streaks and progress charts.",
      problem:
        "Plans, habits and goals usually live in separate apps, so it's hard to know what to do right now. Discipline OS answers “what should I do now?” and makes finishing it satisfying.",
      features: [
        "Today view with NOW / NEXT, Today's Focus and Quick Add",
        "Repeating day plans, tasks, morning routine, habits, workouts and goals with streaks",
        "Daily discipline score calculated from only the parts you use, plus a lighter “Minimum Day” mode",
        "Progress charts and a weekly insight, drawn with hand-built SVG components",
        "Web Push reminders (VAPID) with an honest per-device status",
        "Wake-up challenge using on-device camera movement detection or math",
        "Installable PWA that opens offline, with light and dark themes",
      ],
      frontend: ["React 19", "TypeScript", "Vite", "React Router", "TanStack Query", "CSS Modules", "vite-plugin-pwa"],
      backend: ["Python", "Django 5.2", "Django REST Framework", "SimpleJWT authentication", "pywebpush"],
      database: ["PostgreSQL (Neon)"],
      architecture:
        "A React single-page app on Vercel talks to a Django REST API on Render over HTTPS with JWT auth; the API stores every user's data in PostgreSQL on Neon and never returns another user's records. A scheduled job calls the API every minute to send due reminders, and pushes to main auto-deploy both halves.",
    },
  },
  {
    repo: "ai-career-recommendation-system",
    title: "Career Navigator",
    kind: "Full-stack AI app",
    summary:
      "A hierarchical career recommendation and discovery system for Nepali students — Domain → Role → Specialization → Technology — with explainable, ML-backed suggestions.",
    categories: ["fullstack", "ai", "backend", "frontend"],
    tech: ["React", "FastAPI", "Python", "scikit-learn", "pandas", "Tailwind CSS", "Recharts"],
    featured: true,
    order: 2,
    details: {
      overview:
        "A career recommendation and discovery system that works through a four-level hierarchy (Domain → Role → Specialization → Technology), using a different, deliberately chosen method at each level.",
      problem:
        "Many students only know a handful of careers. The app tackles two problems: career awareness (a browsable Career Explorer, no quiz required) and career matching (a recommendation wizard that goes down to specific specializations and technologies).",
      features: [
        "Career Explorer for browsing every domain, role and specialization",
        "Four-step recommendation wizard: domain, role, specialization and technologies",
        "Explainable results — real reasons comparing your profile with the average of students in that field",
        "Skill-gap analysis and an education-stage-aware learning roadmap",
        "Data-analysis and model-performance pages, including K-Means student archetypes",
      ],
      frontend: ["React 19", "Vite", "React Router", "Tailwind CSS", "Recharts", "axios"],
      backend: ["Python", "FastAPI", "Uvicorn", "Pydantic"],
      ml: [
        "scikit-learn: Random Forest (domain level, plus a per-domain role cascade)",
        "K-Nearest Neighbours for specialization relevance",
        "K-Means clustering for student archetypes",
        "pandas, NumPy",
      ],
      database: ["No database — a synthetic CSV dataset generated from a hand-authored career taxonomy"],
      architecture:
        "A React SPA calls a FastAPI REST API (explorer, recommendation, skill-gap, roadmap, EDA and model endpoints). Models are trained when the API starts and cached in memory; technologies come from a lookup table, not a model.",
      note: "The training data is synthetic and documented as such in the repository.",
    },
  },
  {
    repo: "Inventory-Management-System",
    title: "Inventory Management System",
    kind: "College project · PHP + MySQL",
    summary:
      "A web-based inventory system for a retail store — login, adding and selling products, stock levels, sales returns and reports — built with PHP and MySQL.",
    categories: ["college", "backend", "fullstack"],
    tech: ["PHP", "MySQL", "HTML", "CSS"],
    featured: true,
    order: 3,
    image: "inventory",
    details: {
      overview:
        "A server-rendered PHP application for managing a retail store's inventory, built as a college project.",
      problem: "Keeping track of products, sales and returns by hand is slow and error-prone for a small store.",
      features: [
        "Login against a users table",
        "Add products and sell products",
        "Current stock view",
        "Sales returns",
        "Reports",
      ],
      frontend: ["HTML", "CSS"],
      backend: ["PHP (mysqli)"],
      database: ["MySQL"],
      architecture: "Classic server-rendered PHP pages that read and write a MySQL database through mysqli.",
    },
  },
  {
    repo: "HRQuest",
    owner: "uttamshr10",
    title: "HRQuest",
    kind: "Group college project · PHP + MySQL",
    summary:
      "An HR management portal with separate user, employee and manager areas — job applications, employee management, payroll and attendance tracking.",
    categories: ["college", "backend", "fullstack"],
    tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    featured: true,
    order: 4,
    image: "hrquest",
    details: {
      overview:
        "A web portal for human-resource management built as a group college project. The repository is hosted on a teammate's GitHub account.",
      features: [
        "Public careers page with job details and online applications",
        "Applicant review — accept or reject candidates",
        "Separate dashboards for admin, employees and users",
        "Employee management, attendance tracking and payroll",
        "Registration, login and password changes",
      ],
      frontend: ["HTML", "CSS", "JavaScript"],
      backend: ["PHP (mysqli)"],
      database: ["MySQL"],
      architecture: "Server-rendered PHP pages with role-specific dashboards, backed by a MySQL database.",
    },
  },
  {
    repo: "Career-Recommendation-System",
    title: "Career Recommendation System (v1)",
    kind: "Full-stack AI app · earlier version",
    summary:
      "The first version of my career recommender: a React dashboard with EDA and model pages on top of a FastAPI + scikit-learn backend.",
    categories: ["fullstack", "ai"],
    tech: ["React", "FastAPI", "Python", "scikit-learn", "Tailwind CSS", "Recharts"],
  },
  {
    repo: "salary-prediction-linear-regression",
    title: "Salary Prediction",
    kind: "Machine learning",
    summary:
      "Supervised learning with Linear Regression to predict salary from years of experience, with a training script, performance metrics and an interactive Streamlit app.",
    categories: ["ai"],
    tech: ["Python", "scikit-learn", "pandas", "Streamlit"],
  },
  {
    repo: "customer-segmentation-kmeans",
    title: "Customer Segmentation",
    kind: "Machine learning",
    summary:
      "Unsupervised learning with K-Means to segment customers by annual income and spending score, with synthetic data generation and a Streamlit dashboard.",
    categories: ["ai"],
    tech: ["Python", "scikit-learn", "pandas", "Streamlit"],
  },
  {
    repo: "Gym-UI",
    title: "Gym Center Website",
    kind: "Frontend",
    summary: "A responsive gym landing page with programs, reasons to join and pricing plans.",
    categories: ["frontend"],
    tech: ["HTML", "CSS"],
  },
  {
    repo: "Quiz",
    title: "Quiz App",
    kind: "Frontend · JavaScript",
    summary: "A simple multiple-choice quiz in the browser with question flow and answer checking in JavaScript.",
    categories: ["frontend"],
    tech: ["JavaScript", "HTML", "CSS"],
  },
  {
    repo: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    kind: "Frontend · JavaScript",
    summary: "The classic two-player game in the browser, with game logic written in vanilla JavaScript.",
    categories: ["frontend"],
    tech: ["JavaScript", "HTML", "CSS"],
    image: "tictactoe",
  },
  {
    repo: "calculator",
    title: "Calculator",
    kind: "Frontend · JavaScript",
    summary: "A simple online calculator for basic arithmetic, built with HTML, CSS and JavaScript.",
    categories: ["frontend"],
    tech: ["JavaScript", "HTML", "CSS"],
    image: "calculator",
  },
  {
    repo: "to-do-list",
    title: "To-Do List",
    kind: "Frontend · practice",
    summary: "A small to-do list interface built with HTML and CSS.",
    categories: ["frontend"],
    tech: ["HTML", "CSS"],
  },
  {
    repo: "coffee-shop",
    title: "Coffee Shop Website",
    kind: "Frontend",
    summary: "A visually rich coffee shop website with a warm aesthetic, built with HTML and CSS.",
    categories: ["frontend"],
    tech: ["HTML", "CSS"],
    image: "coffee",
  },
  {
    repo: "Amazon-Clone",
    title: "Amazon Clone",
    kind: "UI clone",
    summary: "A responsive recreation of Amazon's shopping interface, built to practise complex layouts with HTML and CSS.",
    categories: ["frontend"],
    tech: ["HTML", "CSS"],
    image: "amazon",
  },
  {
    repo: "Zomato-Clone",
    title: "Zomato Clone",
    kind: "UI clone",
    summary: "A responsive recreation of Zomato's restaurant-discovery interface in HTML and CSS.",
    categories: ["frontend"],
    tech: ["HTML", "CSS"],
    image: "zomato",
  },
  {
    repo: "Instagram-Clone",
    title: "Instagram Clone",
    kind: "UI clone",
    summary: "A responsive recreation of Instagram's interface, built with HTML and CSS.",
    categories: ["frontend"],
    tech: ["HTML", "CSS"],
    image: "instagram",
  },
];
