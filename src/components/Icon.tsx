import type { ReactNode } from "react";
import { siFacebook, siGithub, siInstagram } from "simple-icons";

// Small inline icon set — no icon-font or extra requests. Stroke icons use currentColor.

const stroke: Record<string, ReactNode> = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
  ),
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  send: <path d="M21 3 10 14M21 3l-6.5 18-4.5-7-7-4.5L21 3Z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5m0 3.2v.3" />
    </>
  ),
  code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />,
  layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.3" />
    </>
  ),
};

const brand: Record<string, string> = {
  github: siGithub.path,
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  // LinkedIn isn't in simple-icons; a plain "in" mark.
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z",
};

export type IconName =
  | "mail"
  | "phone"
  | "arrowRight"
  | "arrowUpRight"
  | "menu"
  | "close"
  | "star"
  | "pin"
  | "send"
  | "check"
  | "alert"
  | "code"
  | "layers"
  | "download"
  | "info"
  | "github"
  | "linkedin"
  | "facebook"
  | "instagram";

interface Props {
  name: IconName;
  size?: number;
  className?: string;
  /** Leave undefined for decorative icons (hidden from screen readers). */
  title?: string;
}

export function Icon({ name, size = 20, className, title }: Props) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
  if (name in brand) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...a11y}>
        <path d={brand[name]} />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...a11y}
    >
      {stroke[name]}
    </svg>
  );
}
