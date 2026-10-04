import React from 'react';
import { Sparkles, Shield, Trophy } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenLeaderboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenLeaderboard }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                AI Workshop Growth Engine
              </span>
              <span className="text-[11px] text-slate-400">
                "Build Your First AI Project in 60 Minutes" • 500 Registrations Target
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <button
              onClick={onOpenLeaderboard}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Leaderboard</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin Analytics Hub</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            NxtWave Growth Intern Prototype • Built with React, Vite, Tailwind CSS, TypeScript, and Express.
          </p>
          <div className="flex items-center gap-4">
            <span>Free & Open for Final-Year Students</span>
            <span>•</span>
            <span>Privacy-First Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
