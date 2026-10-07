import { useEffect, useRef, useState, type MouseEvent } from "react";
import { socials } from "../data/socials";
import { useActiveSection } from "../hooks/useActiveSection";
import { sectionHref } from "../lib/routes";
import { Icon } from "./Icon";
import styles from "./Navbar.module.css";

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "development", label: "Development" },
  { id: "design", label: "Design" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = NAV_ITEMS.map((i) => i.id);
const NO_SECTIONS: string[] = [];
const navSocials = socials.filter((s) => s.inNav);

interface Props {
  /** On the home page links scroll to sections; elsewhere they go to "/#section". */
  onHome?: boolean;
  /** Highlights a nav item on sub-pages, e.g. "development" on a project page. */
  current?: string;
}

export function Navbar({ onHome = true, current }: Props) {
  const scrolledTo = useActiveSection(onHome ? SECTION_IDS : NO_SECTIONS);
  const active = onHome ? scrolledTo : current;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Escape closes, focus moves into the menu, page doesn't scroll behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // The scroll lock blocks the browser's own jump to #id, so close first, then scroll
  // and move focus to the section for keyboard and screen-reader users.
  const goTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (!onHome) return; // normal navigation to "/#id"
    e.preventDefault();
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView();
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      history.replaceState(null, "", `#${id}`);
    }, 0);
  };

  // Close if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 960px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.scrolled : ""}`}>
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <a href={sectionHref("home", onHome)} className={styles.logo} aria-label="Pratik Sijapati, home">
          <span className={styles.logoMark} aria-hidden="true">
            PS
          </span>
          <span className={styles.logoText}>Pratik Sijapati</span>
        </a>

        <ul className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={sectionHref(item.id, onHome)}
                className={styles.link}
                aria-current={active === item.id ? (onHome ? "location" : "page") : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {navSocials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={styles.iconLink}
              aria-label={`${s.label} (opens in a new tab)`}
            >
              <Icon name={s.icon} size={18} />
            </a>
          ))}
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </div>
      </nav>

      <div id="mobile-menu" ref={menuRef} className={styles.mobileMenu} hidden={!open}>
        <ul className="container">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id} style={{ animationDelay: `${i * 40}ms` }}>
              <a
                href={sectionHref(item.id, onHome)}
                className={styles.mobileLink}
                aria-current={active === item.id ? (onHome ? "location" : "page") : undefined}
                onClick={(e) => goTo(e, item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
