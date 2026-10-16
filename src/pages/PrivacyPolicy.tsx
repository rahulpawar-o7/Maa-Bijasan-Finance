import { BUSINESS } from "../lib/config";
import LegalLayout from "./LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated="16 October 2026">
      <p>
        This Privacy Policy explains how {BUSINESS.name} ("we", "us") handles the personal information you submit through
        this website's loan enquiry form.
      </p>

      <h2>Information we collect</h2>
      <p>When you submit an enquiry, we collect only what you enter in the form:</p>
      <ul>
        <li>Full name, mobile number and city</li>
        <li>Loan type, approximate loan amount and preferred contact time</li>
        <li>Email address and employment type (optional)</li>
        <li>Your consent to be contacted about the enquiry</li>
      </ul>
      <p>
        We do not ask for Aadhaar, PAN, bank account details, passwords or OTPs through this website. Please do not
        share them in the form.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To contact you about your loan enquiry, using the details you provided and your preferred contact time</li>
        <li>To understand your requirements and explain possible next steps</li>
      </ul>

      <h2>How your enquiry is delivered</h2>
      <p>
        Your enquiry is sent over an encrypted (HTTPS) connection to a third-party form-handling service, which delivers
        it to {BUSINESS.name}'s business email. That service processes the data only to deliver the enquiry to us.
      </p>

      <h2>Sharing</h2>
      <p>
        We use your information to respond to your enquiry. Where a lender needs your details to consider a loan, we will
        discuss it with you first. We do not sell your personal information.
      </p>

      <h2>Cookies and tracking</h2>
      <p>This website does not use advertising or third-party tracking scripts.</p>

      <h2>Retention and your choices</h2>
      <p>
        We keep enquiry details only as long as needed to respond to you and for legitimate business records. You may ask
        us to correct or delete your enquiry details, or to stop contacting you, at any time using the contact details
        below.
      </p>

      <h2>Contact us</h2>
      <p>
        {BUSINESS.name}, {BUSINESS.addressLines.join(" ")}
        <br />
        Email: <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> · Phone: <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
      </p>
    </LegalLayout>
  );
}
