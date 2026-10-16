export const LOAN_TYPES = [
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Loan Against Property",
  "Vehicle Loan",
  "Other",
] as const;
export type LoanType = (typeof LOAN_TYPES)[number];

export const LOAN_AMOUNTS = [
  "Below ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹3,00,000",
  "₹3,00,000 – ₹5,00,000",
  "₹5,00,000 – ₹10,00,000",
  "Above ₹10,00,000",
  "Not Sure Yet",
] as const;

export const CONTACT_TIMES = ["10 AM – 12 PM", "12 PM – 3 PM", "3 PM – 6 PM"] as const;
export const EMPLOYMENT_TYPES = ["Salaried", "Self-employed", "Business Owner", "Other"] as const;

export interface EnquiryValues {
  fullName: string;
  mobile: string;
  city: string;
  loanType: string;
  loanAmount: string;
  contactTime: string;
  email: string;
  employmentType: string;
  consent: boolean;
  /** Hidden anti-spam field. Real users never fill it in. */
  honeypot: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

export const EMPTY_VALUES: EnquiryValues = {
  fullName: "",
  mobile: "",
  city: "",
  loanType: "",
  loanAmount: "",
  contactTime: "",
  email: "",
  employmentType: "",
  consent: false,
  honeypot: "",
};

export type MobileCheck = { ok: true; value: string } | { ok: false; error: string };

/**
 * Validates an Indian mobile number. Accepts 10 digits, optionally written with
 * +91 / 91 / 0 prefix, spaces or dashes. Returns the bare 10 digits on success.
 */
export function checkIndianMobile(input: string): MobileCheck {
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Please enter your mobile number." };
  if (/[^\d\s\-+().]/.test(raw)) return { ok: false, error: "Mobile number should contain digits only." };

  let digits = raw.replace(/[^\d]/g, "");
  if (raw.startsWith("+") || digits.length > 10) {
    if (digits.startsWith("0091") && digits.length === 14) digits = digits.slice(4);
    else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
    else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return { ok: false, error: `Mobile number must be 10 digits. You have entered ${digits.length}.` };
  }
  if (!/^[6-9]/.test(digits)) {
    return { ok: false, error: "Indian mobile numbers start with 6, 7, 8 or 9." };
  }
  if (/^(\d)\1{9}$/.test(digits)) {
    return { ok: false, error: "This mobile number does not look valid. Please check and re-enter." };
  }
  return { ok: true, value: digits };
}

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiry(v: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};

  const name = v.fullName.trim();
  if (!name) errors.fullName = "Please enter your full name.";
  else if (name.length < 2 || !NAME_PATTERN.test(name)) errors.fullName = "Please enter your name using letters only.";
  else if (name.length > 80) errors.fullName = "Name is too long. Please shorten it.";

  const mobile = checkIndianMobile(v.mobile);
  if (!mobile.ok) errors.mobile = mobile.error;

  const city = v.city.trim();
  if (!city) errors.city = "Please enter your city.";
  else if (city.length < 2 || !NAME_PATTERN.test(city)) errors.city = "Please enter a valid city name.";
  else if (city.length > 60) errors.city = "City name is too long.";

  if (!(LOAN_TYPES as readonly string[]).includes(v.loanType)) errors.loanType = "Please select a loan type.";
  if (!(LOAN_AMOUNTS as readonly string[]).includes(v.loanAmount)) errors.loanAmount = "Please select an approximate loan amount.";
  if (!(CONTACT_TIMES as readonly string[]).includes(v.contactTime)) errors.contactTime = "Please select a preferred contact time.";

  const email = v.email.trim();
  if (email && !EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address, or leave it blank.";

  if (!v.consent) errors.consent = "Please tick the consent box so we can contact you about this enquiry.";

  return errors;
}
