import { forwardRef } from "react";
import { CircleCheck, House, Phone } from "lucide-react";
import { BUSINESS } from "../lib/config";
import { btn } from "./ui";

/** Shown ONLY after the submission service has confirmed the enquiry. */
const SuccessMessage = forwardRef<HTMLHeadingElement, { onBack: () => void }>(function SuccessMessage({ onBack }, ref) {
  return (
    <div role="status" className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200 sm:p-12">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CircleCheck aria-hidden size={44} />
      </span>
      <h3 ref={ref} tabIndex={-1} className="mt-6 text-3xl font-semibold outline-none">
        Thank You for Your Enquiry!
      </h3>
      <p className="mx-auto mt-4 max-w-md text-lg text-slate-600">Your loan enquiry has been submitted successfully.</p>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        Thank you for contacting <strong className="text-navy-900">{BUSINESS.name}</strong>. Our team may contact you
        regarding your requirements.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={onBack} className={`${btn.base} ${btn.royal}`}>
          <House aria-hidden size={18} /> Back to Home
        </button>
        <a href={BUSINESS.phoneHref} className={`${btn.base} ${btn.outlineDark}`}>
          <Phone aria-hidden size={18} /> Call Our Team
        </a>
      </div>
      <p className="mt-4 text-sm text-slate-500">{BUSINESS.phoneDisplay}</p>
    </div>
  );
});

export default SuccessMessage;
