import { ClipboardList, Layers, MessagesSquare, UserRoundCheck } from "lucide-react";
import { SectionHeading, container } from "./ui";

const FEATURES = [
  { Icon: Layers, title: "Multiple Loan Options", text: "Explore potentially suitable options from different eligible lenders." },
  { Icon: UserRoundCheck, title: "Personalised Guidance", text: "Get guidance based on your stated financial requirements." },
  { Icon: ClipboardList, title: "Simple Enquiry Process", text: "Share your basic requirements through an easy-to-use form." },
  { Icon: MessagesSquare, title: "Clear Communication", text: "Understand the next steps and the information needed for your enquiry." },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="bg-white py-16 sm:py-24">
      <div className={container}>
        <SectionHeading id="why-title" eyebrow="Why Maa Bijasan Finance" title="Why Explore Loan Options With Us?" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-slate-200 bg-surface p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                <Icon aria-hidden size={22} />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
