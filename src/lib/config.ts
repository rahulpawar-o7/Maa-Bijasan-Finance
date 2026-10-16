/** Single source of truth for business details shown across the site. */
export const BUSINESS = {
  name: "Maa Bijasan Finance",
  phoneDisplay: "+91 88170 71676",
  phoneHref: "tel:+918817071676",
  email: "maabijasanfinance@gmail.com",
  emailHref: "mailto:maabijasanfinance@gmail.com",
  addressLines: [
    "G3, Silver Park Colony, Near The Exotica Hotel,",
    "Agra Bombay Bypass Road, Indore, Madhya Pradesh, India.",
  ],
  // The address is only used as a text search query - no coordinates are assumed.
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "G3, Silver Park Colony, Near The Exotica Hotel, Agra Bombay Bypass Road, Indore, Madhya Pradesh, India",
    ),
} as const;

export const ADDRESS_ONE_LINE = BUSINESS.addressLines.join(" ");

export const CONSENT_TEXT =
  "I agree that Maa Bijasan Finance may contact me regarding this loan enquiry using the contact details I have provided. I have read the Privacy Policy.";

export const NAV_LINKS = [
  { label: "Home", hash: "#home" },
  { label: "About Us", hash: "#about" },
  { label: "Loan Services", hash: "#services" },
  { label: "How It Works", hash: "#how-it-works" },
  { label: "Contact Us", hash: "#contact" },
] as const;
