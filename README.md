# Maa Bijasan Finance – Public Website (Phase 1: Frontend)

Public-facing website for Maa Bijasan Finance, Indore.
Stack: **React 19 · Vite · TypeScript · Tailwind CSS v4 · Lucide React · React Router**.

This phase is a **frontend-only** site. There is no custom backend and no database. The owner dashboard and the AI
calling assistant are separate, later phases.

---

## 1. Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
cp .env.example .env     # then fill in ONE submission provider (see section 2)
npm run dev              # http://localhost:5173
```

Other commands:

| Command             | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `npm run build`     | Type-check and create the production build in `dist/` |
| `npm run preview`   | Serve the production build locally              |
| `npm test`          | Run the automated tests (validation, submission service, form behaviour) |
| `npm run typecheck` | TypeScript check only                           |

While no provider is configured, the form shows an amber **developer setup notice** (development mode only) and
submitting returns an error. It never shows a success message.

---

## 2. Set up email delivery (REQUIRED before going live)

A frontend-only site cannot send email or store data by itself. The form posts to a third-party form service, which
forwards each enquiry to **maabijasanfinance@gmail.com**. Pick **one** option.

> Email delivery has **not** been tested against the real services from this project, because that needs your accounts
> and inbox. The code path is tested with mocked responses and a local mock server. Do your own live test (step 4
> below) before launch.

### Option A – Formspree (recommended)

Your email address is not exposed in the page source; only a form ID is.

1. Create an account at https://formspree.io (use maabijasanfinance@gmail.com).
2. Click **New Form**, name it "Loan Enquiries", and set the recipient email to maabijasanfinance@gmail.com.
3. **Verify the email**: open the confirmation email Formspree sends to that inbox and confirm it. Until verified,
   submissions are not delivered.
4. Copy the form URL (looks like `https://formspree.io/f/abcdwxyz`).
5. In `.env` set:
   ```
   VITE_SUBMISSION_PROVIDER=formspree
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```
6. In the Formspree dashboard, add your live domain to the form's allowed domains if the option is available.
   Check the plan's monthly submission limit on Formspree's pricing page.

### Option B – FormSubmit (no account)

1. In `.env` set:
   ```
   VITE_SUBMISSION_PROVIDER=formsubmit
   VITE_FORMSUBMIT_TARGET=maabijasanfinance@gmail.com
   ```
2. Submit one test enquiry from the site. FormSubmit emails an **activation link** to maabijasanfinance@gmail.com.
   Click it (check Spam). Until activated, the site shows an error instead of success.
3. Recommended: after activation, FormSubmit lets you use a random alias instead of the email. Put that alias in
   `VITE_FORMSUBMIT_TARGET` so the email address is not visible in the page source.

### 3. Rules the code follows

- Success is shown **only** when the service confirms receipt (HTTP 2xx, plus `success: true` for FormSubmit).
- Network errors, timeouts (15 s), rejections and server errors show an error message with call/email fallbacks.
- No secret keys are used. A Formspree form URL / FormSubmit address is public by design, and everything in `VITE_*`
  variables is visible in the built JavaScript. Never put private API keys there.
- Customer data is never written to localStorage, sessionStorage or the console, and is not sent to analytics.
- Spam protection: a hidden honeypot field (`_gotcha`/`_honey`) that both services discard.

### 4. Test checklist after configuring

1. `npm run dev`, submit a real test enquiry with your own phone number.
2. Confirm the email arrives in maabijasanfinance@gmail.com (check Spam the first time).
3. Temporarily break the URL in `.env`, restart, submit again: you must see an **error**, not the thank-you panel.

---

## 3. Future owner dashboard integration (planned, not built)

The form already supports a backend provider. When the dashboard backend exists, set:

```
VITE_SUBMISSION_PROVIDER=api
VITE_API_BASE_URL=https://api.your-domain.example
```

The form will then `POST {VITE_API_BASE_URL}/api/enquiries` with JSON:

```json
{
  "fullName": "Ramesh Sharma",
  "mobile": "+919876543210",
  "city": "Indore",
  "loanType": "Home Loan",
  "loanAmount": "₹3,00,000 – ₹5,00,000",
  "contactTime": "10 AM – 12 PM",
  "email": "optional",
  "employmentType": "optional",
  "consentGiven": true,
  "consentText": "I agree that Maa Bijasan Finance may contact me ...",
  "source": "public-website",
  "submittedAt": "2026-10-16T10:00:00.000Z",
  "honeypot": ""
}
```

> **This endpoint does not exist yet.** It is a planned contract. Until it is built, do not select the `api` provider.
> The site treats any non-2xx response as failure and shows an error.

Backend requirements for that phase:

- Save every enquiry to the database **before** returning 2xx (201 Created recommended), so the website only shows
  "success" for enquiries that are really stored.
- Re-validate every field server-side (the browser checks are a convenience only). Reject if `honeypot` is non-empty
  and if `consentGiven` is not `true`.
- Allow the website's origin via CORS; add rate limiting.
- The owner dashboard must be a separate app with server-side authentication. Never expose a public endpoint that
  lists enquiries.
- To keep email notifications as well, the backend can send the email itself.

Only `src/lib/submission.ts` needs to change if the contract changes.

---

## 4. Deploy

The build output is a static site (`dist/`). Always serve over **HTTPS**.

**Vercel** – Import the Git repo. Framework: Vite. Build command `npm run build`, output `dist`. Add the `VITE_*`
variables under *Project Settings → Environment Variables*. `vercel.json` already provides the SPA rewrite so
`/privacy-policy` works on refresh.

**Netlify** – Build command `npm run build`, publish directory `dist`. Add the `VITE_*` variables under *Site settings
→ Environment variables*. `public/_redirects` handles the SPA fallback.

**Any static host / cPanel** – Run `npm run build`, upload the contents of `dist/`, and configure a fallback to
`index.html` for unknown paths.

Environment variables are baked in at **build time**: after changing them, rebuild/redeploy.

---

## 5. Still needs your action

- [ ] Create and verify the form service account (section 2) and test live delivery.
- [ ] Have a legal professional review `Privacy Policy` and `Terms and Conditions`
      (`src/pages/PrivacyPolicy.tsx`, `src/pages/TermsAndConditions.tsx`). They are sensible drafts based on what the
      site actually does, not legal advice.
- [ ] Buy/point a domain, deploy, and confirm HTTPS.
- [ ] Optional: replace the built-in SVG illustrations with real photos (only ones you own or that have a licence that
      allows commercial use) and verify the business details in `src/lib/config.ts`.
- [ ] Optional: add verified bank/lender names, interest rates, reviews, or registration numbers **only** once you have
      proof for them. None are claimed on the site today.
- [ ] Phase 2 (separate): backend + database + authenticated owner dashboard.

## Project structure

```
src/
  components/  Header, Hero, About, LoanServices, WhyChooseUs, HowItWorks,
               LoanEnquiryForm, SuccessMessage, ContactSection, Footer, Illustrations, ui
  pages/       Home, PrivacyPolicy, TermsAndConditions, LegalLayout
  lib/         config.ts (business details), validation.ts, submission.ts, useDocumentTitle.ts
  test/        test setup
```
