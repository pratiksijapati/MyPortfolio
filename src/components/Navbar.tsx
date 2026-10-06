import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { socials } from "../data/socials";
import { useActiveSection } from "../hooks/useActiveSection";
import { Icon } from "./Icon";
import styles from "./Navbar.module.css";

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = NAV_ITEMS.map((i) => i.id);
const navSocials = socials.filter((s) => s.inNav);

export function Navbar() {
  const active = useActiveSection(SECTION_IDS);
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
    e.preventDefault();
    setOpen(false);
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
    const mql = window.matchMedia("(min-width: 900px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.scrolled : ""}`}>
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <a href="#home" className={styles.logo} aria-label="Pratik Sijapati — back to top">
          <span className={styles.logoMark} aria-hidden="true">
            PS
          </span>
          <span className={styles.logoText}>Pratik Sijapati</span>
        </a>

        <ul className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={styles.link}
                aria-current={active === item.id ? "location" : undefined}
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

      <div
        id="mobile-menu"
        ref={menuRef}
        className={styles.mobileMenu}
        hidden={!open}
      >
        <ul className="container">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id} style={{ "--i": i } as CSSProperties}>
              <a
                href={`#${item.id}`}
                className={styles.mobileLink}
                aria-current={active === item.id ? "location" : undefined}
                onClick={(e) => goTo(e, item.id)}
              >
                <span className="mono">0{i + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
