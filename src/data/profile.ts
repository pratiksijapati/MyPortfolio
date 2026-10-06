// Personal details shown across the site. Edit here — components read from this file.

export const SITE_URL = "https://www.pratiksijapati.com.np/";

export const profile = {
  name: "Pratik Sijapati",
  firstName: "Pratik",
  role: "Full-Stack Developer",
  tagline:
    "I build complete digital products — from polished interfaces to APIs, databases, backend systems and AI-powered applications.",
  location: "Lele, Lalitpur, Nepal",
  email: "pratiksijapati576@gmail.com",
  phone: "+977-9844479357",
  available: true,
  availabilityText: "Full-stack roles & freelance",
  /** The resume on file still describes the old frontend-only profile, so it isn't linked yet.
   *  Upload a new PDF to public/images/resume.pdf and set this to "/images/resume.pdf". */
  resumeUrl: null as string | null,
};

export const about = {
  paragraphs: [
    "I'm Pratik Sijapati, a Full-Stack Developer and BCA student at Vedas College, Tribhuvan University. I enjoy turning ideas into complete, working products — the interface people use, the API behind it and the data underneath.",
    "At Karkhana I work as a Full-Stack Developer on an internal operations platform — designing Django models and REST APIs and building the React and TypeScript interfaces on top of them. In my own projects I've shipped Django and FastAPI backends, PostgreSQL and MySQL databases, JWT authentication and a deployed, installable web app.",
    "I'm especially interested in AI-powered applications — I've built machine-learning features with Python and scikit-learn and wrapped them in real web interfaces. Outside code I enjoy design, photo and video editing, and anything at the edge of creative tech.",
  ],
  highlights: [
    { value: "Frontend → Database", label: "End-to-end ownership" },
    { value: "React · Django · FastAPI", label: "Core stack" },
    { value: "AI / ML", label: "scikit-learn powered apps" },
  ],
};

export interface EducationItem {
  period: string;
  title: string;
  place: string;
}

export const education: EducationItem[] = [
  { period: "2021 – 2026 (expected)", title: "Bachelor of Computer Applications (BCA)", place: "Vedas College, Tribhuvan University" },
  { period: "2018 – 2020", title: "+2 Science", place: "Pinnacle Academy — GPA A" },
  { period: "2017", title: "SEE", place: "Ganga Jamuna English Secondary School — GPA A+" },
];
