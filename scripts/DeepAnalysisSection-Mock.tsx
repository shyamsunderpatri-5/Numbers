import React from 'react';

interface ChaldeanTrait {
  text: string;
  isPositive: boolean;
}

interface SynthesisResult {
  name: string;
  compoundNumber: number;
  compoundName: string;
  primaryPlanet: string;
  rootNumber: number;
  traits: ChaldeanTrait[];
  conflictResolution: string;
}

export const DeepAnalysisSection: React.FC<{ data: SynthesisResult }> = ({ data }) => {
  return (
    <div className="p-8 bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800">
      {/* Header: Compound First */}
      <header className="mb-8 text-center">
        <h2 className="text-4xl font-serif text-amber-400 mb-2">
          {data.compoundNumber} — {data.compoundName}
        </h2>
        <p className="text-sm uppercase tracking-widest text-slate-400">
          Primary Influence: <span className="text-amber-200">{data.primaryPlanet}</span> (Vibration {data.rootNumber})
        </p>
      </header>

      {/* Polarity Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Constructive Column */}
        <div className="p-6 bg-slate-800/50 rounded-lg border-l-4 border-emerald-500">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 uppercase tracking-tighter">
            Constructive Traits
          </h3>
          <ul className="space-y-2">
            {data.traits.filter(t => t.isPositive).map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {t.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Challenging Column */}
        <div className="p-6 bg-slate-800/50 rounded-lg border-l-4 border-rose-500">
          <h3 className="text-xl font-bold text-rose-400 mb-4 uppercase tracking-tighter">
            Challenging Vibrations
          </h3>
          <ul className="space-y-2">
            {data.traits.filter(t => !t.isPositive).map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Synthesis Section */}
      <footer className="mt-8 pt-8 border-t border-slate-800 italic text-slate-300 leading-relaxed">
        <p className="text-center max-w-2xl mx-auto">
          &ldquo;{data.conflictResolution}&rdquo;
        </p>
      </footer>

      {/* Certification Badge */}
      <div className="mt-8 flex justify-center">
        <div className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] text-amber-400 uppercase font-bold tracking-widest">
          Chaldean-Compliant v1.1 Certified
        </div>
      </div>
    </div>
  );
};
