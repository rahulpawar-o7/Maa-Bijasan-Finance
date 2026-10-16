import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { BUSINESS, NAV_LINKS } from "../lib/config";
import { LOAN_TYPES } from "../lib/validation";
import { HashLink, container } from "./ui";
import { LogoMark } from "./Illustrations";

const linkCls = "text-slate-300 transition hover:text-gold-300";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className={`${container} grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4`}>
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="font-serif text-lg font-semibold text-white">{BUSINESS.name}</span>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed">
            Helping customers explore loan options from government and private sector banks and other eligible lending
            institutions, depending on their financial profile and eligibility.
          </p>
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-sans text-base font-semibold !text-white">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {NAV_LINKS.map((l) => (
              <li key={l.hash}>
                <HashLink hash={l.hash} className={linkCls}>{l.label}</HashLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Loan services">
          <h2 className="font-sans text-base font-semibold !text-white">Loan Services</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {LOAN_TYPES.map((t) => (
              <li key={t}>
                <HashLink hash="#services" className={linkCls}>{t === "Other" ? "Other Loan Requirements" : t}</HashLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-base font-semibold !text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li className="flex gap-2.5">
              <Phone aria-hidden size={18} className="mt-0.5 shrink-0 text-gold-400" />
              <a href={BUSINESS.phoneHref} className={linkCls}>{BUSINESS.phoneDisplay}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail aria-hidden size={18} className="mt-0.5 shrink-0 text-gold-400" />
              <a href={BUSINESS.emailHref} className={`${linkCls} break-all`}>{BUSINESS.email}</a>
            </li>
            <li className="flex gap-2.5">
              <MapPin aria-hidden size={18} className="mt-0.5 shrink-0 text-gold-400" />
              <address className="not-italic">{BUSINESS.addressLines.join(" ")}</address>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className={`${container} flex flex-col gap-3 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between`}>
          <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          <ul className="flex gap-5">
            <li><Link to="/privacy-policy" className="hover:text-gold-300">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-gold-300">Terms and Conditions</Link></li>
          </ul>
        </div>
        <p className={`${container} pb-6 text-xs leading-relaxed text-slate-500`}>
          Loan approval, interest rates, fees and terms are decided by the respective lender and depend on the customer's
          eligibility and the lender's policies.
        </p>
      </div>
    </footer>
  );
}
