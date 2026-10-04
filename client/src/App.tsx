import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StudentPainPoints } from './components/StudentPainPoints';
import { WhatYouWillBuild } from './components/WhatYouWillBuild';
import { WhyAttend } from './components/WhyAttend';
import { GrowthLoopExplainer } from './components/GrowthLoopExplainer';
import { RegistrationForm } from './components/RegistrationForm';
import { StudentDashboard } from './components/StudentDashboard';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentLookupModal } from './components/StudentLookupModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { Campaign, Student } from './types';
import { fetchCampaign, fetchStudentByCode } from './services/api';

export function App() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStudentLookupOpen, setIsStudentLookupOpen] = useState(false);
  const [refCodeFromUrl, setRefCodeFromUrl] = useState<string | null>(null);

  useEffect(() => {
    // Initial load of campaign metadata
    refreshCampaign();

    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const code = params.get('code');
    const viewParam = params.get('view');

    if (ref) {
      setRefCodeFromUrl(ref);
    }

    if (viewParam === 'admin' || window.location.pathname === '/admin') {
      setIsAdminOpen(true);
    }

    // Auto-restore student from query code or localStorage
    const savedCode = code || localStorage.getItem('nxt_student_code');
    if (savedCode) {
      fetchStudentByCode(savedCode)
        .then(res => {
          if (res.student) {
            setCurrentStudent(res.student);
            if (code || viewParam === 'dashboard') {
              setView('dashboard');
            }
          }
        })
        .catch(() => {
          localStorage.removeItem('nxt_student_code');
        });
    }
  }, []);

  const refreshCampaign = async () => {
    try {
      const res = await fetchCampaign();
      setCampaign(res.campaign);
    } catch (err) {
      console.error('Failed to load campaign:', err);
    }
  };

  const handleRegistrationSuccess = (student: Student) => {
    setCurrentStudent(student);
    localStorage.setItem('nxt_student_code', student.referral_code);
    setView('dashboard');
    refreshCampaign();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRegister = () => {
    if (view === 'dashboard') {
      setView('landing');
      setTimeout(() => {
        const el = document.getElementById('register-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('register-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToGrowthLoop = () => {
    if (view === 'dashboard') setView('landing');
    setTimeout(() => {
      const el = document.getElementById('growth-loop');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleScrollToProject = () => {
    if (view === 'dashboard') setView('landing');
    setTimeout(() => {
      const el = document.getElementById('project-preview');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        campaign={campaign}
        onOpenRegister={handleOpenRegister}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenStudentLookup={() => setIsStudentLookupOpen(true)}
        currentStudentCode={currentStudent?.referral_code}
        onGoToDashboard={() => setView('dashboard')}
      />

      {/* Main Body */}
      <main className="flex-1">
        {view === 'dashboard' && currentStudent ? (
          <StudentDashboard
            initialStudent={currentStudent}
            onBackToHome={() => setView('landing')}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              campaign={campaign}
              onOpenRegister={handleOpenRegister}
              onScrollToGrowthLoop={handleScrollToGrowthLoop}
              onScrollToProject={handleScrollToProject}
            />

            {/* Final-Year Student Pain Points */}
            <StudentPainPoints />

            {/* Interactive Project Preview */}
            <WhatYouWillBuild />

            {/* 3 Pillars & Target Audience */}
            <WhyAttend />

            {/* Visual 5-Step Viral Growth Loop */}
            <GrowthLoopExplainer />

            {/* Registration Form */}
            <section className="py-16 md:py-24 bg-slate-950 px-4 sm:px-6 lg:px-8 relative">
              <RegistrationForm
                onSuccess={handleRegistrationSuccess}
                initialRefCode={refCodeFromUrl}
              />
            </section>

            {/* Frequently Asked Questions */}
            <FAQSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <StudentLookupModal
        isOpen={isStudentLookupOpen}
        onClose={() => setIsStudentLookupOpen(false)}
        onStudentFound={(student) => {
          setCurrentStudent(student);
          localStorage.setItem('nxt_student_code', student.referral_code);
          setView('dashboard');
        }}
      />

      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
