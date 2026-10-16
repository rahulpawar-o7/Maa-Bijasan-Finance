import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const container = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2",
  gold: "bg-gold-400 text-navy-950 shadow-sm hover:bg-gold-300 focus-visible:outline-gold-300",
  royal: "bg-royal-600 text-white shadow-sm hover:bg-royal-700 focus-visible:outline-royal-600",
  outlineLight: "border border-white/40 text-white hover:bg-white/10 focus-visible:outline-white",
  outlineDark: "border border-navy-900/25 text-navy-900 hover:bg-navy-900/5 focus-visible:outline-royal-600",
} as const;

/** Link to a section of the home page; works from any route. */
export function HashLink({ hash, className, children, onClick, ...rest }: {
  hash: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <Link to={{ pathname: "/", hash }} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "center", light = false, id }: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  light?: boolean;
  id?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.16em] ${light ? "text-gold-400" : "text-royal-600"}`}>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={`text-3xl font-semibold leading-tight sm:text-4xl ${light ? "!text-white" : ""}`}>
        {title}
      </h2>
      <span aria-hidden className={`mt-4 block h-1 w-12 rounded-full bg-gold-400 ${align === "center" ? "mx-auto" : ""}`} />
      {intro && <p className={`mt-5 text-lg ${light ? "text-slate-300" : "text-slate-600"}`}>{intro}</p>}
    </div>
  );
}
