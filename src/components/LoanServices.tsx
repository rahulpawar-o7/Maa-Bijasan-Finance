import type { LucideIcon } from "lucide-react";
import { ArrowRight, Briefcase, Building2, Car, Ellipsis, House, Wallet } from "lucide-react";
import type { LoanType } from "../lib/validation";
import { SectionHeading, container } from "./ui";

interface Service {
  type: LoanType;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const SERVICES: Service[] = [
  { type: "Personal Loan", title: "Personal Loan", description: "For eligible personal financial requirements.", Icon: Wallet },
  { type: "Business Loan", title: "Business Loan", description: "For eligible business expenses, working capital or expansion.", Icon: Briefcase },
  { type: "Home Loan", title: "Home Loan", description: "For eligible home purchase or construction requirements.", Icon: House },
  { type: "Loan Against Property", title: "Loan Against Property", description: "For eligible customers exploring secured borrowing options.", Icon: Building2 },
  { type: "Vehicle Loan", title: "Vehicle Loan", description: "For eligible new or used vehicle financing requirements.", Icon: Car },
  { type: "Other", title: "Other Loan Requirements", description: "Customers can enquire about other loan categories.", Icon: Ellipsis },
];

export default function LoanServices({ onEnquire }: { onEnquire: (type: LoanType) => void }) {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-surface py-16 sm:py-24">
      <div className={container}>
        <SectionHeading
          id="services-title"
          eyebrow="What you can enquire about"
          title="Explore Our Loan Services"
          intro="Choose the category closest to your requirement and share a few details. Our team will take it from there."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ type, title, description, Icon }) => (
            <li
              key={type}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-royal-100 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
                <Icon aria-hidden size={24} />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 flex-1 text-slate-600">{description}</p>
              <button
                type="button"
                onClick={() => onEnquire(type)}
                aria-label={`Enquire now about ${title}`}
                className="mt-6 inline-flex items-center gap-2 self-start rounded-lg py-2 text-base font-semibold text-royal-600 hover:text-royal-700"
              >
                Enquire Now <ArrowRight aria-hidden size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
