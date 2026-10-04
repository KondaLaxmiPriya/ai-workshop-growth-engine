import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is this workshop really 100% free?",
      a: "Yes, completely free. There are no hidden fees, paywalls, or credit card requirements. The goal is to give 500 final-year engineering students practical AI exposure."
    },
    {
      q: "What are the prerequisites? Do I need prior AI/ML knowledge?",
      a: "No prior AI or machine learning experience is required. If you know basic programming constructs (variables, loops, functions in Python, C, Java, or JavaScript), you will be able to follow along and build the project."
    },
    {
      q: "Can I showcase this project on my resume for campus placements?",
      a: "Yes! That is the core design objective. You will write and deploy a real working application with an interactive interface, push the code to your GitHub, and receive talking points to explain the architecture during technical interviews."
    },
    {
      q: "How does the referral challenge work?",
      a: "After you complete your free registration, our system generates a unique referral link and code (e.g. NXT-A7K92). When your college friends or classmates register through your link, your referral count increases and milestone badges unlock on the leaderboard."
    },
    {
      q: "What tech stack will we use during the 60 minutes?",
      a: "We will use Python 3, modern Generative AI LLM APIs, and Streamlit for rapid web interface deployment. All code templates are provided."
    },
    {
      q: "What if I cannot attend the live session time?",
      a: "Only registered students will receive access to the live code repository, architecture diagrams, and follow-up AI starter packs. We strongly recommend attending live to get real-time debugging support."
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Clear, honest answers so you can register with confidence.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm sm:text-base hover:text-indigo-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
