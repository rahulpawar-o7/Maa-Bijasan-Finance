import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, CircleAlert, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import { BUSINESS, CONSENT_TEXT } from "../lib/config";
import {
  CONTACT_TIMES,
  EMPLOYMENT_TYPES,
  EMPTY_VALUES,
  LOAN_AMOUNTS,
  LOAN_TYPES,
  checkIndianMobile,
  validateEnquiry,
} from "../lib/validation";
import type { EnquiryErrors, EnquiryValues } from "../lib/validation";
import { SubmissionError, getSubmissionStatus, submitEnquiry, visitorMessage } from "../lib/submission";
import SuccessMessage from "./SuccessMessage";
import { btn, container } from "./ui";

export interface LoanPreset {
  type: string;
  /** Changes on every click so choosing the same card twice still re-applies. */
  nonce: number;
}

type Status = "idle" | "submitting" | "success" | "error";
type Field = Exclude<keyof EnquiryValues, "honeypot">;

const FIELD_ORDER: Field[] = ["fullName", "mobile", "city", "loanType", "loanAmount", "contactTime", "email", "consent"];

const inputCls = (invalid: boolean) =>
  `block w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
    invalid
      ? "border-red-600 focus:border-red-600 focus:ring-red-600/25"
      : "border-slate-300 focus:border-royal-600 focus:ring-royal-600/25"
  }`;

function FieldWrap({ id, label, required, error, hint, children }: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[15px] font-semibold text-navy-900">
        {label}
        {required ? <span aria-hidden className="text-red-600"> *</span> : <span className="font-normal text-slate-500"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
          <CircleAlert aria-hidden size={16} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

function SelectBox({ id, value, onChange, onBlur, options, placeholder, invalid, describedBy, required }: {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: FocusEvent<HTMLSelectElement>) => void;
  options: readonly string[];
  placeholder: string;
  invalid: boolean;
  describedBy?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${inputCls(invalid)} appearance-none pr-10 ${value ? "" : "text-slate-500"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown aria-hidden size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

export default function LoanEnquiryForm({ preset }: { preset?: LoanPreset | null }) {
  const [values, setValues] = useState<EnquiryValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [devHint, setDevHint] = useState<string | null>(null);

  const inFlight = useRef(false); // synchronous guard: state updates alone can't stop a fast double-click
  const successHeading = useRef<HTMLHeadingElement>(null);

  const setup = getSubmissionStatus();
  const showSetupNotice = import.meta.env.DEV && !setup.configured;

  // Preselect the loan type when a service card's "Enquire Now" is clicked.
  useEffect(() => {
    if (!preset) return;
    if (inFlight.current) return;
    setStatus((s) => (s === "success" ? "idle" : s));
    setValues((v) => ({ ...v, loanType: preset.type }));
    setErrors((e) => ({ ...e, loanType: undefined }));
  }, [preset]);

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
  }, [status]);

  function update<K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K], next?: EnquiryValues) {
    const nextValues = next ?? { ...values, [key]: value };
    setValues(nextValues);
    if (key !== "honeypot" && touched[key as Field]) {
      setErrors((e) => ({ ...e, [key]: validateEnquiry(nextValues)[key] }));
    }
  }

  function blur(key: Field) {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateEnquiry(values)[key] }));
  }

  function reset() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setTouched({});
    setStatus("idle");
    setSubmitError(null);
    setDevHint(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return; // duplicate submission guard

    const found = validateEnquiry(values);
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    const firstInvalid = FIELD_ORDER.find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const mobile = checkIndianMobile(values.mobile);
    if (!mobile.ok) return; // unreachable: validateEnquiry already rejected it

    inFlight.current = true;
    setStatus("submitting");
    setSubmitError(null);
    setDevHint(null);
    try {
      await submitEnquiry(
        {
          fullName: values.fullName.trim(),
          mobile: mobile.value,
          city: values.city.trim(),
          loanType: values.loanType,
          loanAmount: values.loanAmount,
          contactTime: values.contactTime,
          email: values.email.trim() || undefined,
          employmentType: values.employmentType || undefined,
        },
        values.honeypot,
      );
      setValues(EMPTY_VALUES);
      setTouched({});
      setStatus("success"); // reached only after the service confirmed receipt
    } catch (err) {
      setStatus("error");
      setSubmitError(visitorMessage(err));
      if (import.meta.env.DEV && err instanceof SubmissionError) setDevHint(`${err.kind}: ${err.message}`);
    } finally {
      inFlight.current = false;
    }
  }

  const err = (k: Field) => errors[k];
  const described = (k: Field, hint = false) =>
    [err(k) ? `${k}-error` : hint ? `${k}-hint` : ""].filter(Boolean).join(" ") || undefined;
  const submitting = status === "submitting";

  return (
    <section id="enquiry" aria-labelledby="enquiry-heading" className="bg-gradient-to-b from-royal-50 to-white py-16 sm:py-24">
      <div className={`${container} max-w-3xl`}>
        {status === "success" ? (
          <SuccessMessage
            ref={successHeading}
            onBack={() => {
              reset();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          <>
            <div className="text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-royal-600">Loan enquiry</p>
              <h2 id="enquiry-heading" tabIndex={-1} className="text-3xl font-semibold leading-tight outline-none sm:text-4xl">
                Tell Us About Your Loan Requirements
              </h2>
              <span aria-hidden className="mx-auto mt-4 block h-1 w-12 rounded-full bg-gold-400" />
              <p className="mt-5 text-lg text-slate-600">
                Submit your basic details and our team can contact you to discuss your enquiry.
              </p>
            </div>

            <form
              noValidate
              onSubmit={handleSubmit}
              aria-label="Loan enquiry form"
              className="mt-10 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200 sm:p-9"
            >
              {showSetupNotice && (
                <div role="note" className="mb-6 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  <TriangleAlert aria-hidden size={20} className="mt-0.5 shrink-0" />
                  <p>
                    <strong>Developer setup notice (visible only in development):</strong> no submission service is
                    configured, so enquiries will <em>not</em> be delivered or saved. {setup.problem} See README.md,
                    section "Set up email delivery".
                  </p>
                </div>
              )}

              {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Leave this field empty
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.honeypot}
                    onChange={(e) => update("honeypot", e.target.value)}
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldWrap id="fullName" label="Full Name" required error={err("fullName")}>
                  <input
                    id="fullName" name="fullName" type="text" autoComplete="name" placeholder="e.g. Ramesh Sharma"
                    value={values.fullName} aria-required aria-invalid={!!err("fullName")} aria-describedby={described("fullName")}
                    onChange={(e) => update("fullName", e.target.value)} onBlur={() => blur("fullName")}
                    className={inputCls(!!err("fullName"))}
                  />
                </FieldWrap>

                <FieldWrap id="mobile" label="Mobile Number" required error={err("mobile")} hint="10-digit Indian mobile number">
                  <div className="flex">
                    <span aria-hidden className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3.5 text-base font-medium text-slate-600">
                      +91
                    </span>
                    <input
                      id="mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210"
                      maxLength={18} value={values.mobile} aria-required aria-invalid={!!err("mobile")} aria-describedby={described("mobile", true)}
                      onChange={(e) => update("mobile", e.target.value)} onBlur={() => blur("mobile")}
                      className={`${inputCls(!!err("mobile"))} !rounded-l-none`}
                    />
                  </div>
                </FieldWrap>

                <FieldWrap id="city" label="City" required error={err("city")}>
                  <input
                    id="city" name="city" type="text" autoComplete="address-level2" placeholder="e.g. Indore"
                    value={values.city} aria-required aria-invalid={!!err("city")} aria-describedby={described("city")}
                    onChange={(e) => update("city", e.target.value)} onBlur={() => blur("city")}
                    className={inputCls(!!err("city"))}
                  />
                </FieldWrap>

                <FieldWrap id="loanType" label="Loan Type" required error={err("loanType")}>
                  <SelectBox
                    id="loanType" required value={values.loanType} options={LOAN_TYPES} placeholder="Select loan type"
                    invalid={!!err("loanType")} describedBy={described("loanType")}
                    onChange={(e) => update("loanType", e.target.value)} onBlur={() => blur("loanType")}
                  />
                </FieldWrap>

                <FieldWrap id="loanAmount" label="Approximate Loan Amount" required error={err("loanAmount")}>
                  <SelectBox
                    id="loanAmount" required value={values.loanAmount} options={LOAN_AMOUNTS} placeholder="Select amount"
                    invalid={!!err("loanAmount")} describedBy={described("loanAmount")}
                    onChange={(e) => update("loanAmount", e.target.value)} onBlur={() => blur("loanAmount")}
                  />
                </FieldWrap>

                <FieldWrap id="contactTime" label="Preferred Contact Time" required error={err("contactTime")}>
                  <SelectBox
                    id="contactTime" required value={values.contactTime} options={CONTACT_TIMES} placeholder="Select a time slot"
                    invalid={!!err("contactTime")} describedBy={described("contactTime")}
                    onChange={(e) => update("contactTime", e.target.value)} onBlur={() => blur("contactTime")}
                  />
                </FieldWrap>

                <FieldWrap id="email" label="Email Address" error={err("email")}>
                  <input
                    id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com"
                    value={values.email} aria-invalid={!!err("email")} aria-describedby={described("email")}
                    onChange={(e) => update("email", e.target.value)} onBlur={() => blur("email")}
                    className={inputCls(!!err("email"))}
                  />
                </FieldWrap>

                <FieldWrap id="employmentType" label="Employment Type">
                  <SelectBox
                    id="employmentType" value={values.employmentType} options={EMPLOYMENT_TYPES} placeholder="Select (optional)"
                    invalid={false}
                    onChange={(e) => update("employmentType", e.target.value)} onBlur={() => undefined}
                  />
                </FieldWrap>
              </div>

              <div className="mt-6">
                <div className="flex items-start gap-3">
                  <input
                    id="consent" name="consent" type="checkbox" checked={values.consent}
                    aria-required aria-invalid={!!err("consent")} aria-describedby={described("consent")}
                    onChange={(e) => update("consent", e.target.checked)} onBlur={() => blur("consent")}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-400 accent-royal-600"
                  />
                  <label htmlFor="consent" className="cursor-pointer text-[15px] leading-relaxed text-slate-700">
                    {CONSENT_TEXT.replace("the Privacy Policy.", "")}
                    the{" "}
                    <Link to="/privacy-policy" target="_blank" rel="noopener" className="font-semibold text-royal-600 underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .<span aria-hidden className="text-red-600"> *</span>
                  </label>
                </div>
                {err("consent") && (
                  <p id="consent-error" className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-700">
                    <CircleAlert aria-hidden size={16} className="mt-0.5 shrink-0" /> {err("consent")}
                  </p>
                )}
              </div>

              <p className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-600">
                <ShieldCheck aria-hidden size={18} className="mt-0.5 shrink-0 text-royal-600" />
                Please do not share your Aadhaar, PAN, bank account details, OTP or passwords in this form. We do not need
                them for an enquiry.
              </p>

              {status === "error" && submitError && (
                <div role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-[15px] text-red-900">
                  <p className="flex items-start gap-2 font-semibold">
                    <CircleAlert aria-hidden size={18} className="mt-0.5 shrink-0" /> {submitError}
                  </p>
                  <p className="mt-2 pl-6">
                    You can also reach us at <a className="font-semibold underline" href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a> or{" "}
                    <a className="font-semibold underline break-all" href={BUSINESS.emailHref}>{BUSINESS.email}</a>.
                  </p>
                  {devHint && <p className="mt-2 pl-6 font-mono text-xs text-red-700">[dev] {devHint}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                aria-disabled={submitting}
                className={`${btn.base} ${btn.royal} mt-6 w-full text-lg disabled:cursor-not-allowed disabled:opacity-75`}
              >
                {submitting ? (
                  <>
                    <LoaderCircle aria-hidden size={20} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  "Submit Loan Enquiry"
                )}
              </button>
              <p className="mt-4 text-center text-sm text-slate-500">
                Submitting an enquiry does not guarantee a loan. Approval, rates and terms are decided by the lender.
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
