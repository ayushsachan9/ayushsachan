import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ExternalLink,
  ArrowLeft,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  BookOpen,
  LayoutGrid,
  Table as TableIcon,
  Check,
  Share2,
  Flame,
  CheckSquare,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { examMeta, subjectsData, flatUnitsList, milestoneColumns, dateColumns } from '../data/examData';
import AuthGateModal, { AuthStatusBadge } from './AuthGateModal';
import { isEditorAuthenticated, logoutEditor } from '../utils/auth';

const STORAGE_KEY = 'ayush_sem5_exam_matrix_v2';
const LEGACY_STORAGE_KEY = 'ayush_sem5_exam_progress_v1';

export default function ExamTracker({ onNavigateHome, onNavigateDaily }) {
  // Auth State
  const [isEditor, setIsEditor] = useState(() => isEditorAuthenticated());
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 1. Persistent Matrix State
  const [matrixData, setMatrixData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);

      // Migrate from v1 if present
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      const initial = {};
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        flatUnitsList.forEach((u) => {
          if (parsedLegacy[u.id]) {
            initial[u.id] = { complete: true, studied: true, rev1: false, rev2: false, dates: {} };
          }
        });
      }
      return initial;
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matrixData));
    } catch (e) {
      console.error('Failed to save matrix to localStorage', e);
    }
  }, [matrixData]);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [columnFilter, setColumnFilter] = useState('all'); // 'all' | 'milestones' | 'dates'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [collapsedSubjects, setCollapsedSubjects] = useState({});

  // Countdown timer to Dec 4, 2026
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(examMeta.examStartDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Guard function for editing
  const guardEdit = () => {
    if (!isEditor) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // Toggles
  const toggleMilestone = (unitId, key) => {
    if (!guardEdit()) return;
    setMatrixData((prev) => {
      const current = prev[unitId] || { complete: false, studied: false, rev1: false, rev2: false, dates: {} };
      const nextVal = !current[key];
      const updatedUnit = {
        ...current,
        [key]: nextVal,
      };

      // If marking complete, also mark studied as true for natural workflow
      if (key === 'complete' && nextVal && !current.studied) {
        updatedUnit.studied = true;
      }

      return {
        ...prev,
        [unitId]: updatedUnit,
      };
    });
  };

  const toggleDate = (unitId, dateKey) => {
    if (!guardEdit()) return;
    setMatrixData((prev) => {
      const current = prev[unitId] || { complete: false, studied: false, rev1: false, rev2: false, dates: {} };
      const currentDates = current.dates || {};
      const nextVal = !currentDates[dateKey];

      return {
        ...prev,
        [unitId]: {
          ...current,
          dates: {
            ...currentDates,
            [dateKey]: nextVal,
          },
        },
      };
    });
  };

  // Toggle all units in a subject for a given milestone
  const toggleSubjectMilestone = (subjectId, milestoneKey, setAllTo) => {
    if (!guardEdit()) return;
    const subject = subjectsData.find((s) => s.id === subjectId);
    if (!subject) return;

    setMatrixData((prev) => {
      const next = { ...prev };
      subject.units.forEach((u) => {
        const current = next[u.id] || { complete: false, studied: false, rev1: false, rev2: false, dates: {} };
        next[u.id] = {
          ...current,
          [milestoneKey]: setAllTo,
        };
      });
      return next;
    });
  };

  // Reset all
  const resetAllProgress = () => {
    if (!guardEdit()) return;
    setMatrixData({});
    setShowResetConfirm(false);
  };

  // Copy shareable summary
  const copySummary = () => {
    const completed = flatUnitsList.filter((u) => matrixData[u.id]?.complete).length;
    const studied = flatUnitsList.filter((u) => matrixData[u.id]?.studied).length;
    const rev1 = flatUnitsList.filter((u) => matrixData[u.id]?.rev1).length;
    const text = `Ayush Sachan's Sem 5 Study Tracker: ${completed}/30 Completed (${Math.round((completed / 30) * 100)}%) | ${studied}/30 Studied | ${rev1}/30 Rev 1. Target Exam: Dec 4, 2026. https://ayushsachan.in/exam`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Global counts
  const totalUnits = examMeta.totalUnits;
  const completedCount = useMemo(() => {
    return flatUnitsList.filter((u) => matrixData[u.id]?.complete).length;
  }, [matrixData]);

  const studiedCount = useMemo(() => {
    return flatUnitsList.filter((u) => matrixData[u.id]?.studied).length;
  }, [matrixData]);

  const rev1Count = useMemo(() => {
    return flatUnitsList.filter((u) => matrixData[u.id]?.rev1).length;
  }, [matrixData]);

  const rev2Count = useMemo(() => {
    return flatUnitsList.filter((u) => matrixData[u.id]?.rev2).length;
  }, [matrixData]);

  const todayCount = useMemo(() => {
    return flatUnitsList.filter((u) => matrixData[u.id]?.dates?.['23/11']).length;
  }, [matrixData]);

  const progressPercentage = Math.round((completedCount / totalUnits) * 100);

  // Filtered units
  const filteredList = useMemo(() => {
    return flatUnitsList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.subjectCode.toLowerCase().includes(q) ||
        item.subjectTitle.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.topics.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubject]);

  const filteredBySubject = useMemo(() => {
    const groups = [];
    subjectsData.forEach((sub) => {
      if (selectedSubject !== 'all' && sub.id !== selectedSubject) return;

      const unitsInSub = filteredList.filter((item) => item.subjectId === sub.id);
      if (unitsInSub.length > 0) {
        groups.push({
          subject: sub,
          units: unitsInSub,
        });
      }
    });
    return groups;
  }, [filteredList, selectedSubject]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-md hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700"
              title="Return to Portfolio Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </button>
            <div className="h-4 w-[1px] bg-neutral-800" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-tight text-sm sm:text-base">
                ayushsachan.in
              </span>
              <span className="text-neutral-500 text-xs">/</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                exam
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <AuthStatusBadge
              isEditor={isEditor}
              onOpenLogin={() => setShowAuthModal(true)}
              onLogout={() => {
                logoutEditor();
                setIsEditor(false);
              }}
              onChangePinClick={() => setShowAuthModal(true)}
            />

            <button
              onClick={onNavigateDaily}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono font-medium px-2.5 py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
              title="Open Daily Study & Pomodoro Hub"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Daily Hub (/daily)</span>
              <span className="sm:hidden">Daily</span>
            </button>

            <button
              onClick={copySummary}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
              title="Copy study summary"
            >
              {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-neutral-400" />}
              <span className="hidden md:inline">{copiedNotification ? 'Copied!' : 'Share Progress'}</span>
            </button>

            <a
              href={examMeta.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
            >
              <span>Live Google Sheet</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800 p-6 sm:p-8 mb-8">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-neutral-800 text-neutral-300 border border-neutral-700 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>AKTU • Semester 5 • ECE Revision Matrix</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {examMeta.title}
              </h1>
              <p className="text-neutral-400 text-sm mt-1 max-w-xl">
                Daily revision matrix & milestone tracker for Electronics & Communication Engineering.
                Track <span className="text-neutral-200">Studied</span>, <span className="text-neutral-200">Rev 1</span>, <span className="text-neutral-200">Rev 2</span>, and <span className="text-emerald-400">Complete</span> across every single date leading up to the exam.
              </p>
              <div className="mt-3 text-xs text-neutral-400 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Synced with Google Sheet Structure
                </span>
                <span>•</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Today: 23 Nov 2026 ({todayCount} units reviewed today)
                </span>
              </div>
            </div>

            {/* Countdown Widget */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col justify-center min-w-[280px]">
              <div className="flex items-center justify-between gap-3 text-xs text-neutral-400 mb-3 pb-2 border-b border-neutral-800">
                <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Exams Start: 4 Dec 2026
                </span>
                <span className="text-[11px] text-amber-400 font-mono font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
                  {timeLeft.days}d {timeLeft.hours}h left
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg py-2 px-1">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Days</div>
                </div>
                <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg py-2 px-1">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Hours</div>
                </div>
                <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg py-2 px-1">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Mins</div>
                </div>
                <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg py-2 px-1">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Secs</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Multi-Milestone Stat Pills */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3">
              <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
                <span>Completed / Revised</span>
                <span className="font-mono text-emerald-400 font-bold">{progressPercentage}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {completedCount} <span className="text-xs text-neutral-500 font-normal">/ {totalUnits}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3">
              <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
                <span>Studied (1st Pass)</span>
                <span className="font-mono text-sky-400 font-bold">{Math.round((studiedCount / totalUnits) * 100)}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {studiedCount} <span className="text-xs text-neutral-500 font-normal">/ {totalUnits}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-sky-400 transition-all duration-300" style={{ width: `${(studiedCount / totalUnits) * 100}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3">
              <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
                <span>Revision 1 (REV1)</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round((rev1Count / totalUnits) * 100)}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {rev1Count} <span className="text-xs text-neutral-500 font-normal">/ {totalUnits}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${(rev1Count / totalUnits) * 100}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3">
              <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
                <span>Revision 2 (REV2)</span>
                <span className="font-mono text-purple-400 font-bold">{Math.round((rev2Count / totalUnits) * 100)}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {rev2Count} <span className="text-xs text-neutral-500 font-normal">/ {totalUnits}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-purple-400 transition-all duration-300" style={{ width: `${(rev2Count / totalUnits) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, units, devices (e.g. 8085, Op-Amp, FFT, Czochralski, Laser)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters & View Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Column Visibility Filter */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setColumnFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  columnFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
                title="Show all Milestones and Date columns"
              >
                All Columns
              </button>
              <button
                onClick={() => setColumnFilter('milestones')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  columnFilter === 'milestones' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
                title="Show only Complete, Studied, Rev 1, Rev 2"
              >
                Milestones Only
              </button>
              <button
                onClick={() => setColumnFilter('dates')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  columnFilter === 'dates' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
                title="Show daily study schedule columns"
              >
                Daily Dates
              </button>
            </div>

            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-neutral-600"
            >
              <option value="all">All Subjects (6)</option>
              {subjectsData.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.title}
                </option>
              ))}
            </select>

            {/* View Switcher */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sheet Matrix</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>

            {/* Reset Progress */}
            <div className="relative">
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-900/50 rounded-lg bg-neutral-950 transition-colors"
                  title="Reset all checkboxes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-rose-950/40 border border-rose-800/80 rounded-lg p-1 text-xs">
                  <span className="text-[11px] text-rose-300 px-1">Reset?</span>
                  <button
                    onClick={resetAllProgress}
                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium text-[11px]"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px]"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 1. TABLE MATRIX VIEW (Faithful to the Google Sheet with sticky headers) */}
        {viewMode === 'table' && (
          <div className="space-y-6">
            {filteredBySubject.map(({ subject, units }) => {
              const isCollapsed = collapsedSubjects[subject.id];
              const subjectDone = units.filter((u) => matrixData[u.id]?.complete).length;
              const isAllDone = subjectDone === units.length;

              return (
                <div
                  key={subject.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/80 overflow-hidden shadow-sm"
                >
                  {/* Subject Header */}
                  <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold border ${subject.badgeBg}`}>
                        {subject.code}
                      </span>
                      <h2 className="text-sm sm:text-base font-semibold text-white">
                        {subject.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-400">
                        {subjectDone} / {units.length} Units Done
                      </span>

                      <button
                        onClick={() => toggleSubjectMilestone(subject.id, 'complete', !isAllDone)}
                        className="text-xs px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
                      >
                        {isAllDone ? 'Uncheck All' : 'Mark Subject Complete'}
                      </button>

                      <button
                        onClick={() =>
                          setCollapsedSubjects((prev) => ({
                            ...prev,
                            [subject.id]: !prev[subject.id],
                          }))
                        }
                        className="p-1 text-neutral-400 hover:text-white"
                        aria-label="Toggle accordion"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Matrix Table */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800/80 bg-neutral-900/40 text-neutral-400 font-mono text-[11px]">
                            <th className="py-2.5 px-3 min-w-[75px] sticky left-0 bg-neutral-900 z-10">Unit</th>
                            <th className="py-2.5 px-3 min-w-[260px] max-w-[340px]">Topics Covered</th>

                            {/* Milestones Header */}
                            {(columnFilter === 'all' || columnFilter === 'milestones') && (
                              <>
                                <th className="py-2.5 px-2 text-center min-w-[65px] bg-emerald-950/20 text-emerald-300 font-semibold border-l border-neutral-800">
                                  Complete
                                </th>
                                <th className="py-2.5 px-2 text-center min-w-[65px] bg-sky-950/20 text-sky-300 font-semibold border-l border-neutral-800">
                                  Studied
                                </th>
                                <th className="py-2.5 px-2 text-center min-w-[60px] bg-amber-950/20 text-amber-300 font-semibold border-l border-neutral-800">
                                  REV 1
                                </th>
                                <th className="py-2.5 px-2 text-center min-w-[60px] bg-purple-950/20 text-purple-300 font-semibold border-l border-neutral-800">
                                  REV 2
                                </th>
                              </>
                            )}

                            {/* Daily Dates Header */}
                            {(columnFilter === 'all' || columnFilter === 'dates') && (
                              <>
                                {dateColumns.map((col) => (
                                  <th
                                    key={col.key}
                                    className={`py-2.5 px-1.5 text-center min-w-[50px] border-l border-neutral-850 ${
                                      col.isToday ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-neutral-400'
                                    }`}
                                  >
                                    <div className="text-[10px]">{col.key}</div>
                                    {col.isToday && <span className="text-[9px] text-amber-400 uppercase font-mono block">Today</span>}
                                  </th>
                                ))}
                              </>
                            )}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-850/60 font-mono">
                          {units.map((unit) => {
                            const unitState = matrixData[unit.id] || { complete: false, studied: false, rev1: false, rev2: false, dates: {} };
                            const isComplete = !!unitState.complete;

                            return (
                              <tr
                                key={unit.id}
                                className={`transition-colors ${
                                  isComplete
                                    ? 'bg-emerald-950/15 hover:bg-emerald-950/25'
                                    : 'hover:bg-neutral-900/50'
                                }`}
                              >
                                {/* Unit Badge */}
                                <td className="py-2.5 px-3 sticky left-0 bg-neutral-950 z-10 whitespace-nowrap">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                                      isComplete
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-neutral-850 text-neutral-300 border-neutral-700'
                                    }`}
                                  >
                                    {unit.unit}
                                  </span>
                                </td>

                                {/* Topics */}
                                <td className="py-2.5 px-3 font-sans">
                                  <div className={`leading-relaxed text-xs ${isComplete ? 'text-neutral-400 line-through' : 'text-neutral-200'}`}>
                                    {unit.topics}
                                  </div>
                                </td>

                                {/* Milestones */}
                                {(columnFilter === 'all' || columnFilter === 'milestones') && (
                                  <>
                                    {/* Complete Checkbox */}
                                    <td className="py-2.5 px-2 text-center border-l border-neutral-850/80 bg-emerald-950/10">
                                      <button
                                        onClick={() => toggleMilestone(unit.id, 'complete')}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                                          unitState.complete
                                            ? 'bg-emerald-500 border-emerald-500 text-black'
                                            : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500 text-transparent'
                                        }`}
                                        title="Complete / Revised"
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </button>
                                    </td>

                                    {/* Studied Checkbox */}
                                    <td className="py-2.5 px-2 text-center border-l border-neutral-850/80 bg-sky-950/10">
                                      <button
                                        onClick={() => toggleMilestone(unit.id, 'studied')}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                                          unitState.studied
                                            ? 'bg-sky-500 border-sky-500 text-black'
                                            : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500 text-transparent'
                                        }`}
                                        title="Studied 1st Pass"
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </button>
                                    </td>

                                    {/* Rev 1 Checkbox */}
                                    <td className="py-2.5 px-2 text-center border-l border-neutral-850/80 bg-amber-950/10">
                                      <button
                                        onClick={() => toggleMilestone(unit.id, 'rev1')}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                                          unitState.rev1
                                            ? 'bg-amber-400 border-amber-400 text-black'
                                            : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500 text-transparent'
                                        }`}
                                        title="Revision 1"
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </button>
                                    </td>

                                    {/* Rev 2 Checkbox */}
                                    <td className="py-2.5 px-2 text-center border-l border-neutral-850/80 bg-purple-950/10">
                                      <button
                                        onClick={() => toggleMilestone(unit.id, 'rev2')}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                                          unitState.rev2
                                            ? 'bg-purple-400 border-purple-400 text-black'
                                            : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500 text-transparent'
                                        }`}
                                        title="Revision 2"
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </button>
                                    </td>
                                  </>
                                )}

                                {/* Daily Dates */}
                                {(columnFilter === 'all' || columnFilter === 'dates') && (
                                  <>
                                    {dateColumns.map((col) => {
                                      const isDateChecked = !!unitState.dates?.[col.key];

                                      return (
                                        <td
                                          key={col.key}
                                          className={`py-2 px-1 text-center border-l border-neutral-850/60 ${
                                            col.isToday ? 'bg-amber-500/5' : ''
                                          }`}
                                        >
                                          <button
                                            onClick={() => toggleDate(unit.id, col.key)}
                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors mx-auto ${
                                              isDateChecked
                                                ? col.isToday
                                                  ? 'bg-amber-400 border-amber-400 text-black'
                                                  : 'bg-neutral-300 border-neutral-300 text-black'
                                                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-600 text-transparent'
                                            }`}
                                            title={`Studied on ${col.label} (${col.key})`}
                                          >
                                            <Check className="w-3 h-3 stroke-[3]" />
                                          </button>
                                        </td>
                                      );
                                    })}
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 2. CARDS VIEW (Focused Subject Cards with Milestones & Daily Tracker) */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBySubject.map(({ subject, units }) => {
              const subjectDone = units.filter((u) => matrixData[u.id]?.complete).length;
              const isAllDone = subjectDone === units.length;

              return (
                <div
                  key={subject.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold border ${subject.badgeBg}`}>
                          {subject.code}
                        </span>
                        <h2 className="text-base font-semibold text-white mt-1.5">
                          {subject.title}
                        </h2>
                      </div>
                      <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {subjectDone}/{units.length} Complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden mb-4 border border-neutral-800">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${(subjectDone / units.length) * 100}%` }}
                      />
                    </div>

                    {/* Units list */}
                    <div className="space-y-3">
                      {units.map((unit) => {
                        const unitState = matrixData[unit.id] || { complete: false, studied: false, rev1: false, rev2: false, dates: {} };
                        const isComplete = !!unitState.complete;

                        return (
                          <div
                            key={unit.id}
                            className={`p-3 rounded-lg border transition-all ${
                              isComplete
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-400'
                                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-mono font-bold text-neutral-300">
                                {unit.unit}
                              </span>
                              {isComplete && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  Done
                                </span>
                              )}
                            </div>

                            <p className={`text-xs leading-relaxed mb-3 ${isComplete ? 'line-through text-neutral-400' : 'text-neutral-300'}`}>
                              {unit.topics}
                            </p>

                            {/* Milestone Badges */}
                            <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-neutral-850/80 text-[11px] font-mono">
                              <button
                                onClick={() => toggleMilestone(unit.id, 'complete')}
                                className={`px-2 py-1 rounded border flex items-center justify-center gap-1 transition-colors ${
                                  unitState.complete
                                    ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                                }`}
                              >
                                {unitState.complete && <Check className="w-3 h-3" />}
                                <span>Complete</span>
                              </button>

                              <button
                                onClick={() => toggleMilestone(unit.id, 'studied')}
                                className={`px-2 py-1 rounded border flex items-center justify-center gap-1 transition-colors ${
                                  unitState.studied
                                    ? 'bg-sky-500 text-black border-sky-500 font-bold'
                                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                                }`}
                              >
                                {unitState.studied && <Check className="w-3 h-3" />}
                                <span>Studied</span>
                              </button>

                              <button
                                onClick={() => toggleMilestone(unit.id, 'rev1')}
                                className={`px-2 py-1 rounded border flex items-center justify-center gap-1 transition-colors ${
                                  unitState.rev1
                                    ? 'bg-amber-400 text-black border-amber-400 font-bold'
                                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                                }`}
                              >
                                {unitState.rev1 && <Check className="w-3 h-3" />}
                                <span>Rev 1</span>
                              </button>

                              <button
                                onClick={() => toggleMilestone(unit.id, 'rev2')}
                                className={`px-2 py-1 rounded border flex items-center justify-center gap-1 transition-colors ${
                                  unitState.rev2
                                    ? 'bg-purple-400 text-black border-purple-400 font-bold'
                                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                                }`}
                              >
                                {unitState.rev2 && <Check className="w-3 h-3" />}
                                <span>Rev 2</span>
                              </button>
                            </div>

                            {/* Today quick toggle */}
                            <div className="mt-2 pt-2 border-t border-neutral-850/60 flex items-center justify-between text-[11px] font-mono">
                              <span className="text-neutral-500">23 Nov Study Status:</span>
                              <button
                                onClick={() => toggleDate(unit.id, '23/11')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                  unitState.dates?.['23/11']
                                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                    : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                                }`}
                              >
                                {unitState.dates?.['23/11'] ? '✓ Reviewed Today (23/11)' : '+ Mark for Today'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleSubjectMilestone(subject.id, 'complete', !isAllDone)}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {isAllDone ? 'Uncheck all units' : 'Mark all 5 units complete'}
                    </button>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {Math.round((subjectDone / units.length) * 100)}% Complete
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info note */}
        <div className="mt-12 pt-6 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-neutral-400 font-medium">Ayush Sachan</span> • AKTU 5th Sem ECE Revision & Study Matrix
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="text-neutral-400 hover:text-white underline underline-offset-4"
            >
              Go to Portfolio Home
            </button>
            <a
              href={examMeta.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white flex items-center gap-1"
            >
              Google Sheet <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>

      <AuthGateModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => setIsEditor(true)}
      />
    </div>
  );
}
