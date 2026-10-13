import React, { useState, useEffect } from 'react';
import { 
  Play, 
  BookOpen, 
  Calendar, 
  Bookmark, 
  Clock, 
  Target, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  BarChart2
} from 'lucide-react';
import { UserStudyData, logStudyTimeMinutes, getTodayDateStr } from '../data/storage';
import { PET_SUBJECTS } from '../data/petData';

interface DashboardProps {
  userData: UserStudyData;
  setUserData: React.Dispatch<React.SetStateAction<UserStudyData>>;
  lang: 'en' | 'hi';
  onNavigate: (tab: string) => void;
  isDark: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userData,
  setUserData,
  lang,
  onNavigate,
  isDark,
}) => {
  const todayStr = getTodayDateStr();
  const minutesStudiedToday = userData.dailyStudyMinutes[todayStr] || 0;
  const targetMinutesToday = (userData.dailyTargetHours || 4) * 60;
  const targetCompletionPct = Math.min(100, Math.round((minutesStudiedToday / targetMinutesToday) * 100));

  // Live in-app study session stopwatch
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStopAndLogTimer = () => {
    if (sessionSeconds >= 60) {
      const minutes = Math.floor(sessionSeconds / 60);
      const updatedTotal = logStudyTimeMinutes(minutes);
      setUserData((prev) => ({
        ...prev,
        dailyStudyMinutes: {
          ...prev.dailyStudyMinutes,
          [todayStr]: updatedTotal,
        },
      }));
    }
    setIsTimerRunning(false);
    setSessionSeconds(0);
  };

  // Exam Countdown calculation
  const getExamCountdown = () => {
    const examTime = new Date(userData.examDate || '2026-10-28').getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, examTime - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };
  const countdown = getExamCountdown();

  // Tasks for today
  const todayTasks = userData.tasks.filter((t) => t.plannedDate === todayStr);
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;

  const toggleTask = (taskId: string) => {
    setUserData((prev) => {
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      return { ...prev, tasks: updatedTasks };
    });
  };

  // Real Mock test statistics
  const totalMocks = userData.mockHistory.length;
  const latestMock = totalMocks > 0 ? userData.mockHistory[0] : null;
  const overallAccuracy = totalMocks > 0
    ? Math.round(userData.mockHistory.reduce((acc, m) => acc + m.accuracy, 0) / totalMocks)
    : 0;

  // Real Streak calculation
  const calculateStreak = () => {
    let streak = 0;
    const checkDate = new Date();
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      const mins = userData.dailyStudyMinutes[dStr] || 0;
      if (mins > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (dStr === todayStr && streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  };
  const streak = calculateStreak();

  // Theme style helpers
  const cardBg = isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-white border-zinc-200 shadow-xs';
  const textPrimary = isDark ? 'text-[#F5F5F7]' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-zinc-500';
  const innerCardBg = isDark ? 'bg-[#222227] border-[#2E2E35]' : 'bg-zinc-50 border-zinc-200';

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className={`rounded-2xl p-6 sm:p-8 border transition-all ${cardBg}`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#FF7900]">
                UPSSSC PET MASTER 2026
              </span>
              <span className={`text-xs ${textSecondary}`}>
                · {lang === 'en' ? 'Target: 75+ Raw Score (98.5+ %ile)' : 'लक्ष्य: 75+ रॉ स्कोर'}
              </span>
            </div>
            <h1 className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimary}`}>
              {lang === 'en' ? 'Personal Study Command Center' : 'व्यक्तिगत अध्ययन डैशबोर्ड'}
            </h1>
            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${textSecondary}`}>
              {lang === 'en'
                ? 'Prepare for Uttar Pradesh Group B & C vacancies with authentic NCERT questions, -0.25 negative marking simulator, and personal timetable.'
                : 'लेखपाल, वी.डी.ओ., कनिष्ठ सहायक भर्तियों हेतु 100 प्रश्नों का पूर्ण मॉक टेस्ट, 0.25 निगेटिव मार्किंग और दैनिक समय सारिणी।'}
            </p>
          </div>

          {/* Exam Countdown Box */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 shrink-0 ${innerCardBg}`}>
            <div className="text-center px-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#FF7900] tabular-nums">
                {countdown.days}
              </span>
              <span className={`block text-[11px] font-semibold uppercase tracking-wider ${textSecondary}`}>
                {lang === 'en' ? 'Days Left' : 'दिन शेष'}
              </span>
            </div>
            <div className={`h-10 w-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
            <div className="text-center px-2">
              <span className={`font-display text-2xl font-bold tabular-nums ${textPrimary}`}>
                {countdown.hours}
              </span>
              <span className={`block text-[11px] font-semibold uppercase tracking-wider ${textSecondary}`}>
                {lang === 'en' ? 'Hours' : 'घंटे'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('mock')}
          className={`p-4 rounded-xl border text-left transition-all hover:border-[#FF7900] group ${cardBg}`}
        >
          <div className="w-10 h-10 rounded-lg bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center mb-3 group-hover:bg-[#FF7900] group-hover:text-white transition-colors">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <h3 className={`text-sm font-bold group-hover:text-[#FF7900] transition-colors ${textPrimary}`}>
            {lang === 'en' ? 'Start Mock Test' : 'मॉक टेस्ट शुरू करें'}
          </h3>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>
            {lang === 'en' ? '100 Qs / 120 Mins' : '100 प्रश्न / 120 मिनट'}
          </p>
        </button>

        <button
          onClick={() => onNavigate('questions')}
          className={`p-4 rounded-xl border text-left transition-all hover:border-[#FF7900] group ${cardBg}`}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-bold group-hover:text-blue-400 transition-colors ${textPrimary}`}>
            {lang === 'en' ? 'Question Bank' : 'महत्वपूर्ण प्रश्न बैंक'}
          </h3>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>
            {lang === 'en' ? '115+ Verified MCQs' : '115+ सत्यापित प्रश्न'}
          </p>
        </button>

        <button
          onClick={() => onNavigate('planner')}
          className={`p-4 rounded-xl border text-left transition-all hover:border-[#FF7900] group ${cardBg}`}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-bold group-hover:text-amber-400 transition-colors ${textPrimary}`}>
            {lang === 'en' ? 'Study Planner' : 'स्टडी प्लानर'}
          </h3>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>
            {lang === 'en' ? 'Daily & Weekly Goals' : 'दैनिक अध्ययन रूटीन'}
          </p>
        </button>

        <button
          onClick={() => onNavigate('revision')}
          className={`p-4 rounded-xl border text-left transition-all hover:border-[#FF7900] group ${cardBg}`}
        >
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-colors">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-bold group-hover:text-rose-400 transition-colors ${textPrimary}`}>
            {lang === 'en' ? 'Revision Vault' : 'रिवीजन नोटबुक'}
          </h3>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>
            {userData.mistakeQuestionIds.length} {lang === 'en' ? 'Mistakes to re-try' : 'गलतियां सुधारें'}
          </p>
        </button>
      </div>

      {/* 2-Column Dashboard Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Target & Focus Timer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Daily Study Goal & Live Stopwatch Card */}
          <div className={`p-6 rounded-2xl border space-y-6 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF7900]" />
                <h3 className={`font-display text-base font-bold ${textPrimary}`}>
                  {lang === 'en' ? "Today's Study Progress" : 'आज का अध्ययन लक्ष्य'}
                </h3>
              </div>
              <span className="font-mono text-sm font-bold text-[#FF7900] tabular-nums">
                {Math.floor(minutesStudiedToday / 60)}h {minutesStudiedToday % 60}m / {userData.dailyTargetHours}h
              </span>
            </div>

            {/* Apple-style Progress Bar */}
            <div className="space-y-2">
              <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                <div
                  className="h-full bg-gradient-to-r from-[#FF7900] to-[#FF9F43] rounded-full transition-all duration-500"
                  style={{ width: `${targetCompletionPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className={textSecondary}>
                  {targetCompletionPct}% {lang === 'en' ? 'Completed' : 'पूर्ण'}
                </span>
                <span className={textSecondary}>
                  {Math.max(0, targetMinutesToday - minutesStudiedToday)} {lang === 'en' ? 'mins remaining' : 'मिनट शेष'}
                </span>
              </div>
            </div>

            {/* Live Study Focus Stopwatch */}
            <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${innerCardBg}`}>
              <div>
                <span className={`text-xs font-semibold block ${textSecondary}`}>
                  {lang === 'en' ? 'Active Study Stopwatch' : 'लाइव स्टडी स्टॉपवॉच'}
                </span>
                <span className={`font-mono text-2xl sm:text-3xl font-extrabold tabular-nums ${textPrimary}`}>
                  {String(Math.floor(sessionSeconds / 3600)).padStart(2, '0')}:
                  {String(Math.floor((sessionSeconds % 3600) / 60)).padStart(2, '0')}:
                  {String(sessionSeconds % 60).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isTimerRunning ? (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7900] hover:bg-[#FF7900]/90 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{lang === 'en' ? 'Start Focus Session' : 'पढ़ाई शुरू करें'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopAndLogTimer}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Stop & Log Time' : 'सेव एवं लॉग करें'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Today's Tasks Checklist */}
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF7900]" />
                <h3 className={`font-display text-base font-bold ${textPrimary}`}>
                  {lang === 'en' ? "Today's Study Tasks" : 'आज की अध्ययन कार्य-सूची'}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs font-semibold text-[#FF7900] hover:text-[#FF9F43] flex items-center gap-1"
              >
                <span>{completedTasksCount}/{todayTasks.length} {lang === 'en' ? 'Done' : 'पूर्ण'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className={`p-8 text-center rounded-xl border border-dashed text-xs ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-400'}`}>
                <p>{lang === 'en' ? 'No tasks planned for today.' : 'आज के लिए कोई कार्य निर्धारित नहीं है।'}</p>
                <button
                  onClick={() => onNavigate('planner')}
                  className="mt-2 text-xs font-bold text-[#FF7900] hover:underline"
                >
                  + {lang === 'en' ? 'Add Task in Study Planner' : 'स्टडी प्लानर में कार्य जोड़ें'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      task.completed
                        ? isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                        : innerCardBg
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 accent-[#FF7900] rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug ${task.completed ? 'line-through opacity-60' : textPrimary}`}>
                        {lang === 'en' ? task.titleEn : task.titleHi}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                        <span className="font-mono">{task.startTime}</span>
                        <span>·</span>
                        <span>{task.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Performance Analytics (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Compact Statistics Card */}
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <h3 className={`font-display text-base font-bold flex items-center gap-2 ${textPrimary}`}>
              <Award className="w-5 h-5 text-[#FF7900]" />
              <span>{lang === 'en' ? 'Verified Performance Metrics' : 'वास्तविक परफॉर्मेंस मेट्रिक्स'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-xl border ${innerCardBg}`}>
                <span className={`text-[11px] font-semibold block ${textSecondary}`}>
                  {lang === 'en' ? 'Tests Attempted' : 'मॉक टेस्ट दिए गए'}
                </span>
                <span className={`font-display text-2xl font-extrabold tabular-nums ${textPrimary}`}>
                  {totalMocks}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {totalMocks > 0 ? (lang === 'en' ? 'Recorded attempts' : 'दर्ज प्रयास') : (lang === 'en' ? 'Take your 1st test' : 'पहला टेस्ट दें')}
                </span>
              </div>

              <div className={`p-3.5 rounded-xl border ${innerCardBg}`}>
                <span className={`text-[11px] font-semibold block ${textSecondary}`}>
                  {lang === 'en' ? 'Overall Accuracy' : 'औसत सटीकता'}
                </span>
                <span className="font-display text-2xl font-extrabold text-[#FF7900] tabular-nums">
                  {totalMocks > 0 ? `${overallAccuracy}%` : '—'}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {totalMocks > 0 ? (overallAccuracy >= 80 ? 'Target zone' : 'Needs improvement') : 'No tests yet'}
                </span>
              </div>

              <div className={`p-3.5 rounded-xl border ${innerCardBg}`}>
                <span className={`text-[11px] font-semibold block ${textSecondary}`}>
                  {lang === 'en' ? 'Latest Mock Score' : 'नवीनतम टेस्ट स्कोर'}
                </span>
                <span className="font-display text-2xl font-extrabold text-[#FF9F43] tabular-nums">
                  {latestMock ? latestMock.rawScore.toFixed(1) : '—'}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {latestMock ? `/ ${latestMock.totalQuestions} marks` : 'No test taken'}
                </span>
              </div>

              <div className={`p-3.5 rounded-xl border ${innerCardBg}`}>
                <span className={`text-[11px] font-semibold block ${textSecondary}`}>
                  {lang === 'en' ? 'Study Streak' : 'अध्ययन स्ट्रीक'}
                </span>
                <span className={`font-display text-2xl font-extrabold tabular-nums flex items-center gap-1 ${textPrimary}`}>
                  <span>{streak}</span>
                  <Flame className="w-5 h-5 text-[#FF7900] fill-[#FF7900]" />
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {streak > 0 ? (lang === 'en' ? 'Consecutive days' : 'लगातार अध्ययन') : (lang === 'en' ? 'Log today to start' : 'आज शुरू करें')}
                </span>
              </div>
            </div>

            {/* Revision Alert Banner */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              userData.mistakeQuestionIds.length > 0
                ? isDark ? 'bg-rose-950/30 border-rose-900/50 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
                : innerCardBg
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${userData.mistakeQuestionIds.length > 0 ? 'text-rose-400' : textSecondary}`} />
                <span>
                  {userData.mistakeQuestionIds.length > 0
                    ? `${userData.mistakeQuestionIds.length} ${lang === 'en' ? 'questions pending in Mistake Vault' : 'गलत प्रश्न रिवीजन हेतु लंबित'}`
                    : (lang === 'en' ? 'Zero mistakes pending in vault.' : 'कोई गलत प्रश्न पेंडिंग नहीं है।')}
                </span>
              </div>
              {userData.mistakeQuestionIds.length > 0 && (
                <button
                  onClick={() => onNavigate('revision')}
                  className="font-bold text-[#FF7900] hover:underline shrink-0"
                >
                  {lang === 'en' ? 'Review →' : 'सुधारें →'}
                </button>
              )}
            </div>
          </div>

          {/* 7-Day Activity Chart */}
          <div className={`p-6 rounded-2xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-display text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
                <BarChart2 className="w-4 h-4 text-[#FF7900]" />
                <span>{lang === 'en' ? 'Weekly Study Hours' : 'पिछले 7 दिनों का अध्ययन'}</span>
              </h3>
              <span className={`text-xs ${textSecondary}`}>Minutes</span>
            </div>

            <div className={`flex items-end justify-between gap-2 h-28 pt-4 pb-2 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date(Date.now() - (6 - i) * 86400000);
                const dStr = date.toISOString().split('T')[0];
                const dayName = date.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { weekday: 'narrow' });
                const mins = userData.dailyStudyMinutes[dStr] || 0;
                const maxMins = (userData.dailyTargetHours || 4) * 60;
                const heightPct = Math.min(100, Math.max(8, Math.round((mins / maxMins) * 100)));

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className={`text-[10px] font-mono tabular-nums ${textSecondary}`}>
                      {mins > 0 ? `${(mins / 60).toFixed(1)}h` : '0'}
                    </span>
                    <div
                      className={`w-full max-w-[28px] rounded-t transition-all ${
                        dStr === todayStr
                          ? 'bg-[#FF7900]'
                          : mins >= maxMins
                          ? 'bg-[#FF9F43]/80'
                          : isDark ? 'bg-zinc-800' : 'bg-zinc-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className={`text-[10px] font-semibold uppercase ${dStr === todayStr ? 'text-[#FF7900]' : textSecondary}`}>
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
