// Product & UI/UX design work at Karkhana (2025 – 2026).
//
// Text here comes from my designer CV. Don't add research, personas, testing or metrics
// unless they really happened.
//
// IMAGES: add real exports from Figma (PNG/JPG) — never mock-ups. For each image:
//   1. put a 16:10 export in public/design/, named e.g. ops-dashboard-1600.webp and ops-dashboard-800.webp
//      (or ask me to convert the raw exports for you)
//   2. add { src: "/design/ops-dashboard", alt: "…", caption: "…" } to the matching `images` list.
// Sections without images show a simple cover instead.

export interface DesignImage {
  /** Base path; "-800.webp" and "-1600.webp" must exist. */
  src: string;
  alt: string;
  caption?: string;
}

export interface DesignArea {
  id: string;
  title: string;
  summary: string;
  points: string[];
  images: DesignImage[];
}

export const designCaseStudy = {
  slug: "karkhana",
  title: "Karkhana Product & UI/UX Work",
  subtitle: "Product Design · UI Design · Education Design · Visual Communication",
  period: "2025 – 2026",
  role: "Product & UI/UX Designer",
  tools: ["Figma", "Canva"],
  summary:
    "Screens for Karkhana's internal operations platform, a classroom progress tracker, and print and social media work.",
  overview:
    "From 2025 to 2026 I worked as a Product & UI/UX Designer at Karkhana. Most of my time went into the internal platform the teams use for sales, inventory and production. I also designed a classroom progress tracker and a range of printed and social media material.",
  problem:
    "Each team works with different data and has its own daily tasks. The platform needed screens that fit how each team actually works, while still feeling like one system as more modules were added.",
  myRole: [
    "Designed the screens in Figma",
    "Took feedback from the staff who would use them and changed the designs",
    "Worked with the developers while the screens were built",
    "Later joined development and built some of these screens in React myself",
  ],
  decisions: [
    "Reuse the same table, filter and form patterns across modules, so each new module feels familiar",
    "Give each role (Sales Admin, BDO, Inventory, Production) its own screens with only what that role needs",
    "Break long processes such as requisitions and damage reports into focused, step-by-step screens",
  ],
  collaboration:
    "I worked closely with the developers during the build and adjusted designs when something didn't fit the data or the permissions. Moving into development later made that loop much shorter, because I now build many of these screens myself.",
};

export const designAreas: DesignArea[] = [
  {
    id: "internal-product",
    title: "Internal Product Design",
    summary: "Dashboards, tables, forms and detail views for Sales, Inventory and Production.",
    points: [
      "Role-specific screens for Sales Admin, BDO, Inventory and Production staff",
      "School management, material recording, requisitions, damage reporting and pouch/kit tracking",
      "Consistent navigation and interaction patterns across modules",
    ],
    images: [],
  },
  {
    id: "classroom-tracker",
    title: "Classroom Progress Tracker",
    summary: "One clear view of classroom progress, lesson tracking and practical assessment.",
    points: ["Classroom progress at a glance", "Lesson tracking", "Practical assessment"],
    images: [],
  },
  {
    id: "visual",
    title: "Selected Visual Design",
    summary: "Print and social media work for events, education and the brand.",
    points: [
      "Event and conference materials, banners",
      "Workbooks and educational materials",
      "ID cards, letterheads and stickers",
      "Social media graphics",
    ],
    images: [],
  },
];
