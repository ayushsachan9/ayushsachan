import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Flame,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  FileText,
  AlertCircle,
  HelpCircle,
  Tag,
  Copy,
  Check,
  Zap,
  ListTodo
} from 'lucide-react';
import { examMeta, subjectsData, flatUnitsList } from '../data/examData';
import { cheatsheetData } from '../data/cheatsheetData';
import AuthGateModal, { AuthStatusBadge } from './AuthGateModal';
import { isEditorAuthenticated, logoutEditor } from '../utils/auth';

const CONFIDENCE_STORAGE_KEY = 'ayush_unit_confidence_v1';
const TODAY_TARGET_KEY = 'ayush_today_targets_2311';
const SCRATCHPAD_KEY = 'ayush_daily_scratchpad_v1';
const POMODORO_COUNT_KEY = 'ayush_pomodoro_count_v1';

export default function DailyStudyHub({ onNavigateHome, onNavigateExam }) {
  // Auth Gate
  const [isEditor, setIsEditor] = useState(() => isEditorAuthenticated());
  const [showAuthModal, setShowAuthModal] = useState(false);

  const guardEdit = () => {
    if (!isEditor) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // 1. Pomodoro Timer State
  const [timerMode, setTimerMode] = useState(25); // 25 or 50 minutes
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeUnitForTimer, setActiveUnitForTimer] = useState('');
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem(POMODORO_COUNT_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });

  // Pomodoro Interval
  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setPomodoroCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(POMODORO_COUNT_KEY, String(next));
        } catch {}
        return next;
      });
      alert('🎉 Study session completed! Take a 5-minute breather.');
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const switchTimerMode = (mins) => {
    setIsRunning(false);
    setTimerMode(mins);
    setSecondsLeft(mins * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(timerMode * 60);
  };

  // 2. Today's Target State
  const [todayTargets, setTodayTargets] = useState(() => {
    try {
      const saved = localStorage.getItem(TODAY_TARGET_KEY);
      return saved ? JSON.parse(saved) : ['bec501-u1', 'bec502-u1', 'bec503-u1'];
    } catch {
      return ['bec501-u1', 'bec502-u1', 'bec503-u1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TODAY_TARGET_KEY, JSON.stringify(todayTargets));
    } catch {}
  }, [todayTargets]);

  // Target Done checklist
  const [todayTargetsDone, setTodayTargetsDone] = useState(() => {
    try {
      const saved = localStorage.getItem('ayush_today_done_2311');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTargetDone = (unitId) => {
    if (!guardEdit()) return;
    setTodayTargetsDone((prev) => {
      const next = { ...prev, [unitId]: !prev[unitId] };
      try {
        localStorage.setItem('ayush_today_done_2311', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addTodayTarget = (unitId) => {
    if (!guardEdit()) return;
    if (!todayTargets.includes(unitId)) {
      setTodayTargets([...todayTargets, unitId]);
    }
  };

  const removeTodayTarget = (unitId) => {
    if (!guardEdit()) return;
    setTodayTargets(todayTargets.filter((id) => id !== unitId));
  };

  // 3. Confidence Rating State: 'easy' | 'medium' | 'hard'
  const [confidenceRatings, setConfidenceRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIDENCE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setRating = (unitId, rating) => {
    if (!guardEdit()) return;
    setConfidenceRatings((prev) => {
      const next = { ...prev, [unitId]: prev[unitId] === rating ? null : rating };
      try {
        localStorage.setItem(CONFIDENCE_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // 4. Scratchpad Notes
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(SCRATCHPAD_KEY) || '';
    } catch {
      return '';
    }
  });

  const handleNotesChange = (e) => {
    if (!guardEdit()) return;
    setNotes(e.target.value);
    try {
      localStorage.setItem(SCRATCHPAD_KEY, e.target.value);
    } catch {}
  };

  // 5. Active Tab for AKTU Cheatsheet
  const [activeCheatsheetSub, setActiveCheatsheetSub] = useState('bec501');
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState(null);

  // Confidence Filter
  const [confidenceFilter, setConfidenceFilter] = useState('all'); // 'all' | 'hard' | 'medium' | 'easy'

  // Format Timer mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Days left to Dec 4
  const daysLeft = useMemo(() => {
    const target = new Date(examMeta.examStartDate).getTime();
    const diff = target - new Date().getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }, []);

  const filteredByConfidence = useMemo(() => {
    if (confidenceFilter === 'all') return flatUnitsList;
    return flatUnitsList.filter((u) => confidenceRatings[u.id] === confidenceFilter);
  }, [confidenceFilter, confidenceRatings]);

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
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                daily
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
            />

            <button
              onClick={onNavigateExam}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
              title="Switch to Full Exam Matrix"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Matrix (/exam)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
              title="Print 1-Page Revision Sheet"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Print PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Daily Command Center Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/90 via-neutral-900/50 to-neutral-950 border border-neutral-800 p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Flame className="w-3.5 h-3.5" />
                  Today: 23 November 2026
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                  ⏳ {daysLeft} Days to Exams
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Daily Study & Revision Engine
              </h1>
              <p className="text-neutral-400 text-sm mt-1 max-w-xl">
                Dedicated daily execution hub with Pomodoro focus sprints, pinned daily targets, priority rating, and high-yield AKTU repeated exam questions.
              </p>
            </div>

            {/* Pomodoro Focus Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between min-w-[300px]">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-neutral-850">
                <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Pomodoro Focus
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {pomodoroCount} Sessions Completed
                </span>
              </div>

              {/* Timer Digit Display */}
              <div className="text-center my-2">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-wider">
                  {formatTime(secondsLeft)}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {isRunning ? '🔥 Focus sprint in progress...' : 'Paused / Ready'}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-colors ${
                    isRunning
                      ? 'bg-amber-500 hover:bg-amber-400 text-black'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Pause' : 'Start Sprint'}</span>
                </button>

                <button
                  onClick={resetTimer}
                  className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-0.5 rounded-lg text-xs font-mono">
                  <button
                    onClick={() => switchTimerMode(25)}
                    className={`px-2 py-1 rounded ${timerMode === 25 ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'}`}
                  >
                    25m
                  </button>
                  <button
                    onClick={() => switchTimerMode(50)}
                    className={`px-2 py-1 rounded ${timerMode === 50 ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'}`}
                  >
                    50m
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Core Layout: Today's Target on Left, Scratchpad & Cheatsheets on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left Column (7 cols): Today's Active Targets & Priority Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pinned Today's Targets Card */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-semibold text-white">
                    Today's Target Units ({todayTargets.filter((id) => todayTargetsDone[id]).length}/{todayTargets.length} Done)
                  </h2>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  Target: 23 Nov
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden mb-4 border border-neutral-800">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{
                    width: `${todayTargets.length > 0 ? (todayTargets.filter((id) => todayTargetsDone[id]).length / todayTargets.length) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Pinned Units List */}
              <div className="space-y-2.5">
                {todayTargets.map((unitId) => {
                  const unit = flatUnitsList.find((u) => u.id === unitId);
                  if (!unit) return null;
                  const isDone = !!todayTargetsDone[unitId];

                  return (
                    <div
                      key={unit.id}
                      className={`p-3 rounded-lg border flex items-start justify-between gap-3 transition-colors ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-400'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleTargetDone(unit.id)}
                        className="flex items-start gap-3 text-left flex-1"
                      >
                        <div
                          className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-black'
                              : 'bg-neutral-900 border-neutral-700 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] px-1.5 py-0.2 rounded font-mono font-bold border ${unit.badgeBg}`}>
                              {unit.subjectCode}
                            </span>
                            <span className="text-xs font-mono font-semibold text-white">
                              {unit.unit}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${isDone ? 'line-through text-neutral-500' : 'text-neutral-300'}`}>
                            {unit.topics}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => removeTodayTarget(unit.id)}
                        className="text-xs text-neutral-500 hover:text-neutral-300 px-1 py-0.5 rounded"
                        title="Remove from today's targets"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add target dropdown */}
              <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Pin another unit to today:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addTodayTarget(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-md px-2 py-1 text-xs"
                >
                  <option value="">+ Add Unit to Today...</option>
                  {flatUnitsList
                    .filter((u) => !todayTargets.includes(u.id))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.subjectCode} - {u.unit}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Confidence & Difficulty Rating Matrix */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-semibold text-white">
                    Unit Difficulty & Priority Ratings
                  </h2>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 p-0.5 rounded-lg text-xs font-mono">
                  <button
                    onClick={() => setConfidenceFilter('all')}
                    className={`px-2 py-1 rounded ${confidenceFilter === 'all' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'}`}
                  >
                    All ({flatUnitsList.length})
                  </button>
                  <button
                    onClick={() => setConfidenceFilter('hard')}
                    className={`px-2 py-1 rounded text-rose-400 ${confidenceFilter === 'hard' ? 'bg-rose-950/60 font-bold' : ''}`}
                  >
                    🔴 Hard ({flatUnitsList.filter((u) => confidenceRatings[u.id] === 'hard').length})
                  </button>
                  <button
                    onClick={() => setConfidenceFilter('medium')}
                    className={`px-2 py-1 rounded text-amber-400 ${confidenceFilter === 'medium' ? 'bg-amber-950/60 font-bold' : ''}`}
                  >
                    🟡 Medium
                  </button>
                  <button
                    onClick={() => setConfidenceFilter('easy')}
                    className={`px-2 py-1 rounded text-emerald-400 ${confidenceFilter === 'easy' ? 'bg-emerald-950/60 font-bold' : ''}`}
                  >
                    🟢 Confident
                  </button>
                </div>
              </div>

              {/* Units table */}
              <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-850/60">
                {filteredByConfidence.map((unit) => {
                  const currentRating = confidenceRatings[unit.id];

                  return (
                    <div key={unit.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-neutral-400 font-bold">{unit.subjectCode}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="font-mono text-neutral-300">{unit.unit}</span>
                        </div>
                        <p className="text-neutral-400 line-clamp-1 text-[11px] mt-0.5">{unit.topics}</p>
                      </div>

                      {/* 3 Rating Buttons */}
                      <div className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
                        <button
                          onClick={() => setRating(unit.id, 'easy')}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            currentRating === 'easy'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                              : 'bg-neutral-950 text-neutral-500 border-neutral-800 hover:text-emerald-400'
                          }`}
                          title="Mark Easy / Confident"
                        >
                          🟢 Easy
                        </button>
                        <button
                          onClick={() => setRating(unit.id, 'medium')}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            currentRating === 'medium'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                              : 'bg-neutral-950 text-neutral-500 border-neutral-800 hover:text-amber-400'
                          }`}
                          title="Mark Medium / Review Needed"
                        >
                          🟡 Med
                        </button>
                        <button
                          onClick={() => setRating(unit.id, 'hard')}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            currentRating === 'hard'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold'
                              : 'bg-neutral-950 text-neutral-500 border-neutral-800 hover:text-rose-400'
                          }`}
                          title="Mark Hard / High Priority"
                        >
                          🔴 Hard
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Scratchpad Notes & Formula/Question Cheatsheets */}
          <div className="lg:col-span-5 space-y-6">
            {/* Daily Scratchpad Card */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-semibold text-white">Daily Notes & Formula Scratchpad</h2>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Auto-saved</span>
              </div>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Jot down quick formulas, derivation steps, doubts to look up, or your daily exam strategy..."
                className="w-full h-36 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 resize-none font-mono leading-relaxed"
              />
            </div>

            {/* High-Yield AKTU Questions & Formulas */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-white">AKTU High-Yield Cheatsheet</h2>
                </div>
                <span className="text-xs font-mono text-neutral-400">Exam Vault</span>
              </div>

              {/* Subject Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-800 text-xs font-mono">
                {Object.keys(cheatsheetData).map((subKey) => {
                  const s = cheatsheetData[subKey];
                  const isActive = activeCheatsheetSub === subKey;
                  return (
                    <button
                      key={subKey}
                      onClick={() => setActiveCheatsheetSub(subKey)}
                      className={`px-2 py-1 rounded whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {s.subjectCode}
                    </button>
                  );
                })}
              </div>

              {/* Active Subject Formulas & Questions */}
              {cheatsheetData[activeCheatsheetSub] && (
                <div className="mt-4 space-y-4 max-h-[380px] overflow-y-auto pr-1 text-xs">
                  {/* Formulas Box */}
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono mb-2">
                      ⚡ Essential Formulas
                    </h3>
                    <div className="space-y-2">
                      {cheatsheetData[activeCheatsheetSub].keyFormulas.map((f, idx) => (
                        <div key={idx} className="bg-neutral-950 border border-neutral-850 rounded-md p-2.5">
                          <div className="text-[11px] font-semibold text-emerald-400">{f.name}</div>
                          <div className="font-mono text-white text-xs mt-1 bg-neutral-900/80 px-2 py-1 rounded">
                            {f.formula}
                          </div>
                          {f.note && <div className="text-[10px] text-neutral-500 mt-1">{f.note}</div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top AKTU Questions */}
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono mb-2">
                      🎯 Top Repeated AKTU Questions
                    </h3>
                    <div className="space-y-2">
                      {cheatsheetData[activeCheatsheetSub].topAKTUQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="bg-neutral-950 border border-neutral-850 rounded-md p-2.5 hover:border-neutral-750 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                            <span className="text-amber-400 font-bold">{q.unit}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(q.q);
                                setCopiedQuestionIdx(idx);
                                setTimeout(() => setCopiedQuestionIdx(null), 2000);
                              }}
                              className="hover:text-white flex items-center gap-1"
                            >
                              {copiedQuestionIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedQuestionIdx === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <p className="text-neutral-200 text-xs leading-relaxed">{q.q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-6 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-neutral-400 font-medium">Ayush Sachan</span> • AKTU 5th Sem ECE Daily Focus & Formula Vault
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="text-neutral-400 hover:text-white underline underline-offset-4"
            >
              Go to Portfolio Home
            </button>
            <button
              onClick={onNavigateExam}
              className="text-neutral-400 hover:text-emerald-400 flex items-center gap-1"
            >
              Open Full Matrix (/exam)
            </button>
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
