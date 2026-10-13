import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Bookmark, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { QUESTION_BANK, Question, SourceClassification } from '../data/questionBank';
import { PET_SUBJECTS } from '../data/petData';
import { UserStudyData, saveUserData } from '../data/storage';

interface QuestionBankViewProps {
  userData: UserStudyData;
  setUserData: React.Dispatch<React.SetStateAction<UserStudyData>>;
  lang: 'en' | 'hi';
  isDark: boolean;
  initialSubjectFilter?: string;
  initialMode?: 'all' | 'practice' | 'bookmarks' | 'mistakes';
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  userData,
  setUserData,
  lang,
  isDark,
  initialSubjectFilter = 'all',
  initialMode = 'all',
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectFilter);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [viewFilterMode, setViewFilterMode] = useState<'all' | 'bookmarks' | 'mistakes'>(
    initialMode === 'bookmarks' ? 'bookmarks' : initialMode === 'mistakes' ? 'mistakes' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [selectedOptionMap, setSelectedOptionMap] = useState<Record<string, number>>({});

  // Theme style classes
  const cardBg = isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-white border-zinc-200 shadow-xs';
  const textPrimary = isDark ? 'text-[#F5F5F7]' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-zinc-500';
  const innerCardBg = isDark ? 'bg-[#222227] border-[#2E2E35]' : 'bg-zinc-50 border-zinc-200';
  const inputBg = isDark ? 'bg-[#131316] border-[#27272A] text-[#F5F5F7]' : 'bg-white border-zinc-200 text-zinc-900';

  const toggleBookmark = (qId: string) => {
    const isBookmarked = userData.bookmarkedQuestionIds.includes(qId);
    const updated = isBookmarked
      ? userData.bookmarkedQuestionIds.filter((id) => id !== qId)
      : [...userData.bookmarkedQuestionIds, qId];

    const updatedData = { ...userData, bookmarkedQuestionIds: updated };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  const handlePickOption = (qId: string, optIdx: number, correctIdx: number) => {
    setSelectedOptionMap((prev) => ({ ...prev, [qId]: optIdx }));
    setRevealedAnswers((prev) => ({ ...prev, [qId]: true }));

    // If answer is incorrect, add to mistake notebook if not already present
    if (optIdx !== correctIdx) {
      if (!userData.mistakeQuestionIds.includes(qId)) {
        const updatedMistakes = [...userData.mistakeQuestionIds, qId];
        const updatedData = { ...userData, mistakeQuestionIds: updatedMistakes };
        saveUserData(updatedData);
        setUserData(updatedData);
      }
    }
  };

  const filteredQuestions = QUESTION_BANK.filter((q) => {
    // Mode filter
    if (viewFilterMode === 'bookmarks' && !userData.bookmarkedQuestionIds.includes(q.id)) return false;
    if (viewFilterMode === 'mistakes' && !userData.mistakeQuestionIds.includes(q.id)) return false;

    // Subject filter
    if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;

    // Difficulty filter
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;

    // Source type filter
    if (selectedSourceType !== 'all' && q.sourceType !== selectedSourceType) return false;

    // Search query
    if (searchQuery.trim()) {
      const qText = `${q.questionHi} ${q.questionEn} ${q.topicHi} ${q.topicEn} ${q.sourceDetail}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FF7900]">
              {lang === 'en' ? 'Official Syllabus Question Bank' : 'आधिकारिक पाठ्यक्रम प्रश्न बैंक'}
            </span>
          </div>
          <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>
            {lang === 'en' ? 'UPSSSC PET Question Repository' : 'यूपीएसएसएससी पीईटी प्रश्न संग्रह'}
          </h2>
          <p className={`text-sm ${textSecondary} mt-1`}>
            {lang === 'en'
              ? 'Topic-wise practice questions covering all 15 syllabus subjects with source classifications and solutions.'
              : 'सभी 15 विषयों का सत्यापित प्रश्न बैंक — विगत वर्षों के प्रश्न, मौलिक अभ्यास व समसामयिकी।'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border ${cardBg} text-[#FF7900]`}>
            {filteredQuestions.length} {lang === 'en' ? 'Questions Found' : 'प्रश्न उपलब्ध'}
          </span>
        </div>
      </div>

      {/* Main Filter & Control Panel */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${cardBg} space-y-4`}>
        {/* Top Filter Bar: Search + Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search by question, topic, keyword (e.g. Lothal, GST)...' : 'प्रश्न, टॉपिक या कीवर्ड से खोजें (जैसे: लोथल, GST, संधि, औसत)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
            />
          </div>

          {/* Source Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className={`w-full py-2.5 px-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
            >
              <option value="all">{lang === 'en' ? 'All Source Types' : 'सभी स्रोत वर्गीकरण'}</option>
              <option value="Verified Previous-Year Question">
                {lang === 'en' ? 'Verified PYQ (विगत वर्ष)' : 'सत्यापित विगत वर्ष (PYQ)'}
              </option>
              <option value="Original Practice Question">
                {lang === 'en' ? 'Original Practice (अभ्यास)' : 'मौलिक अभ्यास प्रश्न'}
              </option>
              <option value="Current Affairs Question">
                {lang === 'en' ? 'Current Affairs (समसामयिकी)' : 'समसामयिकी प्रश्न'}
              </option>
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`w-full py-2.5 px-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
            >
              <option value="all">{lang === 'en' ? 'All Difficulties' : 'सभी कठिनाई स्तर'}</option>
              <option value="easy">{lang === 'en' ? 'Easy (सरल)' : 'सरल (Easy)'}</option>
              <option value="medium">{lang === 'en' ? 'Medium (मध्यम)' : 'मध्यम (Medium)'}</option>
              <option value="hard">{lang === 'en' ? 'Hard (कठिन/DI)' : 'कठिन (Hard)'}</option>
            </select>
          </div>

          {/* View Filter Pill Switcher (All vs Bookmarked vs Mistakes) */}
          <div className="md:col-span-2 flex items-center gap-1 p-1 rounded-xl border bg-black/20 border-white/5">
            <button
              onClick={() => setViewFilterMode('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                viewFilterMode === 'all'
                  ? 'bg-[#FF7900] text-black shadow-xs font-bold'
                  : `${textSecondary} hover:text-white`
              }`}
              title="All Questions"
            >
              {lang === 'en' ? 'All' : 'सभी'}
            </button>
            <button
              onClick={() => setViewFilterMode('bookmarks')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                viewFilterMode === 'bookmarks'
                  ? 'bg-[#FF7900] text-black shadow-xs font-bold'
                  : `${textSecondary} hover:text-white`
              }`}
              title="Bookmarked Questions"
            >
              ★ {userData.bookmarkedQuestionIds.length}
            </button>
            <button
              onClick={() => setViewFilterMode('mistakes')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                viewFilterMode === 'mistakes'
                  ? 'bg-[#FF7900] text-black shadow-xs font-bold'
                  : `${textSecondary} hover:text-white`
              }`}
              title="Mistakes Vault"
            >
              ⚠ {userData.mistakeQuestionIds.length}
            </button>
          </div>
        </div>

        {/* 15 Subjects Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              selectedSubject === 'all'
                ? 'bg-[#FF7900] text-black font-bold shadow-xs'
                : `${innerCardBg} ${textSecondary} hover:${textPrimary}`
            }`}
          >
            {lang === 'en' ? 'All 15 Subjects' : 'सभी 15 विषय'}
          </button>
          {PET_SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                selectedSubject === sub.id
                  ? 'bg-[#FF7900] text-black font-bold shadow-xs'
                  : `${innerCardBg} ${textSecondary} hover:${textPrimary}`
              }`}
            >
              {lang === 'en' ? sub.nameEn : sub.nameHi} ({sub.marks}M)
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${cardBg} space-y-3`}>
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/40 text-[#A1A1AA] flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {lang === 'en' ? 'No questions match the current filters' : 'वर्तमान फिल्टर से कोई प्रश्न नहीं मिला'}
            </p>
            <p className={`text-xs ${textSecondary}`}>
              {lang === 'en' ? 'Try clearing search keywords or selecting all subjects' : 'कृपया खोज शब्द हटाएं या सभी विषय चुनें'}
            </p>
            <button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedDifficulty('all');
                setSelectedSourceType('all');
                setSearchQuery('');
                setViewFilterMode('all');
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#FF7900] text-black hover:bg-[#FF9F43] transition-all"
            >
              {lang === 'en' ? 'Reset All Filters' : 'सभी फिल्टर रीसेट करें'}
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isRevealed = revealedAnswers[q.id];
            const userPick = selectedOptionMap[q.id];
            const isBookmarked = userData.bookmarkedQuestionIds.includes(q.id);
            const isMistake = userData.mistakeQuestionIds.includes(q.id);

            // Source Badge color
            let sourceBadgeColor = isDark
              ? 'bg-blue-950/40 text-blue-400 border-blue-900/40'
              : 'bg-blue-50 text-blue-700 border-blue-200';
            if (q.sourceType === 'Verified Previous-Year Question') {
              sourceBadgeColor = isDark
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';
            } else if (q.sourceType === 'Current Affairs Question') {
              sourceBadgeColor = isDark
                ? 'bg-amber-950/40 text-amber-400 border-amber-900/40'
                : 'bg-amber-50 text-amber-700 border-amber-200';
            }

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}
              >
                {/* Question Top Tags & Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#FF7900]">#{idx + 1}</span>
                    <span className={`px-2.5 py-0.5 rounded-lg font-semibold ${innerCardBg} ${textPrimary}`}>
                      {lang === 'en' ? q.subjectNameEn : q.subjectNameHi}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className={`${textSecondary} font-medium`}>
                      {lang === 'en' ? q.topicEn : q.topicHi}
                    </span>
                    {isMistake && (
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {lang === 'en' ? 'Mistake Vault' : 'गलती डायरी'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-medium ${sourceBadgeColor}`}>
                      {q.sourceType} ({q.sourceDetail})
                    </span>
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-[#FF7900] bg-[#FF7900]/10'
                          : `${textSecondary} hover:text-[#FF7900] hover:bg-zinc-800/40`
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#FF7900]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* If question has Data Interpretation (Graph / Table / Reading Passage) */}
                {q.hasDataInterpretation && q.tableOrChartData && (
                  <div className={`p-4 rounded-xl border ${innerCardBg} space-y-2`}>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FF7900]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? q.tableOrChartData.titleEn : q.tableOrChartData.titleHi}</span>
                    </div>
                    <div className={`text-xs font-mono p-3 rounded-lg border leading-relaxed whitespace-pre-wrap overflow-x-auto ${
                      isDark ? 'bg-black/40 border-[#27272A] text-zinc-300' : 'bg-white border-zinc-200 text-zinc-800'
                    }`}>
                      {q.tableOrChartData.content}
                    </div>
                  </div>
                )}

                {/* Question Text */}
                <p className={`text-sm sm:text-base font-medium leading-relaxed ${textPrimary}`}>
                  {lang === 'en' ? q.questionEn : q.questionHi}
                </p>

                {/* Four Options (Practice Mode) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {(lang === 'en' ? q.optionsEn : q.optionsHi).map((opt, oIdx) => {
                    const isRight = oIdx === q.correctIndex;
                    const isPicked = userPick === oIdx;

                    let btnStyle = `${innerCardBg} ${textPrimary} hover:border-[#FF7900]/50`;
                    if (isRevealed) {
                      if (isRight) {
                        btnStyle = isDark
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/50'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                      } else if (isPicked && !isRight) {
                        btnStyle = isDark
                          ? 'bg-rose-950/40 border-rose-500 text-rose-300 font-medium line-through'
                          : 'bg-rose-50 border-rose-400 text-rose-950 font-medium line-through';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handlePickOption(q.id, oIdx, q.correctIndex)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                            isRevealed && isRight
                              ? 'bg-emerald-500 text-black'
                              : isRevealed && isPicked && !isRight
                              ? 'bg-rose-500 text-white'
                              : isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                        {isRevealed && isRight && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {isRevealed && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Drawer / Reveal Button */}
                {isRevealed ? (
                  <div className={`p-4 rounded-xl border space-y-1.5 ${
                    isDark
                      ? 'bg-[#1F1B16] border-[#FF7900]/30 text-zinc-200'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7900]">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
                      <span>{lang === 'en' ? 'Official Solution & Conceptual Explanation:' : 'सही उत्तर एवं विस्तृत विश्लेषण:'}</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {lang === 'en' ? q.explanationEn : q.explanationHi}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setRevealedAnswers((prev) => ({ ...prev, [q.id]: true }))}
                      className="text-xs font-semibold text-[#FF7900] hover:text-[#FF9F43] flex items-center gap-1.5 transition-colors"
                    >
                      <span>{lang === 'en' ? 'View Solution & Explanation →' : 'उत्तर एवं व्याख्या देखें →'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
