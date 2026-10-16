import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Copy, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { ADDRESS_ONE_LINE, BUSINESS } from "../lib/config";
import { SectionHeading, btn, container } from "./ui";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`${btn.base} ${btn.outlineDark} !px-4 !py-2.5 text-[15px]`}
    >
      {copied ? <Check aria-hidden size={16} className="text-emerald-600" /> : <Copy aria-hidden size={16} />}
      <span>{copied ? "Copied" : label}</span>
      <span className="sr-only" aria-live="polite">{copied ? "Copied to clipboard" : ""}</span>
    </button>
  );
}

function Card({ Icon, title, children }: { Icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
        <Icon aria-hidden size={24} />
      </span>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-surface py-16 sm:py-24">
      <div className={container}>
        <SectionHeading
          id="contact-title"
          eyebrow="Get in touch"
          title="Contact Maa Bijasan Finance"
          intro="Prefer to talk? Call or email us, or visit our office in Indore."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card Icon={Phone} title="Mobile">
            <p className="mt-2 text-lg font-medium text-navy-900">{BUSINESS.phoneDisplay}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={BUSINESS.phoneHref} className={`${btn.base} ${btn.royal} !px-4 !py-2.5 text-[15px]`}>
                <Phone aria-hidden size={16} /> Call Now
              </a>
            </div>
          </Card>

          <Card Icon={Mail} title="Email">
            <p className="mt-2 break-all text-lg font-medium text-navy-900">{BUSINESS.email}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={BUSINESS.emailHref} className={`${btn.base} ${btn.royal} !px-4 !py-2.5 text-[15px]`}>
                <Mail aria-hidden size={16} /> Send Email
              </a>
              <CopyButton text={BUSINESS.email} label="Copy Email" />
            </div>
          </Card>

          <Card Icon={MapPin} title="Office Address">
            <address className="mt-2 text-lg not-italic text-navy-900">
              <strong>{BUSINESS.name}</strong>
              <br />
              {BUSINESS.addressLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${btn.base} ${btn.royal} !px-4 !py-2.5 text-[15px]`}>
                <ExternalLink aria-hidden size={16} /> View on Google Maps
              </a>
              <CopyButton text={ADDRESS_ONE_LINE} label="Copy Address" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
