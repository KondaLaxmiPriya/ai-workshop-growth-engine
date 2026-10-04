import React, { useState } from 'react';
import { Terminal, CheckCircle2, Cpu, Code2, Play, Sparkles, Layers } from 'lucide-react';

export const WhatYouWillBuild: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'architecture'>('preview');

  return (
    <section id="project-preview" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>PRACTICAL HANDS-ON DELIVERABLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            What You'll Build in 60 Minutes
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Not a toy script or hello-world tutorial. You will build, run, and customize a working{' '}
            <strong className="text-indigo-400 font-semibold">AI Resume Analyzer & ATS Interview Prep Agent</strong>.
          </p>
        </div>

        {/* Project Showcase Container */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-xs font-mono text-slate-400 ml-2">ai-resume-agent.py • Python 3.11</span>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                App Interface
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Code Snippet
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'architecture' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Architecture
              </button>
            </div>
          </div>

          {/* Interactive Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Smart ATS Score & Keyword Gap Analyzer</h4>
                      <p className="text-xs text-slate-400">Extracts skills, matches job descriptions, and writes tailored improvements</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Match: 87%
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Status: Ready to Deploy
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Feature 1</span>
                    <h5 className="text-sm font-bold text-white mb-1">Resume PDF Ingestion</h5>
                    <p className="text-xs text-slate-400">Parses raw text and projects from PDF resumes cleanly using PyPDF.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Feature 2</span>
                    <h5 className="text-sm font-bold text-white mb-1">LLM Prompt Engine</h5>
                    <p className="text-xs text-slate-400">Uses structured JSON outputs from Gemini / OpenAI API to evaluate experience.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Feature 3</span>
                    <h5 className="text-sm font-bold text-white mb-1">Interview Prep Generator</h5>
                    <p className="text-xs text-slate-400">Generates 5 tailored technical interview questions based on the candidate's exact code.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
                <span className="text-slate-500"># workshop_project.py - Built live in 60 mins</span><br/>
                <span className="text-indigo-400">import</span> streamlit <span className="text-indigo-400">as</span> st<br/>
                <span className="text-indigo-400">from</span> google.genai <span className="text-indigo-400">import</span> types<br/>
                <br/>
                <span className="text-violet-400">def</span> <span className="text-amber-300">analyze_resume</span>(resume_text, job_desc):<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;prompt = f"""Compare this resume against the role and identify top 3 skill gaps: <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;Resume: {"{resume_text}"} <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;Target: {"{job_desc}"}"""<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;response = client.models.generate_content(model=<span className="text-emerald-400">"gemini-2.5-flash"</span>, contents=prompt)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-indigo-400">return</span> response.text<br/>
                <br/>
                st.title(<span className="text-emerald-400">"🚀 AI Resume & ATS Placement Prep Agent"</span>)<br/>
                uploaded = st.file_uploader(<span className="text-emerald-400">"Upload PDF"</span>, type=[<span className="text-emerald-400">"pdf"</span>])
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-semibold">
                  <div className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white">
                    📄 Resume PDF & Job Desc
                  </div>
                  <span className="text-slate-500">➔</span>
                  <div className="px-4 py-3 rounded-lg bg-indigo-950/80 border border-indigo-700 text-indigo-300">
                    ⚡ LLM Parsing & Embedding
                  </div>
                  <span className="text-slate-500">➔</span>
                  <div className="px-4 py-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300">
                    🎯 ATS Score & Interview Simulator
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-5">
                  You walk away with full source code, local setup scripts, and a deployed link to put directly on your resume.
                </p>
              </div>
            )}

            {/* Checklist of what you leave with */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Working GitHub repository with clean README</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live demo link to add to your LinkedIn and resume</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Understanding of modern GenAI API architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Placement interview talking points and explanations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
