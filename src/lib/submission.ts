/**
 * Submission service for the loan enquiry form.
 *
 * The UI only ever calls `submitEnquiry()`. Which service receives the data is
 * chosen by environment variables (see `.env.example`), so switching to the
 * future owner-dashboard backend later needs NO change in the form component.
 *
 *  VITE_SUBMISSION_PROVIDER = "formspree" | "formsubmit" | "api"
 *
 *  - formspree  : POSTs JSON to VITE_FORMSPREE_ENDPOINT (https://formspree.io/f/<id>)
 *  - formsubmit : POSTs JSON to https://formsubmit.co/ajax/<VITE_FORMSUBMIT_TARGET>
 *  - api        : POSTs JSON to `${VITE_API_BASE_URL}/api/enquiries`
 *                 ** PLANNED integration contract - this endpoint does NOT exist yet. **
 *
 * Rules enforced here:
 *  - Success is returned ONLY when the service confirms it. Anything else throws.
 *  - Nothing is stored in localStorage/sessionStorage, and nothing is logged.
 *  - No secret keys are used (none belong in browser code).
 */
import { CONSENT_TEXT } from "./config";

export type SubmissionProvider = "formspree" | "formsubmit" | "api";

export type SubmissionErrorKind =
  | "not-configured" // no/invalid env configuration
  | "activation" // FormSubmit/Formspree form not yet activated by the owner
  | "rejected" // service refused the data (4xx)
  | "server" // service failed (5xx / unexpected response)
  | "network" // offline / blocked / DNS
  | "timeout";

export class SubmissionError extends Error {
  readonly kind: SubmissionErrorKind;
  constructor(kind: SubmissionErrorKind, message: string) {
    super(message);
    this.name = "SubmissionError";
    this.kind = kind;
  }
}

/** Data the form hands to the service. Mobile is the bare 10-digit number. */
export interface EnquiryPayload {
  fullName: string;
  mobile: string;
  city: string;
  loanType: string;
  loanAmount: string;
  contactTime: string;
  email?: string;
  employmentType?: string;
}

export interface SubmissionStatus {
  configured: boolean;
  provider?: SubmissionProvider;
  /** Developer-facing explanation when not configured. */
  problem?: string;
}

const TIMEOUT_MS = 15_000;

interface ResolvedConfig {
  provider: SubmissionProvider;
  url: string;
}

function resolveConfig(): { config?: ResolvedConfig; problem?: string } {
  const env = import.meta.env;
  const provider = (env.VITE_SUBMISSION_PROVIDER ?? "").trim() as SubmissionProvider | "";

  if (!provider) {
    return { problem: "VITE_SUBMISSION_PROVIDER is not set. Copy .env.example to .env and choose a provider." };
  }

  if (provider === "formspree") {
    const url = (env.VITE_FORMSPREE_ENDPOINT ?? "").trim();
    if (!/^https:\/\/formspree\.io\/f\/[\w-]+$/.test(url)) {
      return { problem: "VITE_FORMSPREE_ENDPOINT must look like https://formspree.io/f/<form-id>." };
    }
    return { config: { provider, url } };
  }

  if (provider === "formsubmit") {
    const target = (env.VITE_FORMSUBMIT_TARGET ?? "").trim();
    if (!target || /[\s/]/.test(target)) {
      return { problem: "VITE_FORMSUBMIT_TARGET must be an email address or the FormSubmit random alias." };
    }
    return { config: { provider, url: `https://formsubmit.co/ajax/${encodeURIComponent(target)}` } };
  }

  if (provider === "api") {
    const base = (env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
    if (!/^https?:\/\/[^\s]+$/.test(base)) {
      return { problem: "VITE_API_BASE_URL must be a full URL such as https://api.example.com." };
    }
    return { config: { provider, url: `${base}/api/enquiries` } };
  }

  return { problem: `Unknown VITE_SUBMISSION_PROVIDER "${provider}". Use formspree, formsubmit or api.` };
}

export function getSubmissionStatus(): SubmissionStatus {
  const { config, problem } = resolveConfig();
  return config ? { configured: true, provider: config.provider } : { configured: false, problem };
}

/** Friendly, non-technical text for visitors. */
export function visitorMessage(error: unknown): string {
  const kind = error instanceof SubmissionError ? error.kind : "server";
  switch (kind) {
    case "network":
      return "We could not reach the server. Please check your internet connection and try again.";
    case "timeout":
      return "The request took too long. Please try again in a moment.";
    case "rejected":
      return "Your enquiry could not be accepted. Please check the details you entered and try again.";
    default:
      return "Your enquiry could not be submitted right now. Please try again shortly, or call or email us directly.";
  }
}

async function postJson(url: string, body: unknown): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new SubmissionError(controller.signal.aborted ? "timeout" : "network", "Request failed before a response arrived.");
  } finally {
    clearTimeout(timer);
  }
}

async function readJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    const data: unknown = await res.json();
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function failFromStatus(res: Response): never {
  if (res.status >= 400 && res.status < 500) {
    throw new SubmissionError("rejected", `Service rejected the enquiry (HTTP ${res.status}).`);
  }
  throw new SubmissionError("server", `Service error (HTTP ${res.status}).`);
}

/** Human-readable field names make the notification email easy to read. */
function toEmailFields(p: EnquiryPayload, honeypot: string): Record<string, string> {
  const fields: Record<string, string> = {
    _subject: `New loan enquiry: ${p.loanType} - ${p.fullName}`,
    "Full Name": p.fullName,
    "Mobile Number": `+91${p.mobile}`,
    City: p.city,
    "Loan Type": p.loanType,
    "Approximate Loan Amount": p.loanAmount,
    "Preferred Contact Time": p.contactTime,
    "Consent Given": "Yes",
    "Consent Text": CONSENT_TEXT,
    "Submitted At": new Date().toISOString(),
    // Honeypots - both services silently discard messages where these are filled.
    _gotcha: honeypot,
    _honey: honeypot,
  };
  if (p.employmentType) fields["Employment Type"] = p.employmentType;
  if (p.email) fields.email = p.email; // "email" lets you reply directly from your inbox
  return fields;
}

/**
 * Sends the enquiry. Resolves ONLY if the configured service confirmed receipt.
 * Throws SubmissionError in every other case.
 */
export async function submitEnquiry(payload: EnquiryPayload, honeypot = ""): Promise<void> {
  const { config, problem } = resolveConfig();
  if (!config) throw new SubmissionError("not-configured", problem ?? "Submission service is not configured.");

  if (config.provider === "formspree") {
    const res = await postJson(config.url, toEmailFields(payload, honeypot));
    if (!res.ok) failFromStatus(res);
    return;
  }

  if (config.provider === "formsubmit") {
    const fields = { ...toEmailFields(payload, honeypot), _template: "table", _captcha: "false" };
    const res = await postJson(config.url, fields);
    const data = await readJson(res);
    const success = data?.success === true || data?.success === "true";
    if (res.ok && success) return;
    const message = typeof data?.message === "string" ? data.message : "";
    if (/activat/i.test(message)) {
      throw new SubmissionError("activation", "FormSubmit needs to be activated from the confirmation email.");
    }
    if (!res.ok) failFromStatus(res);
    throw new SubmissionError("server", "FormSubmit did not confirm the submission.");
  }

  // provider === "api": planned owner-dashboard backend contract (POST /api/enquiries).
  const res = await postJson(config.url, {
    ...payload,
    mobile: `+91${payload.mobile}`,
    consentGiven: true,
    consentText: CONSENT_TEXT,
    source: "public-website",
    submittedAt: new Date().toISOString(),
    honeypot,
  });
  if (!res.ok) failFromStatus(res);
}
