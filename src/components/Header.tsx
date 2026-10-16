import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { BUSINESS, NAV_LINKS } from "../lib/config";
import { HashLink, btn, container } from "./ui";
import { LogoMark } from "./Illustrations";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname, location.hash, location.key]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900 text-white shadow-sm">
      <div className={`${container} flex h-16 items-center justify-between gap-2`}>
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Maa Bijasan Finance - home">
          <LogoMark className="h-9 w-9 shrink-0" />
          <span className="truncate font-serif text-[15px] font-semibold tracking-tight min-[400px]:text-lg">
            {BUSINESS.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <HashLink key={l.hash} hash={l.hash} className="text-[15px] font-medium text-slate-200 transition hover:text-gold-300">
              {l.label}
            </HashLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <HashLink
            hash="#enquiry"
            aria-label="Apply for a Loan"
            className={`${btn.base} ${btn.gold} !px-4 !py-2.5 text-[15px] sm:!px-5`}
          >
            <span className="min-[400px]:hidden">Apply</span>
            <span className="hidden min-[400px]:inline">Apply for a Loan</span>
          </HashLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden size={24} /> : <Menu aria-hidden size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-navy-900 lg:hidden">
          <nav aria-label="Mobile" className={`${container} flex flex-col py-3`}>
            {NAV_LINKS.map((l) => (
              <HashLink
                key={l.hash}
                hash={l.hash}
                className="rounded-lg px-3 py-3.5 text-lg font-medium text-slate-100 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </HashLink>
            ))}
            <a href={BUSINESS.phoneHref} className={`${btn.base} ${btn.outlineLight} mt-3`}>
              <Phone aria-hidden size={18} /> Call {BUSINESS.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
