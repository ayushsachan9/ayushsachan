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
  Award,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Share2,
  Check
} from 'lucide-react';
import { examMeta, subjectsData, flatUnitsList } from '../data/examData';

const STORAGE_KEY = 'ayush_sem5_exam_progress_v1';

export default function ExamTracker({ onNavigateHome }) {
  // 1. Persistent Checkbox State
  const [checkedUnits, setCheckedUnits] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage whenever checkedUnits changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedUnits));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [checkedUnits]);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'todo' | 'done'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Subject accordion collapse state for table/card view
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

  // Toggle single unit
  const toggleUnit = (unitId) => {
    setCheckedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  // Toggle all units for a specific subject
  const toggleSubjectAll = (subjectId, makeAllDone) => {
    const subject = subjectsData.find((s) => s.id === subjectId);
    if (!subject) return;

    setCheckedUnits((prev) => {
      const next = { ...prev };
      subject.units.forEach((u) => {
        next[u.id] = makeAllDone;
      });
      return next;
    });
  };

  // Reset all progress
  const resetAllProgress = () => {
    setCheckedUnits({});
    setShowResetConfirm(false);
  };

  // Copy shareable summary
  const copySummary = () => {
    const doneCount = Object.values(checkedUnits).filter(Boolean).length;
    const text = `Ayush Sachan's Sem 5 Exam Checklist: ${doneCount}/${examMeta.totalUnits} Units Completed (${Math.round((doneCount / examMeta.totalUnits) * 100)}%). Exams start Dec 4, 2026. https://ayushsachan.in/exam`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Global Progress Stats
  const totalUnits = examMeta.totalUnits;
  const completedCount = useMemo(() => {
    return Object.values(checkedUnits).filter(Boolean).length;
  }, [checkedUnits]);

  const progressPercentage = Math.round((completedCount / totalUnits) * 100);

  // Subject Level Stats
  const subjectStats = useMemo(() => {
    return subjectsData.reduce((acc, sub) => {
      const done = sub.units.filter((u) => checkedUnits[u.id]).length;
      acc[sub.id] = {
        done,
        total: sub.units.length,
        percentage: Math.round((done / sub.units.length) * 100),
      };
      return acc;
    }, {});
  }, [checkedUnits]);

  // Filtered Units List
  const filteredList = useMemo(() => {
    return flatUnitsList.filter((item) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.subjectCode.toLowerCase().includes(q) ||
        item.subjectTitle.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.topics.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

      // Subject
      const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;

      // Status
      const isDone = !!checkedUnits[item.id];
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'done' && isDone) ||
        (statusFilter === 'todo' && !isDone);

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [searchQuery, selectedSubject, statusFilter, checkedUnits]);

  // Group filtered units by subject for the table/cards
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

  // Motivational quote based on progress
  const getMotivationalMessage = () => {
    if (progressPercentage === 100) return '🏆 Incredible! 30/30 units completed! You are fully prepared to dominate Sem 5!';
    if (progressPercentage >= 75) return '🔥 Final stretch! Over 75% done. Maintain momentum and wrap up the rest!';
    if (progressPercentage >= 50) return '⚡ Past the halfway mark! Solid consistency, keep this speed!';
    if (progressPercentage >= 25) return '🚀 Great pacing! A quarter conquered, keep stacking up the units!';
    if (progressPercentage > 0) return '💪 Solid start! Every checked unit moves you closer to an exceptional score.';
    return '🎯 Welcome to your Semester 5 Checklist! Mark each unit as you complete it.';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-md hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700"
              title="Return to Ayush Sachan Portfolio"
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
              <span>Google Sheet</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800 p-6 sm:p-8 mb-8">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-neutral-800 text-neutral-300 border border-neutral-700 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>AKTU • 5th Semester • ECE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {examMeta.title}
              </h1>
              <p className="text-neutral-400 text-sm mt-1 max-w-xl">
                Comprehensive unit-by-unit syllabus checklist for Electronics & Communication Engineering.
                Tick each unit as you complete your revision.
              </p>
              <div className="mt-3 text-xs text-neutral-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-saved locally • Updates in real time</span>
              </div>
            </div>

            {/* Countdown Card */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col justify-center min-w-[280px]">
              <div className="flex items-center justify-between gap-3 text-xs text-neutral-400 mb-3 pb-2 border-b border-neutral-800">
                <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Target: 4 Dec 2026
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

          {/* Overall Progress Meter */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Overall Preparation Progress</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {completedCount} / {totalUnits} units done
                </span>
              </div>
              <div className="text-sm font-mono font-bold text-emerald-400">
                {progressPercentage}% Completed
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                style={{ width: `${Math.max(progressPercentage, 0)}%` }}
              />
            </div>

            {/* Motivational message banner */}
            <p className="mt-3 text-xs text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{getMotivationalMessage()}</span>
            </p>
          </div>
        </div>

        {/* Quick Subject Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {subjectsData.map((sub) => {
            const stat = subjectStats[sub.id] || { done: 0, total: 5, percentage: 0 };
            const isSelected = selectedSubject === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(isSelected ? 'all' : sub.id)}
                className={`p-3 rounded-xl text-left border transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-neutral-800 border-neutral-600 shadow-md ring-1 ring-neutral-500'
                    : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {sub.code}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {stat.done}/{stat.total}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 line-clamp-1 mb-2 font-medium">
                  {sub.title}
                </div>
                {/* Mini bar */}
                <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Control Toolbar */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, units (e.g. 8085, Op-Amp, FFT, CMOS, Laser)..."
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

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All ({flatUnitsList.length})
              </button>
              <button
                onClick={() => setStatusFilter('todo')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'todo' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                To Do ({flatUnitsList.length - completedCount})
              </button>
              <button
                onClick={() => setStatusFilter('done')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'done' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Done ({completedCount})
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
                title="Google Sheet / Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sheet View</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
                title="Subject Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards View</span>
              </button>
            </div>

            {/* Reset All Action */}
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
                  <span className="text-[11px] text-rose-300 px-1">Reset all?</span>
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

        {/* Empty state if search yields 0 items */}
        {filteredBySubject.length === 0 && (
          <div className="text-center py-16 border border-neutral-800 rounded-xl bg-neutral-900/40">
            <Filter className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No topics match your filter</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Try adjusting your search query or reset the subject / status filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setStatusFilter('all');
              }}
              className="mt-4 px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md border border-neutral-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 1. TABLE VIEW (Exact format & enhanced version of the Google Sheet) */}
        {viewMode === 'table' && filteredBySubject.length > 0 && (
          <div className="space-y-6">
            {filteredBySubject.map(({ subject, units }) => {
              const stat = subjectStats[subject.id];
              const isAllSubjectDone = stat.done === stat.total;
              const isCollapsed = collapsedSubjects[subject.id];

              return (
                <div
                  key={subject.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/70 overflow-hidden shadow-sm"
                >
                  {/* Subject Header Row */}
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
                      {/* Progress Badge */}
                      <span className="text-xs font-mono text-neutral-400">
                        {stat.done} / {stat.total} Done ({stat.percentage}%)
                      </span>

                      {/* Select/Deselect All Button */}
                      <button
                        onClick={() => toggleSubjectAll(subject.id, !isAllSubjectDone)}
                        className="text-xs px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
                      >
                        {isAllSubjectDone ? 'Uncheck All' : 'Mark Subject Done'}
                      </button>

                      {/* Collapse/Expand Toggle */}
                      <button
                        onClick={() =>
                          setCollapsedSubjects((prev) => ({
                            ...prev,
                            [subject.id]: !prev[subject.id],
                          }))
                        }
                        className="p-1 text-neutral-400 hover:text-white"
                        aria-label="Toggle collapse"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Units Table */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-neutral-800/80 bg-neutral-900/40 text-neutral-400 text-[11px] uppercase tracking-wider font-mono">
                            <th className="py-2.5 px-4 w-24">Unit</th>
                            <th className="py-2.5 px-4">Topics Covered</th>
                            <th className="py-2.5 px-4 w-28 text-center">Status</th>
                            <th className="py-2.5 px-4 w-20 text-center">Done</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-850/60">
                          {units.map((unit) => {
                            const isDone = !!checkedUnits[unit.id];

                            return (
                              <tr
                                key={unit.id}
                                onClick={() => toggleUnit(unit.id)}
                                className={`cursor-pointer transition-colors group ${
                                  isDone
                                    ? 'bg-emerald-950/15 hover:bg-emerald-950/25 text-neutral-400'
                                    : 'hover:bg-neutral-900/60 text-neutral-200'
                                }`}
                              >
                                <td className="py-3 px-4 font-mono font-medium whitespace-nowrap">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs border ${
                                      isDone
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-neutral-850 text-neutral-300 border-neutral-700'
                                    }`}
                                  >
                                    {unit.unit}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <div className={`leading-relaxed ${isDone ? 'line-through text-neutral-400' : 'text-neutral-200'}`}>
                                    {unit.topics}
                                  </div>

                                  {/* Tags */}
                                  {unit.tags && (
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                      {unit.tags.map((t, idx) => (
                                        <span
                                          key={idx}
                                          className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800"
                                        >
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  {isDone ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium font-mono">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Done
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs text-neutral-500 font-mono">
                                      <Circle className="w-3.5 h-3.5" />
                                      Pending
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => toggleUnit(unit.id)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                                      isDone
                                        ? 'bg-emerald-500 border-emerald-500 text-black'
                                        : 'bg-neutral-900 border-neutral-700 group-hover:border-neutral-500 text-transparent'
                                    }`}
                                    aria-label={`Mark ${unit.unit} as ${isDone ? 'incomplete' : 'complete'}`}
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                </td>
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

        {/* 2. CARDS VIEW (Modern Card Layout) */}
        {viewMode === 'cards' && filteredBySubject.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBySubject.map(({ subject, units }) => {
              const stat = subjectStats[subject.id];
              const isAllSubjectDone = stat.done === stat.total;

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
                        {stat.done}/{stat.total} Done
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden mb-4 border border-neutral-800">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>

                    {/* Units list */}
                    <div className="space-y-2.5">
                      {units.map((unit) => {
                        const isDone = !!checkedUnits[unit.id];

                        return (
                          <div
                            key={unit.id}
                            onClick={() => toggleUnit(unit.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isDone
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-400'
                                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleUnit(unit.id);
                                }}
                                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-500 text-black'
                                    : 'bg-neutral-900 border-neutral-700 text-transparent hover:border-neutral-500'
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </button>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono font-semibold text-neutral-300">
                                    {unit.unit}
                                  </span>
                                </div>
                                <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-neutral-400' : 'text-neutral-300'}`}>
                                  {unit.topics}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleSubjectAll(subject.id, !isAllSubjectDone)}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {isAllSubjectDone ? 'Uncheck all units' : 'Mark all 5 units done'}
                    </button>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {stat.percentage}% Complete
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
            <span className="text-neutral-400 font-medium">Ayush Sachan</span> • AKTU 5th Sem ECE
            Checklist (Exams start 4 Dec 2026)
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
    </div>
  );
}
