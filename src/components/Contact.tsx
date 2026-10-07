import { useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { profile } from "../data/profile";
import { socials } from "../data/socials";
import { contactMode, mailtoHref, sendViaEndpoint, validate, type ContactMessage } from "../lib/contact";
import { Icon, type IconName } from "./Icon";
import { SectionHeading } from "./SectionHeading";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";
type Errors = Partial<Record<keyof ContactMessage, string>>;

const EMPTY: ContactMessage = { name: "", email: "", message: "" };

interface Channel {
  label: string;
  value: string;
  href: string;
  icon: IconName;
  external?: boolean;
}

const channels: Channel[] = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/[^+\d]/g, "")}`, icon: "phone" },
  ...socials.map((s) => ({ label: s.label, value: s.handle, href: s.href, icon: s.icon, external: true })),
  ...(profile.resumeUrl
    ? [{ label: "Resume", value: "Download PDF", href: profile.resumeUrl, icon: "download" as const, external: true }]
    : []),
];

function ContactForm() {
  const [values, setValues] = useState<ContactMessage>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  const update = (field: keyof ContactMessage) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof ContactMessage)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    if (contactMode === "mailto") {
      window.location.href = mailtoHref(values);
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      await sendViaEndpoint(values);
      setStatus("sent");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const field = (name: keyof ContactMessage, label: string, input: ReactNode) => (
    <div className={styles.field}>
      <label htmlFor={`${id}-${name}`}>{label}</label>
      {input}
      {errors[name] && (
        <p id={`${id}-${name}-error`} className={styles.fieldError}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const aria = (name: keyof ContactMessage) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  if (status === "sent") {
    return (
      <div className={`${styles.form} ${styles.done}`} role="status">
        <span className={styles.doneIcon}>
          <Icon name="check" size={26} />
        </span>
        <h3>Message sent — thank you!</h3>
        <p>I'll reply to the email address you gave as soon as I can.</p>
        <button type="button" className="btn" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className={styles.formTitle}>
        Send a message
      </h3>
      <div className={styles.row}>
        {field(
          "name",
          "Your name",
          <input {...aria("name")} type="text" autoComplete="name" value={values.name} onChange={update("name")} />,
        )}
        {field(
          "email",
          "Email address",
          <input
            {...aria("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={update("email")}
          />,
        )}
      </div>
      {field(
        "message",
        "Message",
        <textarea
          {...aria("message")}
          rows={6}
          value={values.message}
          onChange={update("message")}
          placeholder="Tell me about your project, role or idea…"
        />,
      )}

      <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <span className={styles.spinner} aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            {contactMode === "mailto" ? "Continue in your email app" : "Send message"} <Icon name="send" />
          </>
        )}
      </button>

      <div aria-live="polite">
        {status === "error" && (
          <p className={styles.formError}>
            <Icon name="alert" size={18} /> Your message couldn't be sent. Please try again, or email me directly at{" "}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        )}
        {status === "mailto" && (
          <p className={styles.formNote}>
            <Icon name="info" size={18} /> Your email app should have opened with the message ready — press send there.
            Nothing opened? Email me at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        )}
        {status === "idle" && contactMode === "mailto" && (
          <p className={styles.formHint}>This opens your email app with your message filled in.</p>
        )}
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section id="contact" className={`section ${styles.section}`} aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading id="contact-title" eyebrow="Contact" title="Get in touch">
          If you have a role, a project or a question, send me a message here or email me directly.
        </SectionHeading>

        <div className={styles.grid}>
          <ul className={styles.channels} data-reveal>
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className={styles.channel}
                  {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <span className={styles.channelIcon}>
                    <Icon name={c.icon} size={18} />
                  </span>
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>{c.label}</span>
                    <span className={styles.channelValue}>{c.value}</span>
                  </span>
                  <Icon name="arrowUpRight" size={16} className={styles.channelArrow} />
                  {c.external && <span className="visually-hidden"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
          <div data-reveal style={{ "--i": 1 } as CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
