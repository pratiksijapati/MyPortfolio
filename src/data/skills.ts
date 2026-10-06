// Every skill listed here is backed by a project in src/data/projects.ts or the
// experience in src/data/experience.ts. Keep it that way when adding new ones.

export interface Skill {
  name: string;
  /** simple-icons slug, see src/components/TechIcon.tsx */
  icon?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Responsive, accessible interfaces and installable web apps.",
    skills: [
      { name: "React", icon: "react" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Vite", icon: "vite" },
      { name: "TanStack Query", icon: "reactquery" },
      { name: "PWA" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "REST APIs, authentication and server-side logic.",
    skills: [
      { name: "Python", icon: "python" },
      { name: "Django", icon: "django" },
      { name: "Django REST Framework" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "PHP", icon: "php" },
      { name: "REST APIs" },
      { name: "JWT Authentication", icon: "jsonwebtokens" },
      { name: "Web Push" },
    ],
  },
  {
    id: "database",
    title: "Database",
    blurb: "Relational data modelling for real applications.",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
    ],
  },
  {
    id: "ai",
    title: "AI / ML",
    blurb: "Machine-learning features inside usable products.",
    skills: [
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "pandas", icon: "pandas" },
      { name: "NumPy", icon: "numpy" },
      { name: "Streamlit", icon: "streamlit" },
      { name: "Random Forest · KNN · K-Means" },
      { name: "Linear Regression" },
    ],
  },
  {
    id: "design",
    title: "Design",
    blurb: "Product thinking from wireframe to final UI.",
    skills: [
      { name: "UI/UX Design" },
      { name: "Figma", icon: "figma" },
      { name: "Wireframing" },
      { name: "Photo & Video Editing" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Deployment",
    blurb: "Shipping and running what I build.",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Vercel", icon: "vercel" },
      { name: "Render", icon: "render" },
      { name: "Neon", icon: "neon" },
    ],
  },
];
