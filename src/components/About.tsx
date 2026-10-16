import { container, SectionHeading } from "./ui";
import { GuidanceIllustration } from "./Illustrations";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-white py-16 sm:py-24">
      <div className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
        <GuidanceIllustration className="order-2 mx-auto w-full max-w-lg lg:order-1" />
        <div className="order-1 lg:order-2">
          <SectionHeading id="about-title" align="left" eyebrow="Who we are" title="About Maa Bijasan Finance" />
          <div className="mt-6 space-y-4 text-lg text-slate-600">
            <p>
              Maa Bijasan Finance helps individuals explore loan options according to their financial needs and
              eligibility.
            </p>
            <p>
              We aim to make the loan enquiry process simple by helping customers understand available options, required
              information and the next steps.
            </p>
            <p>
              Depending on the customer's profile and eligibility, suitable options may be available through government
              and private sector banks or other eligible lending institutions.
            </p>
            <p>
              Our goal is to provide clear communication, helpful guidance and a straightforward customer experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
