import React from 'react';
import { FileCode, AlertCircle, Sparkles, BrainCircuit, Rocket, CheckCircle } from 'lucide-react';

export const StudentPainPoints: React.FC = () => {
  const painPoints = [
    {
      quote: "I want an AI project for my resume before campus drives start.",
      context: "Campus recruiters are looking for hands-on GenAI understanding beyond standard CRUD apps.",
      solution: "Build a deployed AI tool you can demo in live interviews.",
      icon: FileCode,
      color: "from-blue-500/20 to-indigo-500/20",
      accent: "text-blue-400"
    },
    {
      quote: "I know Python syntax, but don't know how to turn it into a real AI application.",
      context: "College coursework teaches algorithms, but rarely teaches how to connect LLM APIs and prompt workflows.",
      solution: "Bridge the gap between basic scripts and full working AI pipelines.",
      icon: BrainCircuit,
      color: "from-violet-500/20 to-purple-500/20",
      accent: "text-violet-400"
    },
    {
      quote: "Tutorials on YouTube take 30 hours of theory. I want something I can build quickly.",
      context: "Final-year students juggle classes, lab records, and placement preparation — time is scarce.",
      solution: "A focused 60-minute session where 100% of the time is spent coding and shipping.",
      icon: Rocket,
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-400"
    },
    {
      quote: "I want practical AI experience without getting overwhelmed by deep math.",
      context: "You don't need a PhD in linear algebra to build high-utility AI tools using modern models.",
      solution: "Master applied AI engineering: API calls, structured outputs, and practical interfaces.",
      icon: Sparkles,
      color: "from-amber-500/20 to-orange-500/20",
      accent: "text-amber-400"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-900/40 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>BUILT FOR FINAL-YEAR REALITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Sounds Familiar? You're Not Alone.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            We spoke with over 200 final-year engineering students. Here are the exact bottlenecks this workshop dissolves in 60 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-0.5 duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border border-slate-700/50 shrink-0`}>
                    <Icon className={`w-6 h-6 ${item.accent}`} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 italic">
                      "{item.quote}"
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mb-3 leading-relaxed">
                      {item.context}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-900/40">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.solution}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
