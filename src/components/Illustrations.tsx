/** Local SVG artwork: always loads, no licensing or network dependency. */

export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 420"
      role="img"
      aria-label="Illustration of an enquiry form, a home and coins representing loan options"
      className={className}
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b3a68" />
          <stop offset="1" stopColor="#122b4f" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="460" height="400" rx="32" fill="url(#hero-bg)" stroke="#d4af5a" strokeOpacity=".4" />
      <circle cx="372" cy="104" r="62" fill="#d4af5a" fillOpacity=".14" />
      <circle cx="90" cy="360" r="46" fill="#3b6bea" fillOpacity=".18" />

      {/* enquiry sheet */}
      <g transform="translate(58 62)">
        <rect width="200" height="256" rx="16" fill="#fff" />
        <rect x="22" y="24" width="96" height="12" rx="6" fill="#0b1f3a" />
        <rect x="22" y="46" width="150" height="8" rx="4" fill="#cbd5e1" />
        {[84, 124, 164].map((y) => (
          <g key={y}>
            <circle cx="34" cy={y} r="11" fill="#dbe6fd" />
            <path d={`M28 ${y}l4 4 8-9`} fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="56" y={y - 8} width="110" height="9" rx="4.5" fill="#cbd5e1" />
            <rect x="56" y={y + 4} width="70" height="7" rx="3.5" fill="#e2e8f0" />
          </g>
        ))}
        <rect x="22" y="200" width="156" height="32" rx="10" fill="#1d4ed8" />
        <rect x="58" y="212" width="84" height="8" rx="4" fill="#fff" fillOpacity=".85" />
      </g>

      {/* home */}
      <g transform="translate(262 108)">
        <path d="M0 74L74 8l74 66" fill="none" stroke="#d4af5a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="72" width="108" height="86" rx="6" fill="#fff" />
        <rect x="62" y="104" width="24" height="54" rx="4" fill="#1d4ed8" />
        <rect x="32" y="88" width="20" height="18" rx="3" fill="#dbe6fd" />
        <rect x="96" y="88" width="20" height="18" rx="3" fill="#dbe6fd" />
      </g>

      {/* growth bars */}
      <g transform="translate(292 292)">
        {[
          [0, 36],
          [26, 58],
          [52, 82],
        ].map(([x, h]) => (
          <rect key={x} x={x} y={100 - h} width="18" height={h} rx="5" fill="#3b6bea" fillOpacity=".9" />
        ))}
      </g>

      {/* coins */}
      <g transform="translate(366 304)">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <ellipse cx="38" cy={44 - i * 12} rx="38" ry="12" fill="#b98f34" />
            <ellipse cx="38" cy={38 - i * 12} rx="38" ry="12" fill="#d4af5a" />
          </g>
        ))}
        <text x="38" y="14" textAnchor="middle" fontSize="18" fontWeight="700" fill="#7a5a14">₹</text>
      </g>
    </svg>
  );
}

export function GuidanceIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 400"
      role="img"
      aria-label="Illustration of a conversation and a checklist representing loan guidance"
      className={className}
    >
      <rect x="6" y="6" width="468" height="388" rx="28" fill="#eef3fe" />
      <circle cx="400" cy="70" r="50" fill="#d4af5a" fillOpacity=".25" />
      <circle cx="70" cy="340" r="64" fill="#1d4ed8" fillOpacity=".08" />

      {/* checklist card */}
      <g transform="translate(222 56)">
        <rect width="212" height="262" rx="18" fill="#fff" stroke="#dbe6fd" strokeWidth="2" />
        <rect x="24" y="26" width="100" height="12" rx="6" fill="#0b1f3a" />
        {[76, 120, 164, 208].map((y, i) => (
          <g key={y}>
            <rect x="24" y={y - 12} width="24" height="24" rx="7" fill={i < 3 ? "#1d4ed8" : "#dbe6fd"} />
            {i < 3 && <path d={`M30 ${y}l5 5 9-10`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            <rect x="62" y={y - 8} width={120 - i * 14} height="9" rx="4.5" fill="#cbd5e1" />
            <rect x="62" y={y + 4} width="64" height="7" rx="3.5" fill="#e2e8f0" />
          </g>
        ))}
      </g>

      {/* conversation bubbles */}
      <g transform="translate(40 96)">
        <path d="M18 0h150a18 18 0 0 1 18 18v62a18 18 0 0 1-18 18H70l-30 24V98H18A18 18 0 0 1 0 80V18A18 18 0 0 1 18 0z" fill="#0b1f3a" />
        <rect x="22" y="26" width="120" height="9" rx="4.5" fill="#fff" fillOpacity=".9" />
        <rect x="22" y="48" width="86" height="9" rx="4.5" fill="#fff" fillOpacity=".55" />
      </g>
      <g transform="translate(70 238)">
        <path d="M18 0h120a18 18 0 0 1 18 18v40a18 18 0 0 1-18 18h-8v24l-30-24H18A18 18 0 0 1 0 58V18A18 18 0 0 1 18 0z" fill="#d4af5a" />
        <rect x="22" y="22" width="92" height="9" rx="4.5" fill="#0b1f3a" fillOpacity=".75" />
        <rect x="22" y="42" width="58" height="9" rx="4.5" fill="#0b1f3a" fillOpacity=".45" />
      </g>
    </svg>
  );
}

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="14" fill="#122b4f" stroke="#d4af5a" strokeOpacity=".6" />
      <path d="M14 46V20l18 16 18-16v26" fill="none" stroke="#d4af5a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
