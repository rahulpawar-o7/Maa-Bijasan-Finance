import { BUSINESS } from "../lib/config";
import LegalLayout from "./LegalLayout";

export default function TermsAndConditions() {
  return (
    <LegalLayout title="Terms and Conditions" updated="16 October 2026">
      <p>
        By using this website you agree to these terms. If you do not agree, please do not use the website or submit an
        enquiry.
      </p>

      <h2>About this website</h2>
      <p>
        {BUSINESS.name} helps customers explore loan options from banks and other eligible lending institutions. The
        information on this website is general and for guidance only. It is not an offer, commitment or financial advice.
      </p>

      <h2>No guarantee of approval</h2>
      <p>
        Submitting an enquiry does not guarantee a loan. Whether a loan is approved, and its amount, interest rate, fees,
        repayment terms and timelines, are decided by the relevant lender based on your eligibility and the lender's own
        policies and documentation.
      </p>

      <h2>Your enquiry</h2>
      <ul>
        <li>Please provide accurate and complete information.</li>
        <li>By submitting the form you agree that we may contact you about your enquiry using the details you provide.</li>
        <li>Please do not submit Aadhaar, PAN, bank account details, passwords or OTPs through this website.</li>
      </ul>

      <h2>Lender terms</h2>
      <p>
        Any loan you take is a contract between you and the lender. Please read the lender's terms carefully before you
        accept them.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We make reasonable efforts to keep the website accurate and available, but we do not promise it will be error-free
        or uninterrupted. To the extent permitted by law, we are not liable for losses arising from reliance on the
        general information on this website.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date at the top shows when they were last updated.</p>

      <h2>Contact us</h2>
      <p>
        Email: <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> · Phone: <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
      </p>
    </LegalLayout>
  );
}
