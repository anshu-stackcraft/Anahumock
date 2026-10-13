import React, { useState } from 'react';
import { 
  Bookmark, 
  RotateCcw, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  BookOpen,
  Filter,
  Check,
  Award
} from 'lucide-react';
import { QUESTION_BANK, Question, SourceClassification } from '../data/questionBank';
import { PET_SUBJECTS } from '../data/petData';
import { UserStudyData, saveUserData } from '../data/storage';

interface RevisionNotebookViewProps {
  userData: UserStudyData;
  setUserData: React.Dispatch<React.SetStateAction<UserStudyData>>;
  lang: 'en' | 'hi';
  isDark: boolean;
  initialMode?: 'mistakes' | 'bookmarks' | 'mastery';
}

export const RevisionNotebookView: React.FC<RevisionNotebookViewProps> = ({
  userData,
  setUserData,
  lang,
  isDark,
  initialMode = 'mistakes',
}) => {
  const [activeTab, setActiveTab] = useState<'mistakes' | 'bookmarks' | 'mastery'>(initialMode);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  
  // Re-attempt state
  const [attemptMap, setAttemptMap] = useState<Record<string, number>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  // Theme style classes
  const cardBg = isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-white border-zinc-200 shadow-xs';
  const textPrimary = isDark ? 'text-[#F5F5F7]' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-zinc-500';
  const innerCardBg = isDark ? 'bg-[#222227] border-[#2E2E35]' : 'bg-zinc-50 border-zinc-200';
  const inputBg = isDark ? 'bg-[#131316] border-[#27272A] text-[#F5F5F7]' : 'bg-white border-zinc-200 text-zinc-900';

  // Questions pools
  const mistakeQuestions = userData.mistakeQuestionIds
    .map((id) => QUESTION_BANK.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const bookmarkedQuestions = userData.bookmarkedQuestionIds
    .map((id) => QUESTION_BANK.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const currentQuestions = activeTab === 'mistakes' ? mistakeQuestions : bookmarkedQuestions;

  const filteredQuestions = currentQuestions.filter((q) => {
    if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedSourceType !== 'all' && q.sourceType !== selectedSourceType) return false;
    return true;
  });

  const handlePickOption = (qId: string, optIdx: number, correctIdx: number) => {
    setAttemptMap((prev) => ({ ...prev, [qId]: optIdx }));
    setRevealedMap((prev) => ({ ...prev, [qId]: true }));
  };

  const removeMistake = (qId: string) => {
    const updated = userData.mistakeQuestionIds.filter((id) => id !== qId);
    const updatedData = { ...userData, mistakeQuestionIds: updated };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  const removeBookmark = (qId: string) => {
    const updated = userData.bookmarkedQuestionIds.filter((id) => id !== qId);
    const updatedData = { ...userData, bookmarkedQuestionIds: updated };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  const updateSubjectMastery = (subjectId: string, status: 'not_started' | 'in_progress' | 'mastered') => {
    const updated = {
      ...userData.subjectMastery,
      [subjectId]: status,
    };
    const updatedData = { ...userData, subjectMastery: updated };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FF7900]">
              {lang === 'en' ? 'Smart Review & Notebook' : 'स्मार्ट रिवीजन एवं नोटबुक'}
            </span>
          </div>
          <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>
            {lang === 'en' ? 'Revision Notebook & Mistake Vault' : 'रिवीजन नोटबुक एवं गलतियों की डायरी'}
          </h2>
          <p className={`text-sm ${textSecondary} mt-1`}>
            {lang === 'en'
              ? 'Re-attempt test errors, review starred questions, and track 15-subject syllabus mastery.'
              : 'मॉक टेस्ट की गलतियों को दोबारा हल करें, बुकमार्क पढ़ें और 15 विषयों की तैयारी की स्थिति ट्रैक करें।'}
          </p>
        </div>
      </div>

      {/* Segmented Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border bg-black/20 border-white/5 max-w-xl">
        <button
          onClick={() => setActiveTab('mistakes')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'mistakes'
              ? 'bg-[#FF7900] text-black shadow-xs'
              : `${textSecondary} hover:text-white`
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{lang === 'en' ? `Mistakes (${mistakeQuestions.length})` : `गलतियां (${mistakeQuestions.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'bookmarks'
              ? 'bg-[#FF7900] text-black shadow-xs'
              : `${textSecondary} hover:text-white`
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{lang === 'en' ? `Bookmarks (${bookmarkedQuestions.length})` : `बुकमार्क (${bookmarkedQuestions.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('mastery')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'mastery'
              ? 'bg-[#FF7900] text-black shadow-xs'
              : `${textSecondary} hover:text-white`
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'en' ? 'Syllabus Tracker' : 'सिलेबस ट्रैकर'}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'mastery' ? (
        /* 15 SUBJECTS PROGRESS MATRIX */
        <div className={`p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className={`font-display text-base font-bold ${textPrimary}`}>
                {lang === 'en' ? '15-Subject Syllabus Preparation Tracker' : '15 विषयों का तैयारी ट्रैकर'}
              </h3>
              <p className={`text-xs ${textSecondary} mt-0.5`}>
                {lang === 'en' ? 'Mark your preparation level for each official syllabus unit' : 'प्रत्येक आधिकारिक खंड की तैयारी की स्थिति सेट करें'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PET_SUBJECTS.map((sub) => {
              const currentStatus = userData.subjectMastery[sub.id] || 'not_started';

              return (
                <div key={sub.id} className={`p-4 rounded-xl border ${innerCardBg} space-y-3 text-xs`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold ${textPrimary}`}>{lang === 'en' ? sub.nameEn : sub.nameHi}</h4>
                      <span className="text-[11px] font-mono text-[#FF7900]">{sub.marks} Marks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => updateSubjectMastery(sub.id, 'not_started')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        currentStatus === 'not_started'
                          ? 'bg-zinc-700 text-white shadow-xs'
                          : 'bg-black/20 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {lang === 'en' ? 'Pending' : 'लंबित'}
                    </button>
                    <button
                      onClick={() => updateSubjectMastery(sub.id, 'in_progress')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        currentStatus === 'in_progress'
                          ? 'bg-[#FF9F43] text-black shadow-xs'
                          : 'bg-black/20 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {lang === 'en' ? 'Learning' : 'जारी'}
                    </button>
                    <button
                      onClick={() => updateSubjectMastery(sub.id, 'mastered')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        currentStatus === 'mastered'
                          ? 'bg-emerald-500 text-black shadow-xs'
                          : 'bg-black/20 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {lang === 'en' ? 'Mastered' : 'तैयार ✓'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MISTAKES & BOOKMARKS LIST WITH RE-ATTEMPT */
        <div className="space-y-4">
          {/* Filter Bar for Revision Questions */}
          <div className={`p-4 rounded-2xl border transition-all ${cardBg} flex flex-wrap items-center gap-3`}>
            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={`py-2 px-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
            >
              <option value="all">{lang === 'en' ? 'All Subjects' : 'सभी विषय'}</option>
              {PET_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{lang === 'en' ? s.nameEn : s.nameHi}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`py-2 px-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
            >
              <option value="all">{lang === 'en' ? 'All Difficulties' : 'सभी कठिनाई'}</option>
              <option value="easy">{lang === 'en' ? 'Easy' : 'सरल'}</option>
              <option value="medium">{lang === 'en' ? 'Medium' : 'मध्यम'}</option>
              <option value="hard">{lang === 'en' ? 'Hard' : 'कठिन'}</option>
            </select>

            {/* Source Type Filter */}
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className={`py-2 px-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
            >
              <option value="all">{lang === 'en' ? 'All Sources' : 'सभी स्रोत'}</option>
              <option value="Verified Previous-Year Question">Verified PYQ</option>
              <option value="Original Practice Question">Original Practice</option>
              <option value="Current Affairs Question">Current Affairs</option>
            </select>

            <span className={`text-xs ${textSecondary} ml-auto font-mono`}>
              {filteredQuestions.length} {lang === 'en' ? 'Items' : 'प्रश्न'}
            </span>
          </div>

          {/* Questions Stream */}
          {filteredQuestions.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${cardBg} space-y-3`}>
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/40 text-[#A1A1AA] flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className={`font-display text-base font-bold ${textPrimary}`}>
                {activeTab === 'mistakes'
                  ? lang === 'en' ? 'No Recorded Mistakes!' : 'कोई गलती दर्ज नहीं है!'
                  : lang === 'en' ? 'No Bookmarked Questions Yet!' : 'कोई प्रश्न बुकमार्क नहीं किया गया!'}
              </h3>
              <p className={`text-xs ${textSecondary} max-w-md mx-auto`}>
                {activeTab === 'mistakes'
                  ? lang === 'en'
                    ? 'Attempt mock tests or practice questions. Any incorrect answer will be automatically saved here for re-attempts.'
                    : 'मॉक टेस्ट या अभ्यास प्रश्न हल करें। जो प्रश्न गलत होंगे, वे स्वतः यहां रिवीजन के लिए जुड़ जाएंगे।'
                  : lang === 'en'
                    ? 'Click the bookmark icon on any question in the Question Bank or Mock Test to save it for quick review.'
                    : 'प्रश्न बैंक या मॉक टेस्ट में किसी भी प्रश्न पर स्टार/बुकमार्क आइकन दबाकर उसे यहां सहेजें।'}
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const userPick = attemptMap[q.id];
              const isRevealed = revealedMap[q.id];
              const hasAnswered = userPick !== undefined;
              const isCorrectAttempt = hasAnswered && userPick === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}
                >
                  {/* Top Metadata & Action */}
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        q.difficulty === 'easy'
                          ? 'border-emerald-500/20 text-emerald-400'
                          : q.difficulty === 'hard'
                          ? 'border-rose-500/20 text-rose-400'
                          : 'border-amber-500/20 text-amber-400'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeTab === 'mistakes' ? (
                        <button
                          onClick={() => removeMistake(q.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 hover:bg-emerald-900/40 transition-colors"
                          title="Mark resolved and remove from mistake notebook"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Resolved' : 'सुलझ गया'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => removeBookmark(q.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-rose-400 bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/40 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Remove' : 'हटाएं'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className={`text-sm sm:text-base font-medium leading-relaxed ${textPrimary}`}>
                    {lang === 'en' ? q.questionEn : q.questionHi}
                  </p>

                  {/* Options (Re-attempt directly here) */}
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

                  {/* Feedback on Re-attempt */}
                  {isRevealed && (
                    <div className={`p-4 rounded-xl border space-y-1.5 ${
                      isCorrectAttempt
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                        : isDark
                        ? 'bg-[#1F1B16] border-[#FF7900]/30 text-zinc-200'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7900]">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
                          <span>{lang === 'en' ? 'Official Solution & Insight:' : 'समाधान एवं व्याख्या:'}</span>
                        </div>
                        {activeTab === 'mistakes' && isCorrectAttempt && (
                          <button
                            onClick={() => removeMistake(q.id)}
                            className="text-xs font-bold text-emerald-400 hover:underline"
                          >
                            {lang === 'en' ? 'Mark Resolved and Remove ✓' : 'सुलझ गया - सूची से हटाएं ✓'}
                          </button>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed">
                        {lang === 'en' ? q.explanationEn : q.explanationHi}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
