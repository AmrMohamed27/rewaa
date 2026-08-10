interface LegalHeroProps {
  title: string;
  explanation: string;
}

export function LegalHero({ title, explanation }: LegalHeroProps) {
  return (
    <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-tasto-white mb-6 w-full">
        {title}
      </h1>
      <p className="text-lg md:text-xl leading-relaxed text-tasto-white/80 max-w-3xl font-light mx-auto md:mx-0">
        {explanation}
      </p>
      <div className="mt-12 border-b border-tasto-white/5 w-full" />
    </div>
  );
}
