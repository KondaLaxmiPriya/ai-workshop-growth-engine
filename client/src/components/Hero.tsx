import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Globe2, Sparkles, Terminal, Users2, Zap } from 'lucide-react';
import { Campaign } from '../types';

interface HeroProps {
  campaign: Campaign | null;
  onOpenRegister: () => void;
  onScrollToGrowthLoop: () => void;
  onScrollToProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  campaign,
  onOpenRegister,
  onScrollToGrowthLoop,
  onScrollToProject
}) => {
  const current = campaign?.current_registrations || 347;
  const target = campaign?.target_registrations || 500;
  const remaining = Math.max(0, target - current);
  const percentage = Math.min(100, Math.round((current / target) * 100));

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Tag Badges */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner mb-6 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">FREE ONLINE WORKSHOP</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">FOR FINAL-YEAR ENGINEERING STUDENTS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Build Your First AI Project in{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
              60 Minutes
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Go from AI beginner to a working project in one free online workshop.
            Specially designed for final-year engineering students wanting a resume-ready project before campus placements.
          </p>

          {/* Key workshop pillars */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300 font-medium mb-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <span>Live Online (Interactive)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>60 Minutes Pure Building</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Resume-Ready Project</span>
            </div>
          </div>

          {/* Dynamic 500 Registration Goal Progress Bar */}
          <div className="mb-10 max-w-xl mx-auto p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/20 shadow-xl shadow-indigo-950/40 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">500 Seats Registration Goal</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold">{current}</span>
                <span className="text-slate-400"> / {target} confirmed</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-sm shadow-emerald-500/50"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
              <span>{percentage}% seats filled</span>
              <span className="text-amber-300 font-semibold">{remaining} seats remaining before cap</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-98 transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Reserve My Free Seat</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onScrollToGrowthLoop}
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>See How It Works</span>
            </button>
          </div>

          {/* Trust elements */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Beginner friendly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes code templates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
