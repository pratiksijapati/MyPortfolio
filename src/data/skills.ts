// Skill names only — no levels or percentages. Every item is backed by a project,
// the Karkhana work, or the CV. Keep it that way when adding new ones.

export interface Skill {
  name: string;
  /** simple-icons slug, see src/components/TechIcon.tsx */
  icon?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "React", icon: "react" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
      { name: "Vite", icon: "vite" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    skills: [
      { name: "Python", icon: "python" },
      { name: "Django", icon: "django" },
      { name: "Django REST Framework" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "REST APIs" },
      { name: "JWT auth", icon: "jsonwebtokens" },
      { name: "PHP", icon: "php" },
    ],
  },
  {
    id: "database",
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
    ],
  },
  {
    id: "design",
    title: "Product & Design",
    skills: [
      { name: "Figma", icon: "figma" },
      { name: "UI design" },
      { name: "Product design" },
      { name: "Responsive design" },
      { name: "Developer handoff" },
      { name: "Canva" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
    ],
  },
];

/** Shown as one small line, not a full group. */
export const exploring = {
  title: "Exploring",
  text: "Machine learning with Python and scikit-learn (see Career Navigator).",
};
