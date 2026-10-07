// Project information, keyed by GitHub repository name.
//
// How it fits together (see src/lib/projects.ts):
//   - GitHub (live API, or the build-time snapshot) decides which of my repositories exist.
//   - This file adds what GitHub can't know: whether a project is featured, a plain summary,
//     real screenshots and the write-up for its own page. Everything here was checked against
//     each repo's code — don't add claims the code doesn't support.
//   - A new public repo with no entry here still shows up under "More projects" automatically.
//
// This file must stay free of browser-only imports: vite.config.ts reads it to create the
// static /projects/<slug>/ pages.

export interface ProjectImage {
  /** Base path in public/, e.g. "/projects/career-navigator" → "-480.webp", "-960.webp", … */
  src: string;
  /** Widths that exist on disk for this image. */
  widths: number[];
  /** Pixel ratio of the image (width / height). */
  ratio: number;
  alt: string;
  caption?: string;
}

export interface ProjectDetails {
  overview: string;
  problem?: string;
  features: string[];
  frontend?: string[];
  backend?: string[];
  database?: string[];
  ml?: string[];
  /** How the pieces fit together, in plain words. */
  implementation?: string;
  note?: string;
}

export interface CuratedProject {
  repo: string;
  /** Repository owner when it isn't my account (e.g. a team project hosted by a teammate). */
  owner?: string;
  title: string;
  /** One short sentence for cards. */
  summary: string;
  /** Small label above the title, e.g. "Full-stack web app". */
  kind: string;
  tech: string[];
  /** Featured projects lead the Development section; the rest go under "More projects". */
  featured?: boolean;
  /** Lower comes first among featured projects. */
  order?: number;
  liveUrl?: string;
  /** Card image (16:10). */
  cover?: ProjectImage;
  /** Extra screenshots for the project page. */
  gallery?: ProjectImage[];
  /** Projects with a slug get their own page at /projects/<slug>/. */
  slug?: string;
  details?: ProjectDetails;
}

/** Repositories that aren't projects (profile README, this website itself). */
export const excludedRepos = new Set(["pratiksijapati", "MyPortfolio"]);

const desktop = (name: string, alt: string, caption?: string): ProjectImage => ({
  src: `/projects/${name}`,
  widths: [480, 960, 1440],
  ratio: 16 / 10,
  alt,
  caption,
});
const phone = (name: string, alt: string, caption?: string): ProjectImage => ({
  src: `/projects/${name}`,
  widths: [390, 780],
  ratio: 780 / 1688,
  alt,
  caption,
});
const legacyShot = (name: string, alt: string): ProjectImage => ({
  src: `/projects/${name}`,
  widths: [480, 960],
  ratio: 16 / 10,
  alt,
});

export const curatedProjects: CuratedProject[] = [
  {
    repo: "ai-career-recommendation-system",
    slug: "career-navigator",
    title: "Career Navigator",
    kind: "Full-stack app · ML-based recommendations",
    summary:
      "Recommends a career path from a student's scores, skills and interests: domain, role, specialization, skill gap and a roadmap.",
    tech: ["React", "FastAPI", "Python", "scikit-learn", "Tailwind CSS"],
    featured: true,
    order: 1,
    cover: desktop("career-navigator", "Career Navigator home page: “Find a career path that fits you.”"),
    gallery: [
      desktop("career-navigator-wizard", "The assessment form with academic score sliders", "The assessment asks about scores, skills, work style and interests."),
      desktop("career-navigator-results", "A recommendation result showing the best-matching domain and why", "Results explain why a domain was recommended."),
      desktop("career-navigator-explore", "Explore Careers page listing career domains", "Students can browse every domain and role without taking the quiz."),
      desktop("career-navigator-data", "Data Analysis page with students per domain", "A data page shows what the models were trained on."),
      desktop("career-navigator-models", "Model Performance page for the domain and role models", "A model page reports how each model performs."),
    ],
    details: {
      overview:
        "A career recommendation and discovery app for students in Nepal. It goes step by step: domain, then role, then specialization, then the skills you're missing and a roadmap to get there.",
      problem:
        "Many students only know a handful of careers. The app helps in two ways: you can browse every career without a quiz, or fill in your profile and get recommendations that go down to specific specializations and technologies.",
      features: [
        "Career explorer for browsing every domain, role and specialization",
        "Recommendation flow: domain → role → specialization → skill gap → roadmap",
        "Each recommendation comes with plain reasons, comparing your profile with students in that field",
        "Data analysis and model performance pages",
      ],
      frontend: ["React", "Vite", "React Router", "Tailwind CSS", "Recharts", "Axios"],
      backend: ["Python", "FastAPI", "Pydantic"],
      ml: ["scikit-learn: Random Forest, Nearest Neighbors, K-Means", "pandas", "NumPy"],
      database: ["No database: a generated CSV dataset built from a hand-written career taxonomy"],
      implementation:
        "The React app calls a FastAPI backend. Random Forest models pick the domain and then the role, a nearest-neighbours search ranks specializations, and the technologies for each specialization come from a lookup table rather than a model. The models train when the API starts and stay in memory.",
      note: "The training data is generated, not collected from real students. The repository explains this.",
    },
  },
  {
    repo: "discipline-os",
    slug: "discipline-os",
    title: "Discipline OS",
    kind: "Full-stack web app · PWA",
    summary: "A planner that shows what to do right now, and tracks your schedule, tasks and habits as a daily score.",
    tech: ["React", "TypeScript", "Django", "Django REST Framework", "PostgreSQL", "JWT"],
    featured: true,
    order: 2,
    liveUrl: "https://discipline-os-omega.vercel.app",
    cover: {
      src: "/projects/discipline-os",
      widths: [480, 960, 1440],
      ratio: 16 / 10,
      alt: "Three Discipline OS screens: My Day timeline, the Today page with the current task, and Habits",
    },
    gallery: [
      phone("discipline-os-today", "Today page with the current task and the next one", "Today shows what to do now and what's next."),
      phone("discipline-os-myday", "My Day timeline with completed and upcoming blocks", "My Day is the timeline for the day."),
      phone("discipline-os-habits", "Habits page with weekly check marks", "Habits with a simple week view."),
      phone("discipline-os-tasks", "Tasks page with today's tasks", "Tasks without a fixed time."),
    ],
    details: {
      overview:
        "A mobile-first web app for keeping a daily routine. It brings your schedule, tasks, habits, workouts and goals into one place and turns them into a daily score from 0 to 100.",
      problem:
        "Plans, tasks and habits usually live in different apps, so it's hard to see what you should be doing right now. Discipline OS puts the current task first.",
      features: [
        "Today page with the current task, the next one and a quick add button",
        "Repeating day plans, tasks, habits, workouts and goals",
        "A daily score with streaks, and a lighter “Minimum Day” for hard days",
        "Progress charts and a weekly summary",
        "Reminders through web push notifications",
        "Installable on a phone, with light and dark themes",
      ],
      frontend: ["React", "TypeScript", "Vite", "React Router", "TanStack Query"],
      backend: ["Python", "Django", "Django REST Framework", "JWT authentication"],
      database: ["PostgreSQL"],
      implementation:
        "A React app talks to a Django REST API using JWT authentication. Each user's data is kept separate in PostgreSQL. The frontend is hosted on Vercel and the API on Render, and both deploy automatically when I push to GitHub.",
      note: "Screenshots show a demo account with sample data.",
    },
  },
  {
    repo: "Inventory-Management-System",
    title: "Inventory Management System",
    kind: "College project · PHP + MySQL",
    summary: "An inventory app for a small store: login, adding and selling products, stock, returns and reports.",
    tech: ["PHP", "MySQL", "HTML", "CSS"],
    featured: true,
    order: 3,
    cover: legacyShot("inventory", "Inventory Management System home screen with links to products, stock and reports"),
  },
  {
    repo: "HRQuest",
    owner: "uttamshr10",
    title: "HRQuest",
    kind: "Group college project · PHP + MySQL",
    summary: "An HR portal with separate areas for applicants, employees and managers: jobs, attendance and payroll.",
    tech: ["PHP", "MySQL", "JavaScript", "CSS"],
    featured: true,
    order: 4,
    cover: legacyShot("hrquest", "HRQuest landing page"),
  },
  {
    repo: "Career-Recommendation-System",
    title: "Career Recommendation System (v1)",
    kind: "Earlier version of Career Navigator",
    summary: "The first version of my career recommender, with a React dashboard and a FastAPI backend.",
    tech: ["React", "FastAPI", "scikit-learn"],
  },
  {
    repo: "salary-prediction-linear-regression",
    title: "Salary Prediction",
    kind: "Machine learning exercise",
    summary: "Linear regression that predicts salary from years of experience, with a small Streamlit app.",
    tech: ["Python", "scikit-learn", "Streamlit"],
  },
  {
    repo: "customer-segmentation-kmeans",
    title: "Customer Segmentation",
    kind: "Machine learning exercise",
    summary: "K-Means clustering of customers by income and spending score, with a Streamlit dashboard.",
    tech: ["Python", "scikit-learn", "Streamlit"],
  },
  {
    repo: "Gym-UI",
    title: "Gym Website",
    kind: "Early frontend project",
    summary: "A responsive gym landing page with programs and pricing.",
    tech: ["HTML", "CSS"],
  },
  {
    repo: "Quiz",
    title: "Quiz App",
    kind: "Early frontend project",
    summary: "A small multiple-choice quiz in JavaScript.",
    tech: ["JavaScript"],
  },
  {
    repo: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    kind: "Early frontend project",
    summary: "The two-player game in the browser.",
    tech: ["JavaScript"],
  },
  {
    repo: "calculator",
    title: "Calculator",
    kind: "Early frontend project",
    summary: "A basic calculator in HTML, CSS and JavaScript.",
    tech: ["JavaScript"],
  },
  {
    repo: "to-do-list",
    title: "To-Do List",
    kind: "Early frontend project",
    summary: "A small to-do list layout.",
    tech: ["HTML", "CSS"],
  },
  {
    repo: "coffee-shop",
    title: "Coffee Shop Website",
    kind: "Early frontend project",
    summary: "A coffee shop landing page in HTML and CSS.",
    tech: ["HTML", "CSS"],
  },
  {
    repo: "Amazon-Clone",
    title: "Amazon Clone",
    kind: "Layout practice",
    summary: "A copy of Amazon's layout to practise CSS.",
    tech: ["HTML", "CSS"],
  },
  {
    repo: "Zomato-Clone",
    title: "Zomato Clone",
    kind: "Layout practice",
    summary: "A copy of Zomato's layout to practise CSS.",
    tech: ["HTML", "CSS"],
  },
  {
    repo: "Instagram-Clone",
    title: "Instagram Clone",
    kind: "Layout practice",
    summary: "A copy of Instagram's layout to practise CSS.",
    tech: ["HTML", "CSS"],
  },
];

/** Projects that get their own page — read by vite.config.ts to create static HTML for each. */
export const projectPages = curatedProjects
  .filter((p): p is CuratedProject & { slug: string } => !!p.slug)
  .map((p) => ({ slug: p.slug, title: p.title, description: p.summary }));
