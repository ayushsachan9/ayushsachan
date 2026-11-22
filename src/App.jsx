import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import SyncSpaceSpotlight from './components/SyncSpaceSpotlight';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ExamTracker from './components/ExamTracker';
import DailyStudyHub from './components/DailyStudyHub';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const normalizedPath = currentPath.replace(/\/$/, '');
  const isExamPage = normalizedPath === '/exam';
  const isDailyPage = normalizedPath === '/daily';

  if (isExamPage) {
    return (
      <ExamTracker
        onNavigateHome={() => navigate('/')}
        onNavigateDaily={() => navigate('/daily')}
      />
    );
  }

  if (isDailyPage) {
    return (
      <DailyStudyHub
        onNavigateHome={() => navigate('/')}
        onNavigateExam={() => navigate('/exam')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
      <Navbar onNavigate={navigate} />
      <main>
        <Hero />
        <About />
        <SyncSpaceSpotlight />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
