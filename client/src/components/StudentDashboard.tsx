import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Copy, Share2, MessageCircle, Sparkles,
  Trophy, Award, Users, ArrowUpRight, Zap, RefreshCw, Send, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { fetchStudentByCode, generateAIMessage, triggerQuickReferral } from '../services/api';

interface StudentDashboardProps {
  initialStudent: Student;
  onBackToHome: () => void;
  onOpenLeaderboard: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  initialStudent,
  onBackToHome,
  onOpenLeaderboard
}) => {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // AI Message Generator state
  const [audience, setAudience] = useState<string>('College WhatsApp Group');
  const [tone, setTone] = useState<string>('Friendly');
  const [aiMessage, setAiMessage] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [simulatingReferral, setSimulatingReferral] = useState(false);

  const referralUrl = `${window.location.origin}/?ref=${student.referral_code}`;

  // Default pre-filled WhatsApp message
  const defaultWhatsAppText = `Hey! 👋\n\nI'm attending a free online workshop called\n"Build Your First AI Project in 60 Minutes" by NxtWave.\n\nIf you're a final-year engineering student and want to build a resume-ready AI project, you might find this useful.\n\nRegister here:\n${referralUrl}\n\nIt's free!`;

  // Fetch AI message when audience or tone changes
  useEffect(() => {
    handleGenerateAiMessage();
  }, [audience, tone, student.referral_code]);

  const handleGenerateAiMessage = async () => {
    setLoadingAi(true);
    try {
      const res = await generateAIMessage({
        audience,
        tone,
        studentName: student.name,
        referralLink: referralUrl,
        referralCode: student.referral_code
      });
      setAiMessage(res.message);
    } catch (err) {
      console.error('Failed to generate AI message:', err);
      setAiMessage(defaultWhatsAppText);
    } finally {
      setLoadingAi(false);
    }
  };

  const copyToClipboard = (text: string, type: 'link' | 'code' | 'message') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleWhatsAppShare = (customText?: string) => {
    const textToShare = customText || aiMessage || defaultWhatsAppText;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank');
  };

  const handleSimulateReferral = async () => {
    setSimulatingReferral(true);
    try {
      await triggerQuickReferral(student.referral_code);
      // Refresh student data
      const updated = await fetchStudentByCode(student.referral_code);
      setStudent(updated.student);
      
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulatingReferral(false);
    }
  };

  // Milestone calculation
  const referralsCount = student.referrals_count || 0;
  const milestones = [
    { target: 3, title: 'AI Starter', badge: '⚡' },
    { target: 5, title: 'AI Builder', badge: '🚀' },
    { target: 10, title: 'Growth Champion', badge: '🏆' },
    { target: 20, title: 'AI Growth Leader', badge: '👑' },
  ];

  const nextMilestone = milestones.find(m => m.target > referralsCount) || null;
  const neededForNext = nextMilestone ? nextMilestone.target - referralsCount : 0;
  const progressPercent = nextMilestone
    ? Math.min(100, Math.round((referralsCount / nextMilestone.target) * 100))
    : 100;

  const getGraduationLabel = (year: string) => {
    if (year === '2027') return 'Class of 2027 (Final Year)';
    if (year === '2026') return 'Class of 2026 (Recent Graduate)';
    if (year === '2025') return 'Class of 2025 (Graduated)';
    return `Class of ${year}`;
  };

  return (
    <div className="py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>REGISTRATION CONFIRMED • SEAT RESERVED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {student.name.split(' ')[0]}! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {student.college} • {student.branch} • {getGraduationLabel(student.graduation_year)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLeaderboard}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>View Leaderboard</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
            >
              Workshop Details
            </button>
          </div>
        </div>
      </div>

      {/* Referral Hub & Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Referrals */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Your Referrals</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{referralsCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            ✓ Confirmed friend registrations
          </div>
        </div>

        {/* Current Rank */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Growth Rank</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">#{student.rank || 1}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Across registered students
          </div>
        </div>

        {/* Current Badge */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Current Badge</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 truncate">
            {student.badge?.title || 'Registered'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Tier {student.badge?.tier || 0} milestone unlocked
          </div>
        </div>

        {/* Demo Quick Simulator Button */}
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
              INTERVIEW DEMO HELPER
            </span>
            <div className="text-xs text-slate-300 leading-tight">
              Test referral attribution live
            </div>
          </div>
          <button
            onClick={handleSimulateReferral}
            disabled={simulatingReferral}
            className="w-full mt-3 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-50"
          >
            {simulatingReferral ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>Simulate +1 Friend Registering</span>
          </button>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2.5">
          <span className="font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Next Milestone: {nextMilestone ? nextMilestone.title : 'Max Milestone Reached! 👑'}</span>
          </span>
          <span className="text-slate-400">
            {nextMilestone ? (
              <strong className="text-indigo-400">{neededForNext} more referrals needed</strong>
            ) : (
              <span className="text-emerald-400 font-semibold">All Badges Unlocked!</span>
            )}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          {milestones.map((m, idx) => {
            const unlocked = referralsCount >= m.target;
            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border text-xs transition-all ${
                  unlocked
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-base mb-0.5">{m.badge}</div>
                <div className="font-bold">{m.title}</div>
                <div className="text-[10px] opacity-80">{m.target} Referrals</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Unique Referral Code & Links */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <span>Want to help your friends discover the workshop?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Share your personal invite link. When they register, your referral count and rank update immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Referral Code Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Your Referral Code
              </span>
              <span className="text-2xl font-mono font-extrabold text-indigo-400 tracking-wider">
                {student.referral_code}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(student.referral_code, 'code')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Referral Link Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Your Referral Link
              </span>
              <span className="text-xs font-mono text-slate-300 truncate block mt-1">
                {referralUrl}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(referralUrl, 'link')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Primary Share Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => handleWhatsAppShare()}
            className="flex-1 min-w-[200px] py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleLinkedInShare}
            className="py-3 px-5 rounded-xl bg-blue-700 hover:bg-blue-600 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
            </svg>
            <span>Share on LinkedIn</span>
          </button>

          <button
            onClick={() => copyToClipboard(aiMessage || defaultWhatsAppText, 'message')}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            {copiedMessage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMessage ? 'Message Copied!' : 'Copy Message'}</span>
          </button>
        </div>
      </div>

      {/* AI Message Generator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED SHARING ASSISTANT</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Generate Personalized Sharing Messages
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Choose your audience and tone. The AI tailors the message with your referral link automatically.
            </p>
          </div>
        </div>

        {/* Audience Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Target Audience:
          </label>
          <div className="flex flex-wrap gap-2">
            {['College WhatsApp Group', 'Close Friend', 'Coding Club', 'LinkedIn Network', 'Classmates'].map((item) => (
              <button
                key={item}
                onClick={() => setAudience(item)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  audience === item
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Message Tone:
          </label>
          <div className="flex flex-wrap gap-2">
            {['Friendly', 'Professional', 'Exciting', 'Short'].map((item) => (
              <button
                key={item}
                onClick={() => setTone(item)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  tone === item
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Message Display Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 relative">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800 pb-2">
            <span className="font-mono text-[11px] text-indigo-400">
              Preview • {audience} ({tone})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(aiMessage, 'message')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          <pre className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
            {loadingAi ? 'Generating customized copy...' : aiMessage}
          </pre>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
            <button
              onClick={() => handleWhatsAppShare(aiMessage)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share This to WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referred Friends Audit List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Referred Friends ({student.referred_friends?.length || 0})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Students who successfully used your referral link.
            </p>
          </div>
        </div>

        {student.referred_friends && student.referred_friends.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {student.referred_friends.map((friend, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-white">{friend.name}</span>
                  <span className="text-slate-500 text-xs ml-2">({friend.college})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-medium border border-emerald-500/30">
                    Confirmed Seat
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-slate-300 font-medium">No referrals yet</p>
            <p className="text-slate-500 mt-1">
              Share your link in your college WhatsApp group to earn your first milestone badge!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
