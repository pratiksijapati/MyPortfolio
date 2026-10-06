import { profile } from "../data/profile";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/**
 * Form endpoint that accepts a JSON POST and answers 2xx on success — e.g. Formspree
 * (https://formspree.io/f/<id>), Getform, or your own serverless function.
 * Set VITE_CONTACT_ENDPOINT in .env (locally) or as a repository variable (GitHub Actions).
 * Endpoint URLs like these are public by design; never put a secret API key here.
 */
export const CONTACT_ENDPOINT: string | undefined = import.meta.env.VITE_CONTACT_ENDPOINT || undefined;

export const contactMode: "endpoint" | "mailto" = CONTACT_ENDPOINT ? "endpoint" : "mailto";

export async function sendViaEndpoint(msg: ContactMessage): Promise<void> {
  const res = await fetch(CONTACT_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...msg, _subject: `Portfolio message from ${msg.name}` }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Contact endpoint answered ${res.status}`);
}

/** Without an endpoint, hand the message to the visitor's own email app. */
export function mailtoHref(msg: ContactMessage) {
  const subject = encodeURIComponent(`Portfolio message from ${msg.name}`);
  const body = encodeURIComponent(`${msg.message}\n\n— ${msg.name} (${msg.email})`);
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export function validate(msg: ContactMessage) {
  const errors: Partial<Record<keyof ContactMessage, string>> = {};
  if (msg.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(msg.email.trim())) errors.email = "Please enter a valid email address.";
  if (msg.message.trim().length < 10) errors.message = "Please write a message of at least 10 characters.";
  else if (msg.message.length > 5000) errors.message = "Please keep the message under 5,000 characters.";
  return errors;
}
