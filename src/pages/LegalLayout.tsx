import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { HashLink, container } from "../components/ui";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  useDocumentTitle(`${title} | Maa Bijasan Finance`);
  return (
    <div className="bg-white py-12 sm:py-16">
      <article className={`${container} max-w-3xl`}>
        <HashLink hash="#home" className="inline-flex items-center gap-2 text-[15px] font-semibold text-royal-600 hover:text-royal-700">
          <ArrowLeft aria-hidden size={16} /> Back to Home
        </HashLink>
        <h1 className="mt-6 text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>
        <div className="mt-8 space-y-4 text-[17px] text-slate-700 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-royal-600 [&_a]:underline">
          {children}
        </div>
      </article>
    </div>
  );
}
