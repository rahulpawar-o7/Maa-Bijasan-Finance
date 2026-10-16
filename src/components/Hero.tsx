import { ArrowRight, Check } from "lucide-react";
import { HashLink, btn, container } from "./ui";
import { HeroIllustration } from "./Illustrations";

const POINTS = [
  "Options from banks & eligible lenders",
  "Guidance based on your needs",
  "Simple enquiry form",
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-royal-600/25 blur-3xl"
      />
      <div className={`${container} relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-24`}>
        <div className="animate-fade-up">
          <p className="mb-4 inline-flex items-center rounded-full border border-gold-400/40 px-3.5 py-1 text-sm font-medium text-gold-300">
            Loan guidance · Indore, Madhya Pradesh
          </p>
          <h1 className="!text-white text-4xl font-semibold leading-[1.12] sm:text-5xl lg:text-[3.4rem]">
            Find Loan Options That Fit Your Needs
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Explore suitable loan options from government and private sector banks and eligible lending institutions with
            guidance based on your financial needs and eligibility.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HashLink hash="#enquiry" className={`${btn.base} ${btn.gold}`}>
              Apply for a Loan <ArrowRight aria-hidden size={18} />
            </HashLink>
            <HashLink hash="#contact" className={`${btn.base} ${btn.outlineLight}`}>
              Contact Our Team
            </HashLink>
          </div>

          <ul className="mt-8 grid gap-2.5 text-[15px] text-slate-200 sm:grid-cols-1">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300">
                  <Check aria-hidden size={13} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-sm text-slate-400">
            Loan approval, interest rates and terms are decided by the lender and depend on your eligibility.
          </p>
        </div>

        <HeroIllustration className="mx-auto hidden w-full max-w-md sm:block lg:max-w-none" />
      </div>
    </section>
  );
}
