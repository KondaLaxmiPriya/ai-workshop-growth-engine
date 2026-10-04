import React, { useState, useEffect } from 'react';
import { Trophy, Building2, Users, X, Award, Shield, Sparkles } from 'lucide-react';
import { fetchLeaderboard, fetchCollegeLeaderboard } from '../services/api';
import { LeaderboardEntry, CollegeLeaderboardEntry } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'students' | 'colleges'>('students');
  const [students, setStudents] = useState<LeaderboardEntry[]>([]);
  const [colleges, setColleges] = useState<CollegeLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, collegesRes] = await Promise.all([
        fetchLeaderboard(),
        fetchCollegeLeaderboard()
      ]);
      setStudents(studentsRes.leaderboard || []);
      setColleges(collegesRes.colleges || []);
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Growth Leaderboard</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Live Rankings
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Recognizing top student advocates amplifying the AI workshop.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Privacy Notice */}
        <div className="px-6 pt-4 pb-2 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('students')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                tab === 'students'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Growth Champions</span>
            </button>

            <button
              onClick={() => setTab('colleges')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                tab === 'colleges'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Campus Rankings</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict privacy: Email & phone are never displayed</span>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-800/60">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading verified standings...
            </div>
          ) : tab === 'students' ? (
            students.length > 0 ? (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider">
                    <th className="py-2 pl-2">Rank</th>
                    <th className="py-2">Student</th>
                    <th className="py-2">College</th>
                    <th className="py-2 text-right">Referrals</th>
                    <th className="py-2 pr-2 text-right">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {students.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          entry.rank === 1 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                          entry.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                          entry.rank === 3 ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40' :
                          'text-slate-400'
                        }`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="py-3 text-white font-semibold">{entry.name}</td>
                      <td className="py-3 text-slate-400 truncate max-w-[200px]">{entry.college}</td>
                      <td className="py-3 text-right">
                        <span className="font-extrabold text-emerald-400">{entry.referrals}</span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
                          {entry.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No students on leaderboard yet.
              </div>
            )
          ) : (
            /* College Rankings Tab */
            colleges.length > 0 ? (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider">
                    <th className="py-2 pl-2">Rank</th>
                    <th className="py-2">College</th>
                    <th className="py-2 text-right">Registrations</th>
                    <th className="py-2 text-right">Viral Referrals</th>
                    <th className="py-2 pr-2 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {colleges.map((c) => (
                    <tr key={c.rank} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-slate-300 bg-slate-800">
                          {c.rank}
                        </span>
                      </td>
                      <td className="py-3 text-white font-semibold">{c.college}</td>
                      <td className="py-3 text-right text-indigo-300 font-bold">{c.registrations}</td>
                      <td className="py-3 text-right text-emerald-400">{c.referralRegistrations}</td>
                      <td className="py-3 pr-2 text-right text-slate-400">{c.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No college data loaded yet.
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Rankings update dynamically with every verified student registration.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
