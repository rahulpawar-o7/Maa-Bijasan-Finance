import { SectionHeading, container } from "./ui";

const STEPS = [
  { title: "Submit Your Enquiry", text: "Tell us about your loan requirements through our simple form." },
  {
    title: "Our Team Reviews Your Requirements",
    text: "Our team can review your enquiry and contact you regarding the next steps, subject to the applicable process.",
  },
  {
    title: "Explore Suitable Options",
    text: "Explore potentially suitable loan options based on your eligibility and the terms offered by the relevant lender.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="bg-navy-900 py-16 text-white sm:py-24">
      <div className={container}>
        <SectionHeading id="how-title" light eyebrow="Three simple steps" title="How It Works" />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden
            className="absolute left-[calc(16.66%+1.75rem)] right-[calc(16.66%+1.75rem)] top-7 hidden border-t border-dashed border-gold-400/50 md:block"
          />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-400 font-serif text-2xl font-bold text-navy-950 ring-8 ring-navy-900">
                {i + 1}
              </span>
              <div className="md:mt-6">
                <h3 className="!text-white text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-slate-300">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
