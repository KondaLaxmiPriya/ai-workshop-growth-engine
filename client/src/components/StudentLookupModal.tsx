import React, { useState } from 'react';
import { Search, X, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { fetchStudentByCode, fetchStudentByEmail } from '../services/api';
import { Student } from '../types';

interface StudentLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentFound: (student: Student) => void;
}

export const StudentLookupModal: React.FC<StudentLookupModalProps> = ({
  isOpen,
  onClose,
  onStudentFound
}) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setError(null);
    setLoading(true);

    try {
      let res;
      if (identifier.includes('@')) {
        res = await fetchStudentByEmail(identifier.trim());
      } else {
        res = await fetchStudentByCode(identifier.trim().toUpperCase());
      }

      if (res && res.student) {
        onStudentFound(res.student);
        onClose();
      }
    } catch (err: any) {
      setError('No registration found with this referral code or email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Access Your Referral Hub</h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter your registered email address or referral code (e.g. NXT-A7K92)
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email or Referral Code
            </label>
            <input
              type="text"
              required
              placeholder="e.g. rahul@example.com or NXT-A7K92"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          Not registered yet?{' '}
          <button
            onClick={onClose}
            className="text-indigo-400 font-semibold underline hover:text-indigo-300"
          >
            Reserve your free seat here
          </button>
        </div>
      </div>
    </div>
  );
};
