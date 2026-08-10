import React from "react";

interface LegalSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 py-10 border-b border-tasto-white/5 last:border-b-0 text-center md:text-left"
    >
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-tasto-white mb-6 font-sans">
        {title}
      </h2>
      <div className="text-base leading-8 text-tasto-white/70 space-y-4 font-normal [&_ul]:list-disc [&_ul]:list-inside [&_ul]:md:list-outside [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:md:list-outside [&_ul]:pl-0 [&_ul]:md:pl-6 [&_ol]:pl-0 [&_ol]:md:pl-6 [&_li]:text-center [&_li]:md:text-left">
        {children}
      </div>
    </section>
  );
}
