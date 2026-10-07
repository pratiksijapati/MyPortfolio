// Work history, newest first. Keep it in line with the master CV.

export interface Experience {
  role: string;
  organization: string;
  /** Free text, e.g. "2026 – Present" or "Mar 2026 – Present". */
  period: string;
  location?: string;
  summary: string;
  responsibilities: string[];
  tags: string[];
}

export const experience: Experience[] = [
  {
    role: "Full-Stack Developer",
    organization: "Karkhana",
    period: "2026 – Present",
    location: "Kathmandu, Nepal",
    summary: "I build features for Karkhana's internal operations platform: sales, inventory, production, dispatch and finance.",
    responsibilities: [
      "Design Django models and REST APIs and connect them to React screens",
      "Build inventory, production and dispatch workflows, including the business rules behind them",
      "Add role-based permissions and a dashboard for each department",
    ],
    tags: ["React", "TypeScript", "Django REST Framework", "PostgreSQL"],
  },
  {
    role: "Product & UI/UX Designer",
    organization: "Karkhana",
    period: "2025 – 2026",
    location: "Kathmandu, Nepal",
    summary: "I designed the screens for the same operations platform, plus education and print work.",
    responsibilities: [
      "Designed dashboards, forms, tables and detail views in Figma for Sales, Inventory and Production",
      "Designed role-specific screens for Sales Admin, BDO, Inventory and Production staff",
      "Changed designs based on staff feedback and worked with developers during the build",
      "Designed the Classroom Progress Tracker, plus event, print and social media materials",
    ],
    tags: ["Figma", "Product design", "UI design", "Visual design"],
  },
];
