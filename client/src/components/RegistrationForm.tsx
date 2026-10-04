import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerStudent } from '../services/api';
import { Student } from '../types';

interface RegistrationFormProps {
  onSuccess: (student: Student) => void;
  initialRefCode?: string | null;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, initialRefCode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    graduation_year: '2027',
    skill_level: 'Beginner',
    preferred_technology: 'Python',
    source: 'Friend/Referral',
    ref_code: initialRefCode || '',
    leaderboard_visible: true
  });

  const [attribution, setAttribution] = useState<{
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
  }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingStudent, setExistingStudent] = useState<Student | null>(null);

  // Parse URL params for referral code and UTM attribution on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || initialRefCode || '';
    const utm_source = params.get('utm_source');
    const utm_medium = params.get('utm_medium');
    const utm_campaign = params.get('utm_campaign');
    const utm_content = params.get('utm_content');

    if (ref) {
      setFormData(prev => ({
        ...prev,
        ref_code: ref.toUpperCase(),
        source: 'Friend/Referral'
      }));
    } else if (utm_source) {
      setFormData(prev => ({
        ...prev,
        source: utm_source.toLowerCase().includes('whatsapp') ? 'WhatsApp' : 
                utm_source.toLowerCase().includes('linkedin') ? 'LinkedIn' :
                utm_source.toLowerCase().includes('insta') ? 'Instagram' : 'Other'
      }));
    }

    setAttribution({
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content
    });
  }, [initialRefCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setExistingStudent(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ...attribution
      };

      const result = await registerStudent(payload);
      
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      onSuccess(result.student);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please check your details.');
      if (err.student) {
        setExistingStudent(err.student);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-section" className="max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSTANT FREE CONFIRMATION</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Reserve Your Free Seat
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">
          Join 347+ final-year engineering peers. Complete in under 45 seconds.
        </p>

        {formData.ref_code && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Tag className="w-3.5 h-3.5" />
            <span>Invited with referral code: <strong className="font-mono text-white">{formData.ref_code}</strong></span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-white">{error}</p>
            {existingStudent && (
              <button
                type="button"
                onClick={() => onSuccess(existingStudent)}
                className="mt-2 text-indigo-400 underline font-medium hover:text-indigo-300 block"
              >
                Click here to view your existing student dashboard & referral code →
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address <span className="text-indigo-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahul@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* WhatsApp Phone & Graduation Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              WhatsApp Number <span className="text-indigo-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Used for workshop link & reminder only</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Graduation Year <span className="text-indigo-400">*</span>
            </label>
            <select
              name="graduation_year"
              required
              value={formData.graduation_year}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="2027">2027 (Final Year)</option>
              <option value="2026">2026 (Recent Graduate)</option>
              <option value="2025">2025 (Graduated)</option>
            </select>
          </div>
        </div>

        {/* College & Branch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              College Name <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              name="college"
              required
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. Vellore Institute of Technology"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Branch / Major <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              name="branch"
              required
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science & Engg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Skill Level & Preferred Tech */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Current Skill Level <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              name="skill_level"
              value={formData.skill_level}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner (Know basic syntax)</option>
              <option value="Intermediate">Intermediate (Built simple projects)</option>
              <option value="Advanced">Advanced (Familiar with APIs)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Preferred Technology <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              name="preferred_technology"
              value={formData.preferred_technology}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Python">Python (Recommended for AI)</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript / TypeScript</option>
              <option value="C/C++">C/C++</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Source & Referral Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              How did you hear about this?
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Friend/Referral">Friend / Peer Referral</option>
              <option value="WhatsApp">WhatsApp Community / Group</option>
              <option value="College Club">College Coding Club / Senior</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Email">Email</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="ref_code"
              value={formData.ref_code}
              onChange={handleChange}
              placeholder="e.g. NXT-A7K92"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm uppercase font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Privacy Checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              name="leaderboard_visible"
              checked={formData.leaderboard_visible}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0"
            />
            <span>Show my first name and college on the public growth leaderboard</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Confirming Your Seat...</span>
            </>
          ) : (
            <>
              <span>Confirm My Free Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Your contact info is private and never exposed publicly. No spam guaranteed.</span>
        </div>
      </form>
    </div>
  );
};
