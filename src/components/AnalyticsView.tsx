import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Clock, 
  Target, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { UserStudyData } from '../data/storage';
import { PET_SUBJECTS } from '../data/petData';
import { QUESTION_BANK } from '../data/questionBank';

interface AnalyticsViewProps {
  userData: UserStudyData;
  lang: 'en' | 'hi';
  isDark: boolean;
  onNavigateToRevision: () => void;
  onNavigateToMock: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userData,
  lang,
  isDark,
  onNavigateToRevision,
  onNavigateToMock,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Theme style classes
  const cardBg = isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-white border-zinc-200 shadow-xs';
  const textPrimary = isDark ? 'text-[#F5F5F7]' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-zinc-500';
  const innerCardBg = isDark ? 'bg-[#222227] border-[#2E2E35]' : 'bg-zinc-50 border-zinc-200';

  // Calculate Streak (consecutive days with > 0 minutes)
  const calculateStreak = () => {
    let streak = 0;
    let checkDate = new Date();
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
  const streakDays = calculateStreak();

  // Weekly total minutes (past 7 days)
  let past7DaysMinutes = 0;
  const last7DaysData: { date: string; label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
    const mins = userData.dailyStudyMinutes[dStr] || 0;
    past7DaysMinutes += mins;
    last7DaysData.push({ date: dStr, label: dayLabel, minutes: mins });
  }

  // All time total study hours
  const allTimeMinutes = Object.values(userData.dailyStudyMinutes).reduce((acc, m) => acc + m, 0);
  const allTimeHours = (allTimeMinutes / 60).toFixed(1);

  // Mock test statistics
  const totalMocks = userData.mockHistory.length;
  const avgScore = totalMocks > 0
    ? (userData.mockHistory.reduce((acc, m) => acc + m.rawScore, 0) / totalMocks).toFixed(1)
    : '0';
  const avgAccuracy = totalMocks > 0
    ? Math.round(userData.mockHistory.reduce((acc, m) => acc + m.accuracy, 0) / totalMocks)
    : 0;

  // Weak subjects analysis based on mistake IDs
  const mistakeCountsBySubject: Record<string, number> = {};
  userData.mistakeQuestionIds.forEach((qId) => {
    const q = QUESTION_BANK.find((item) => item.id === qId);
    if (q) {
      mistakeCountsBySubject[q.subjectId] = (mistakeCountsBySubject[q.subjectId] || 0) + 1;
    }
  });

  const sortedWeakSubjects = Object.entries(mistakeCountsBySubject)
    .sort(([, a], [, b]) => b - a)
    .map(([subId, count]) => {
      const sub = PET_SUBJECTS.find((s) => s.id === subId);
      return {
        id: subId,
        name: sub ? (lang === 'en' ? sub.nameEn : sub.nameHi) : subId,
        marks: sub?.marks || 5,
        mistakes: count,
      };
    });

  // Target max minutes for visual bar height
  const maxDayMinutes = Math.max(120, ...last7DaysData.map((d) => d.minutes));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FF7900]">
              {lang === 'en' ? 'Performance & Study Analytics' : 'प्रगति विश्लेषण एवं स्कोर रिपोर्ट'}
            </span>
          </div>
          <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>
            {lang === 'en' ? 'My Preparation Progress & Analytics' : 'मेरी तैयारी की समग्र प्रगति'}
          </h2>
          <p className={`text-sm ${textSecondary} mt-1`}>
            {lang === 'en'
              ? 'Real-time metrics calculated from your study sessions, mock test scores, and mistake trends.'
              : 'आपके अध्ययन समय, मॉक टेस्ट स्कोर एवं गलतियों के आधार पर तैयार किया गया वास्तविक प्रदर्शन डेटा।'}
          </p>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Study Hours */}
        <div className={`p-5 rounded-2xl border transition-all ${cardBg} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
              {lang === 'en' ? 'Total Study Time' : 'कुल अध्ययन समय'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-display font-bold ${textPrimary}`}>{allTimeHours}</span>
            <span className={`text-xs ${textSecondary}`}>hrs ({allTimeMinutes} min)</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            {past7DaysMinutes} {lang === 'en' ? 'min in past 7 days' : 'मिनट पिछले 7 दिनों में'}
          </p>
        </div>

        {/* Current Active Streak */}
        <div className={`p-5 rounded-2xl border transition-all ${cardBg} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
              {lang === 'en' ? 'Active Streak' : 'अध्ययन स्ट्रीक'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-bold text-[#FF7900]">{streakDays}</span>
            <span className={`text-xs ${textSecondary}`}>{lang === 'en' ? 'consecutive days' : 'लगातार दिन'}</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            {lang === 'en' ? 'Daily consistency matters' : 'नियमितता ही सफलता की कुंजी है'}
          </p>
        </div>

        {/* Mock Tests Taken */}
        <div className={`p-5 rounded-2xl border transition-all ${cardBg} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
              {lang === 'en' ? 'Mock Tests Taken' : 'मॉक टेस्ट हल किए'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-display font-bold ${textPrimary}`}>{totalMocks}</span>
            <span className={`text-xs ${textSecondary}`}>{lang === 'en' ? 'attempts' : 'प्रयास'}</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            {lang === 'en' ? `Average Score: ${avgScore}/100` : `औसत स्कोर: ${avgScore}/100`}
          </p>
        </div>

        {/* Accuracy Rate */}
        <div className={`p-5 rounded-2xl border transition-all ${cardBg} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
              {lang === 'en' ? 'Overall Accuracy' : 'औसत सटीकता'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-display font-bold ${
              avgAccuracy >= 80 ? 'text-emerald-400' : avgAccuracy >= 60 ? 'text-[#FF7900]' : textPrimary
            }`}>
              {avgAccuracy}%
            </span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            {totalMocks > 0
              ? (lang === 'en' ? 'Calculated from completed tests' : 'पूर्ण किए गए टेस्टों से परिकलित')
              : (lang === 'en' ? 'Attempt mock tests to track' : 'मॉक टेस्ट देकर सटीकता देखें')}
          </p>
        </div>
      </div>

      {/* 7-Day Study Bar Chart & Weak Subjects Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Past 7 Days Study Distribution Chart */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className={`font-display text-base font-bold ${textPrimary}`}>
                {lang === 'en' ? 'Weekly Study Distribution (Past 7 Days)' : 'साप्ताहिक अध्ययन वितरण (पिछले 7 दिन)'}
              </h3>
              <p className={`text-xs ${textSecondary} mt-0.5`}>
                {lang === 'en' ? 'Minutes studied each day' : 'प्रतिदिन पढ़े गए मिनटों का ग्राफ'}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#FF7900]">
              {past7DaysMinutes} min ({Math.round(past7DaysMinutes / 60)}h)
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {last7DaysData.map((day) => {
                const heightPct = Math.max(8, Math.round((day.minutes / maxDayMinutes) * 100));
                const isToday = day.date === todayStr;

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.minutes}m
                    </span>
                    <div className="w-full max-w-[36px] bg-zinc-800/40 rounded-xl overflow-hidden p-0.5 flex items-end h-full">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ${
                          isToday
                            ? 'bg-[#FF7900]'
                            : day.minutes > 0
                            ? 'bg-zinc-600 group-hover:bg-[#FF9F43]'
                            : 'bg-transparent'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-semibold ${isToday ? 'text-[#FF7900]' : textSecondary}`}>
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Weak Subjects / Mistake Hotspots */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <h3 className={`font-display text-base font-bold ${textPrimary}`}>
                {lang === 'en' ? 'Weak Subjects & Mistake Hotspots' : 'कमजोर विषय एवं गलतियों का विश्लेषण'}
              </h3>
            </div>
            <button
              onClick={onNavigateToRevision}
              className="text-xs font-bold text-[#FF7900] hover:underline"
            >
              {lang === 'en' ? 'Open Vault →' : 'डायरी खोलें →'}
            </button>
          </div>

          {sortedWeakSubjects.length === 0 ? (
            <div className={`text-center py-10 rounded-xl border ${innerCardBg} space-y-2`}>
              <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
              <p className={`text-xs font-semibold ${textPrimary}`}>
                {lang === 'en' ? 'No mistake clusters detected!' : 'कोई कमजोरी दर्ज नहीं है!'}
              </p>
              <p className={`text-[11px] ${textSecondary}`}>
                {lang === 'en'
                  ? 'Great going! Attempt more mock tests to pinpoint challenging topics.'
                  : 'बहुत बढ़िया! अधिक मॉक टेस्ट देकर कठिन अध्यायों की पहचान करें।'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sortedWeakSubjects.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border ${innerCardBg} flex items-center justify-between text-xs`}
                >
                  <div>
                    <span className={`font-semibold block ${textPrimary}`}>{item.name}</span>
                    <span className={`text-[10px] ${textSecondary}`}>{item.marks} marks in official pattern</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {item.mistakes} {lang === 'en' ? 'mistakes' : 'गलतियां'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Mock Test History Table */}
      <div className={`p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF7900]" />
            <h3 className={`font-display text-base font-bold ${textPrimary}`}>
              {lang === 'en' ? 'Recent Mock Test Attempt History' : 'हालिया मॉक टेस्ट प्रयास इतिहास'}
            </h3>
          </div>
          <button
            onClick={onNavigateToMock}
            className="text-xs font-bold text-[#FF7900] hover:underline"
          >
            {lang === 'en' ? '+ Take New Mock' : '+ नया टेस्ट दें'}
          </button>
        </div>

        {userData.mockHistory.length === 0 ? (
          <div className={`text-center py-12 rounded-xl border ${innerCardBg} space-y-3`}>
            <HelpCircle className="w-8 h-8 text-[#A1A1AA] mx-auto" />
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {lang === 'en' ? 'No mock tests completed yet' : 'अभी तक कोई मॉक टेस्ट नहीं दिया गया है'}
            </p>
            <p className={`text-xs ${textSecondary} max-w-sm mx-auto`}>
              {lang === 'en'
                ? 'Attempt our 100-Question Official Pattern Mock Test with 0.25 negative marking to generate comprehensive analytics.'
                : '100 प्रश्नों का आधिकारिक मॉक टेस्ट देकर वास्तविक परीक्षा पैटर्न पर अपना स्कोर और रैंक जांचें।'}
            </p>
            <button
              onClick={onNavigateToMock}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#FF7900] text-black hover:bg-[#FF9F43] transition-all"
            >
              {lang === 'en' ? 'Start Official Mock Test' : 'फुल मॉक टेस्ट शुरू करें'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className={`border-b border-white/5 ${textSecondary}`}>
                  <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Test Title' : 'टेस्ट का नाम'}</th>
                  <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Date' : 'तारीख'}</th>
                  <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Attempted' : 'प्रयास'}</th>
                  <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Net Score' : 'नेट स्कोर'}</th>
                  <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Accuracy' : 'सटीकता'}</th>
                  <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Time' : 'समय'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userData.mockHistory.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className={`py-3 px-3 font-semibold ${textPrimary}`}>
                      {lang === 'hi' ? m.testTitleHi : m.testTitleEn}
                    </td>
                    <td className={`py-3 px-3 ${textSecondary}`}>
                      {new Date(m.date).toLocaleDateString()}
                    </td>
                    <td className={`py-3 px-3 ${textSecondary}`}>
                      {m.attempted}/{m.totalQuestions} ({m.correct}C / {m.incorrect}W)
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#FF7900]">
                      {m.rawScore.toFixed(2)}
                    </td>
                    <td className={`py-3 px-3 font-mono font-bold ${
                      m.accuracy >= 80 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {m.accuracy}%
                    </td>
                    <td className={`py-3 px-3 ${textSecondary}`}>
                      {Math.round(m.timeTakenSeconds / 60)}m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
