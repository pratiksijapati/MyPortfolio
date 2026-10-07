// Personal details shown across the site. Edit here — components read from this file.

export const SITE_URL = "https://www.pratiksijapati.com.np/";

export const profile = {
  name: "Pratik Sijapati",
  firstName: "Pratik",
  role: "Full-Stack Developer",
  tagline:
    "I build web apps from the interface to the API and the database. Before that I worked as a product and UI/UX designer, so I think about the people who'll use what I build.",
  location: "Kathmandu, Nepal",
  email: "pratiksijapati576@gmail.com",
  phone: "+977-9844479357",
  available: true,
  availabilityText: "Available for opportunities",
  /** One-page CV (rendered from the master CV). Set to null to hide the Download CV buttons. */
  resumeUrl: "/Pratik_Sijapati_CV.pdf" as string | null,
  photo: {
    /** 4:5 portrait */
    portrait: "/me/pratik-portrait",
    /** square head-and-shoulders crop, also used inside the 3D scene */
    square: "/me/pratik-square",
    alt: "Pratik Sijapati",
  },
};

export const about = {
  paragraphs: [
    "I'm a Full-Stack Developer in Kathmandu. At Karkhana I work on an internal operations platform, with React and TypeScript on the front and Django REST Framework and PostgreSQL behind it.",
    "Before moving into development, I worked there as a Product and UI/UX Designer, designing the same kind of dashboards, forms and workflows in Figma. So I like being involved from the first screen design to the database table.",
    "I finished my BCA at Vedas College, Tribhuvan University, in 2026. Lately I've been exploring machine learning, mostly through my Career Navigator project.",
  ],
  highlights: [
    { value: "Design → Frontend → API → Database", label: "Where I work" },
    { value: "React · Django · PostgreSQL", label: "Main stack" },
    { value: "Figma", label: "For product and UI design" },
  ],
};

export interface EducationItem {
  period: string;
  title: string;
  place: string;
}

export const education: EducationItem[] = [
  { period: "2021 – 2026", title: "Bachelor of Computer Applications (BCA)", place: "Vedas College, Tribhuvan University" },
  { period: "2018 – 2020", title: "+2 Science", place: "Pinnacle Academy — GPA A" },
  { period: "2017", title: "SEE", place: "Ganga Jamuna English Secondary School — GPA A+" },
];
