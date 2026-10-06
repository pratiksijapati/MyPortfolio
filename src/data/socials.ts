import type { IconName } from "../components/Icon";

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  icon: IconName;
  /** Shown in the navbar as an icon button. */
  inNav?: boolean;
}

export const socials: SocialLink[] = [
  { label: "GitHub", handle: "pratiksijapati", href: "https://github.com/pratiksijapati", icon: "github", inNav: true },
  { label: "LinkedIn", handle: "in/pratiksijapati", href: "https://www.linkedin.com/in/pratiksijapati", icon: "linkedin", inNav: true },
  { label: "Facebook", handle: "pratiksijapatii", href: "https://www.facebook.com/pratiksijapatii", icon: "facebook" },
  { label: "Instagram", handle: "pratikczapati", href: "https://www.instagram.com/pratikczapati", icon: "instagram" },
];

export const githubUrl = socials[0].href;
export const linkedinUrl = socials[1].href;
