import { useState } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import LoanServices from "../components/LoanServices";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import LoanEnquiryForm from "../components/LoanEnquiryForm";
import type { LoanPreset } from "../components/LoanEnquiryForm";
import ContactSection from "../components/ContactSection";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import type { LoanType } from "../lib/validation";

export default function Home() {
  useDocumentTitle("Maa Bijasan Finance | Loan Options & Guidance in Indore");
  const [preset, setPreset] = useState<LoanPreset | null>(null);

  function handleEnquire(type: LoanType) {
    setPreset({ type, nonce: Date.now() });
    document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move screen-reader focus to the form heading without jumping the page or opening a keyboard.
    document.getElementById("enquiry-heading")?.focus({ preventScroll: true });
  }

  return (
    <>
      <Hero />
      <About />
      <LoanServices onEnquire={handleEnquire} />
      <WhyChooseUs />
      <HowItWorks />
      <LoanEnquiryForm preset={preset} />
      <ContactSection />
    </>
  );
}
