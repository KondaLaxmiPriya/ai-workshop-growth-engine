import React from 'react';
import { UserCheck, Share2, Users, Award, Trophy, ArrowRight, Zap, Gift } from 'lucide-react';

export const GrowthLoopExplainer: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: UserCheck,
      title: "Register Free",
      description: "Submit the simple registration form. Your seat is confirmed immediately.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      num: "02",
      icon: Gift,
      title: "Get Referral Code",
      description: "Receive your unique referral code (e.g. NXT-A7K92) and shareable link.",
      color: "from-indigo-500 to-violet-500"
    },
    {
      num: "03",
      icon: Share2,
      title: "Share with Batchmates",
      description: "Use 1-click AI-customized WhatsApp and LinkedIn messages to invite friends.",
      color: "from-violet-500 to-fuchsia-500"
    },
    {
      num: "04",
      icon: Users,
      title: "Friends Register",
      description: "When verified students register with your code, your count increments live.",
      color: "from-fuchsia-500 to-emerald-500"
    },
    {
      num: "05",
      icon: Trophy,
      title: "Unlock Badges & Rank",
      description: "Earn 'AI Starter', 'AI Builder', and compete on the campus leaderboard.",
      color: "from-emerald-500 to-amber-500"
    }
  ];

  const milestones = [
    { count: 0, title: "Registered", desc: "Seat confirmed", badge: "🎯" },
    { count: 3, title: "AI Starter", desc: "Top 30% builder badge", badge: "⚡" },
    { count: 5, title: "AI Builder", desc: "Exclusive AI prompt pack", badge: "🚀" },
    { count: 10, title: "Growth Champion", desc: "Leaderboard recognition", badge: "🏆" },
    { count: 20, title: "AI Growth Leader", desc: "Top campus advocate", badge: "👑" },
  ];

  return (
    <section id="growth-loop" className="py-16 md:py-24 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>VIRAL ACQUISITION MECHANICS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            How The Referral Challenge Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Learning is 10x better with your study circle. Help your batchmates discover the workshop and earn milestone recognition.
          </p>
        </div>

        {/* 5-Step Visual Growth Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between group hover:border-indigo-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-500">{step.num}</span>
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${step.color} p-0.5 flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Milestones Gamification Bar */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-950/80 border border-slate-800 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Referral Milestones & Badges</span>
              </h4>
              <p className="text-xs text-slate-400">Unlock official digital badges on your student dashboard.</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Zero Spam • Only Verified Registrations Count
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center hover:border-slate-700 transition-colors"
              >
                <div className="text-2xl mb-1.5">{m.badge}</div>
                <div className="text-xs font-bold text-white">{m.title}</div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">{m.count} Referrals</div>
                <div className="text-[10px] text-slate-400 mt-1">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
