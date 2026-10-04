import React from 'react';
import { Sparkles, Trophy, Users, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { Campaign } from '../types';

interface NavbarProps {
  campaign: Campaign | null;
  onOpenRegister: () => void;
  onOpenLeaderboard: () => void;
  onOpenAdmin: () => void;
  onOpenStudentLookup: () => void;
  currentStudentCode?: string | null;
  onGoToDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  campaign,
  onOpenRegister,
  onOpenLeaderboard,
  onOpenAdmin,
  onOpenStudentLookup,
  currentStudentCode,
  onGoToDashboard,
}) => {
  const currentCount = campaign?.current_registrations || 347;
  const target = campaign?.target_registrations || 500;
  const percentage = Math.min(100, Math.round((currentCount / target) * 100));

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      {/* Dynamic Announcement Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 px-4 py-1.5 text-xs text-center text-slate-300 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          LIVE REGISTRATIONS
        </span>
        <span className="font-medium text-slate-200">
          <strong className="text-white font-bold">{currentCount} / {target}</strong> seats reserved ({percentage}%)
        </span>
        <span className="text-slate-500">•</span>
        <span className="text-amber-400 font-medium">Free for Final-Year Engineering Students</span>
        <span className="text-slate-500">•</span>
        <span className="text-indigo-300 font-semibold underline cursor-pointer hover:text-white" onClick={onOpenRegister}>
          Reserve Before Full →
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AI Workshop Growth Engine
              </span>
              <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                NxtWave Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Turn student interest into 500 registrations.
            </p>
          </div>
        </div>

        {/* Navigation links & CTA actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {currentStudentCode ? (
            <button
              onClick={onGoToDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 hover:bg-indigo-900/60 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>My Referral Hub</span>
            </button>
          ) : (
            <button
              onClick={onOpenStudentLookup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
              title="Already registered? View your referral link & stats"
            >
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Check Referral Stats</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="Admin Growth Dashboard"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Admin Hub</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-95 transition-all"
          >
            <span>Reserve Free Seat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
