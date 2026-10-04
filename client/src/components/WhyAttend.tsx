import React from 'react';
import { Hammer, BookOpen, Award, Users, CheckCircle, GraduationCap } from 'lucide-react';

export const WhyAttend: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why Attend Section */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Why Should You Attend?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            60 minutes designed to give you maximum engineering leverage with zero filler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
              <Hammer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Build</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create your first working AI project from scratch. Write code alongside an industry mentor and deploy it live.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Learn</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Understand the actual workflow behind an AI project: prompt engineering, API keys, error handling, and web wrappers.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Showcase</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Leave with something practical you can continue building, add to GitHub, and speak with confidence about in interviews.
            </p>
          </div>
        </div>

        {/* Who is this for Section */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900/80 via-indigo-950/20 to-slate-900/80 border border-slate-800 p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-4">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>TARGET AUDIENCE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
              Who Should Attend?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Final-Year Engineering Students</h4>
                  <p className="text-xs text-slate-400">Graduating in 2025 or 2026 across CSE, IT, ECE, EEE, and allied branches.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Curious AI Beginners</h4>
                  <p className="text-xs text-slate-400">Know basic programming logic and want to understand practical AI integration.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Placement Preparation Seekers</h4>
                  <p className="text-xs text-slate-400">Want a standout tech project to discuss with interviewers in hiring rounds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Developers Looking for Practicality</h4>
                  <p className="text-xs text-slate-400">Prefer building real tools over listening to hours of passive slide presentations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
