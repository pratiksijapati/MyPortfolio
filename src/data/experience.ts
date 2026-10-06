// Work history. Add new roles at the top of the list; the timeline renders them in order.
// Facts match the master CV (C:\My daily schedule\CV) — keep the two in sync.

export interface Experience {
  role: string;
  organization: string;
  /** Free text so it can be "2026 – Present" or "Mar 2026 – Present". */
  period: string;
  location?: string;
  type?: string;
  summary: string;
  responsibilities: string[];
  tags: string[];
}

export const experience: Experience[] = [
  {
    role: "Full-Stack Developer",
    organization: "Karkhana",
    period: "2026 – Present",
    location: "Nepal",
    summary:
      "Developing full-stack features for a multi-module internal operations platform spanning sales, inventory, production, finance and dispatch.",
    responsibilities: [
      "Design Django models, serializers, migrations and REST API endpoints, and integrate them into React interfaces",
      "Build inventory, production and dispatch workflows — stock movements, requisitions, recipes/BOM, production jobs, deliveries and returns",
      "Implement role-based permissions for administrators and operational teams, plus dashboards for each department",
      "Translate Figma designs into React UI, and extend and debug the production codebase without breaking live workflows",
    ],
    tags: ["React", "TypeScript", "Django REST Framework", "PostgreSQL", "Role-based access", "Figma"],
  },
];
