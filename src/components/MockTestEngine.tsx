import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Bookmark, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Award, 
  HelpCircle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { QUESTION_BANK, Question, PRESET_MOCK_TESTS, MockTestConfig } from '../data/questionBank';
import { UserStudyData, MockResultRecord, saveUserData } from '../data/storage';

interface MockTestEngineProps {
  userData: UserStudyData;
  setUserData: React.Dispatch<React.SetStateAction<UserStudyData>>;
  lang: 'en' | 'hi';
  isDark: boolean;
}

export const MockTestEngine: React.FC<MockTestEngineProps> = ({
  userData,
  setUserData,
  lang,
  isDark,
}) => {
  // Test selection state vs Active Test state vs Result Screen state
  const [selectedConfig, setSelectedConfig] = useState<MockTestConfig | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isResultMode, setIsResultMode] = useState(false);
  
  // Test run state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // question index -> option index
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({}); // index -> boolean
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const isSubmittingRef = useRef(false);
  
  // Completed result state
  const [lastResult, setLastResult] = useState<MockResultRecord | null>(null);
  const [filterReviewMode, setFilterReviewMode] = useState<'all' | 'incorrect'>('all');

  // Theme style helpers
  const cardBg = isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-white border-zinc-200 shadow-xs';
  const textPrimary = isDark ? 'text-[#F5F5F7]' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-zinc-500';
  const innerCardBg = isDark ? 'bg-[#222227] border-[#2E2E35]' : 'bg-zinc-50 border-zinc-200';

  // Start a test
  const handleStartTest = (config: MockTestConfig) => {
    isSubmittingRef.current = false;
    let testQuestions = config.questionIds
      .map((id) => QUESTION_BANK.find((q) => q.id === id))
      .filter((q): q is Question => q !== undefined);

    if (testQuestions.length === 0) {
      testQuestions = QUESTION_BANK.slice(0, config.totalQuestions);
    }

    setSelectedConfig(config);
    setQuestions(testQuestions);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setVisited({ 0: true });
    const durationSec = config.durationMinutes * 60;
    setRemainingSeconds(durationSec);
    setInitialDurationSeconds(durationSec);
    setIsTestActive(true);
    setIsResultMode(false);
    setShowSubmitConfirm(false);
  };

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTestActive && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleFinalSubmit(); // Automatic submission at zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, remainingSeconds]);

  // Option selection
  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const goToQuestion = (idx: number) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIndex(idx);
      setVisited((prev) => ({ ...prev, [idx]: true }));
    }
  };

  // Submit test and calculate results
  const handleFinalSubmit = () => {
    if (!selectedConfig || isSubmittingRef.current) return;
    isSubmittingRef.current = true; // Prevent duplicate scoring or double submissions

    let correctCount = 0;
    let incorrectCount = 0;
    const incorrectIds: string[] = [];

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen !== undefined) {
        if (chosen === q.correctIndex) {
          correctCount++;
        } else {
          incorrectCount++;
          incorrectIds.push(q.id);
        }
      }
    });

    const attemptedCount = correctCount + incorrectCount;
    const unansweredCount = questions.length - attemptedCount;
    
    // Official Formula: Correct * 1.0 - Incorrect * 0.25 (Unanswered receives 0, no deduction)
    const grossScore = correctCount * selectedConfig.marksPerQuestion;
    const penalty = incorrectCount * selectedConfig.negativeMarking;
    const netRawScore = Math.max(0, grossScore - penalty);
    const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
    const timeTaken = initialDurationSeconds - remainingSeconds;

    const resultRecord: MockResultRecord = {
      id: `result-${Date.now()}`,
      testId: selectedConfig.id,
      testTitleHi: selectedConfig.titleHi,
      testTitleEn: selectedConfig.titleEn,
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      attempted: attemptedCount,
      correct: correctCount,
      incorrect: incorrectCount,
      unanswered: unansweredCount,
      rawScore: Math.round(netRawScore * 100) / 100,
      accuracy: Math.round(accuracy * 10) / 10,
      timeTakenSeconds: timeTaken,
      incorrectQuestionIds: incorrectIds,
    };

    // Save to user storage & auto-save mistakes to Mistake Vault
    const updatedMistakes = Array.from(new Set([...userData.mistakeQuestionIds, ...incorrectIds]));
    const updatedHistory = [resultRecord, ...userData.mockHistory];
    const updatedData: UserStudyData = {
      ...userData,
      mockHistory: updatedHistory,
      mistakeQuestionIds: updatedMistakes,
    };
    saveUserData(updatedData);
    setUserData(updatedData);

    setLastResult(resultRecord);
    setIsTestActive(false);
    setIsResultMode(true);
    setShowSubmitConfirm(false);
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  // Toggle Bookmark
  const toggleBookmark = (qId: string) => {
    const isBookmarked = userData.bookmarkedQuestionIds.includes(qId);
    const updated = isBookmarked
      ? userData.bookmarkedQuestionIds.filter((id) => id !== qId)
      : [...userData.bookmarkedQuestionIds, qId];

    const updatedData = { ...userData, bookmarkedQuestionIds: updated };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  // 1. SELECT MOCK TEST SCREEN
  if (!isTestActive && !isResultMode) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={`font-display text-2xl font-bold tracking-tight ${textPrimary}`}>
            {lang === 'en' ? 'UPSSSC PET Official Mock Test Engine' : 'यूपीएसएसएससी पीईटी फुल मॉक टेस्ट एवं टेस्ट इंजन'}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${textSecondary}`}>
            {lang === 'en'
              ? 'Attempt the verified 100-Question / 120-Minute official exam format with instant -0.25 negative marking and question palette.'
              : 'आधिकारिक परीक्षा पैटर्न (100 प्रश्न / 120 मिनट / 0.25 निगेटिव मार्किंग) के अनुसार तैयार वास्तविक अभ्यास टेस्ट।'}
          </p>
        </div>

        {/* Exam Pattern Guarantee Card */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${innerCardBg}`}>
          <ShieldCheck className="w-5 h-5 text-[#FF7900] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className={`font-bold block ${textPrimary}`}>
              {lang === 'en' ? 'Verified Official Pattern Compliance' : 'नवीनतम आधिकारिक परीक्षा पैटर्न आधारित:'}
            </span>
            <p className={textSecondary}>
              {lang === 'en'
                ? 'Correct Answer = +1.00 Mark | Incorrect Answer = -0.25 Mark | Unanswered = 0.00 Marks (No penalty). Total 100 Marks across all 15 syllabus subjects.'
                : 'प्रत्येक सही उत्तर पर +1.00 अंक, गलत उत्तर पर -0.25 अंक की कटौती (1/4th), तथा अनुत्तरित रहने पर 0 अंक। कुल 100 प्रश्न = 100 अंक।'}
            </p>
          </div>
        </div>

        {/* Tests List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_MOCK_TESTS.map((test) => (
            <div
              key={test.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between hover:border-[#FF7900] transition-all group ${cardBg}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    test.type === 'full' 
                      ? 'bg-[#FF7900]/15 text-[#FF7900] border border-[#FF7900]/30 font-extrabold' 
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {test.type === 'full' ? (lang === 'en' ? 'Official 100 Qs Full Mock' : '100 प्रश्न सम्पूर्ण फुल मॉक') : (lang === 'en' ? 'Sectional Test' : 'विषयवार टेस्ट')}
                  </span>
                  <span className="text-xs font-mono text-[#FF7900]">
                    -0.25 Negative Marking
                  </span>
                </div>

                <h3 className={`font-display text-base font-bold group-hover:text-[#FF7900] transition-colors ${textPrimary}`}>
                  {lang === 'en' ? test.titleEn : test.titleHi}
                </h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${textSecondary}`}>
                  {lang === 'en' ? test.descriptionEn : test.descriptionHi}
                </p>

                <div className={`flex items-center gap-4 mt-4 text-xs font-medium ${textSecondary}`}>
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#FF7900]" />
                    <span>{test.totalQuestions} {lang === 'en' ? 'Questions' : 'प्रश्न'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FF9F43]" />
                    <span>{test.durationMinutes} {lang === 'en' ? 'Minutes' : 'मिनट'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>{test.totalQuestions * test.marksPerQuestion} {lang === 'en' ? 'Marks' : 'अंक'}</span>
                  </div>
                </div>
              </div>

              <div className={`pt-4 mt-4 border-t flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <span className="text-xs text-zinc-500">
                  {lang === 'en' ? 'NCERT Standard' : 'आधिकारिक पाठ्यक्रम'}
                </span>
                <button
                  onClick={() => handleStartTest(test)}
                  className="px-4 py-2 bg-[#FF7900] hover:bg-[#FF7900]/90 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{lang === 'en' ? 'Start Test Now' : 'टेस्ट शुरू करें'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Real Test History Table */}
        {userData.mockHistory.length > 0 && (
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <h3 className={`font-display text-base font-bold flex items-center gap-2 ${textPrimary}`}>
              <TrendingUp className="w-5 h-5 text-[#FF7900]" />
              <span>{lang === 'en' ? 'Your Completed Mock Test Attempts' : 'आपके दिए गए मॉक टेस्ट परिणाम'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className={`border-b ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>
                  <tr>
                    <th className="px-4 py-2.5 font-medium">{lang === 'en' ? 'Test Name' : 'टेस्ट का नाम'}</th>
                    <th className="px-4 py-2.5 font-medium">{lang === 'en' ? 'Date' : 'दिनांक'}</th>
                    <th className="px-4 py-2.5 font-medium text-center">{lang === 'en' ? 'Raw Score' : 'रॉ स्कोर'}</th>
                    <th className="px-4 py-2.5 font-medium text-center">{lang === 'en' ? 'Accuracy' : 'सटीकता'}</th>
                    <th className="px-4 py-2.5 font-medium text-center">{lang === 'en' ? 'Correct / Wrong' : 'सही / गलत'}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                  {userData.mockHistory.map((m) => (
                    <tr key={m.id} className={isDark ? 'hover:bg-zinc-800/30' : 'hover:bg-zinc-50'}>
                      <td className={`px-4 py-3 font-semibold ${textPrimary}`}>
                        {lang === 'en' ? m.testTitleEn : m.testTitleHi}
                      </td>
                      <td className={`px-4 py-3 font-mono ${textSecondary}`}>
                        {new Date(m.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-[#FF7900]">
                        {m.rawScore.toFixed(2)} / {m.totalQuestions}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-emerald-400">
                        {m.accuracy}%
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span className="text-emerald-400 font-bold">+{m.correct}</span> / <span className="text-rose-400 font-bold">-{m.incorrect}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ACTIVE TEST SCREEN
  if (isTestActive && currentQ) {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const isLowTime = remainingSeconds < 300; // under 5 mins

    return (
      <div className="space-y-4">
        {/* Test Engine Top Bar */}
        <div className={`p-3 px-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 shadow-sm ${cardBg}`}>
          <div>
            <span className={`text-xs font-semibold block ${textPrimary}`}>
              {lang === 'en' ? selectedConfig?.titleEn : selectedConfig?.titleHi}
            </span>
            <span className={`text-[11px] ${textSecondary}`}>
              {lang === 'en' ? `Question ${currentIndex + 1} of ${questions.length}` : `प्रश्न ${currentIndex + 1} / ${questions.length}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Countdown Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs sm:text-sm font-bold ${
              isLowTime 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                : isDark ? 'bg-zinc-800 text-[#FF7900]' : 'bg-zinc-100 text-[#FF7900]'
            }`}>
              <Clock className="w-4 h-4" />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-1.5 bg-[#FF7900] hover:bg-[#FF7900]/90 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              {lang === 'en' ? 'Submit Test' : 'सबमिट करें'}
            </button>
          </div>
        </div>

        {/* Question + Palette Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Main Question Panel (8 Cols) */}
          <div className={`lg:col-span-8 p-6 rounded-2xl border space-y-6 ${cardBg}`}>
            {/* Question Header & Meta */}
            <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FF7900]/15 text-[#FF7900]">
                  {lang === 'en' ? currentQ.subjectNameEn : currentQ.subjectNameHi}
                </span>
                <span className="text-zinc-600">·</span>
                <span className={`text-xs ${textSecondary}`}>
                  {lang === 'en' ? currentQ.topicEn : currentQ.topicHi}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-500 font-bold">+1.00</span>
                <span className="text-zinc-600">/</span>
                <span className="text-rose-500 font-bold">-0.25</span>
                
                <button
                  onClick={() => toggleBookmark(currentQ.id)}
                  className="p-1 text-zinc-400 hover:text-[#FF7900] transition-colors"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      userData.bookmarkedQuestionIds.includes(currentQ.id)
                        ? 'fill-[#FF7900] text-[#FF7900]'
                        : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* If question has special Data Interpretation (Chart, Table or Passage) */}
            {currentQ.hasDataInterpretation && currentQ.tableOrChartData && (
              <div className={`p-4 rounded-xl border space-y-2 ${innerCardBg}`}>
                <span className="text-xs font-bold text-[#FF7900] block">
                  {lang === 'en' ? currentQ.tableOrChartData.titleEn : currentQ.tableOrChartData.titleHi}
                </span>
                <div className={`text-xs font-mono p-3 rounded border leading-relaxed whitespace-pre-wrap ${
                  isDark ? 'bg-black/40 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-800'
                }`}>
                  {currentQ.tableOrChartData.content}
                </div>
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-1">
              <p className={`text-base font-semibold leading-relaxed ${textPrimary}`}>
                Q{currentIndex + 1}. {lang === 'en' ? currentQ.questionEn : currentQ.questionHi}
              </p>
              {lang === 'hi' && currentQ.questionEn && (
                <p className={`text-xs italic ${textSecondary}`}>
                  {currentQ.questionEn}
                </p>
              )}
            </div>

            {/* 4 Options */}
            <div className="space-y-2.5">
              {(lang === 'en' ? currentQ.optionsEn : currentQ.optionsHi).map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FF7900]/15 border-[#FF7900] ring-1 ring-[#FF7900] text-[#FF7900] font-semibold'
                        : isDark
                        ? 'bg-[#222227] border-[#2E2E35] hover:border-zinc-600 text-zinc-200'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                        isSelected
                          ? 'bg-[#FF7900] text-white'
                          : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-xs leading-relaxed">{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearResponse}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors disabled:opacity-40 ${
                    isDark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {lang === 'en' ? 'Clear Response' : 'उत्तर हटाएं'}
                </button>

                <button
                  onClick={handleToggleReview}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    markedForReview[currentIndex]
                      ? 'bg-purple-950/40 border-purple-600 text-purple-300 font-bold'
                      : isDark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Mark for Review' : 'समीक्षा हेतु चिन्हित'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToQuestion(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1 ${
                    isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Previous' : 'पिछला'}</span>
                </button>

                <button
                  onClick={() => goToQuestion(currentIndex + 1)}
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#FF7900] hover:bg-[#FF7900]/90 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1 shadow-sm"
                >
                  <span>{lang === 'en' ? 'Save & Next' : 'सेव एवं आगे बढ़ें'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette (4 Cols) */}
          <div className={`lg:col-span-4 p-5 rounded-2xl border space-y-4 ${cardBg}`}>
            <h4 className={`text-sm font-bold border-b pb-2 ${isDark ? 'border-zinc-800 text-[#F5F5F7]' : 'border-zinc-100 text-zinc-900'}`}>
              {lang === 'en' ? 'Question Palette' : 'प्रश्न तालिका'}
            </h4>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px]">✓</span>
                <span className={textSecondary}>{lang === 'en' ? `Answered (${answeredCount})` : `उत्तर दिया (${answeredCount})`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[9px]">★</span>
                <span className={textSecondary}>{lang === 'en' ? `Review (${reviewCount})` : `रिव्यू (${reviewCount})`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#FF7900] text-white font-bold flex items-center justify-center text-[9px]">•</span>
                <span className={textSecondary}>{lang === 'en' ? 'Not Answered' : 'अनुत्तरित'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-3.5 h-3.5 rounded ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'} font-bold flex items-center justify-center text-[9px]`} />
                <span className={textSecondary}>{lang === 'en' ? 'Not Visited' : 'नहीं देखा'}</span>
              </div>
            </div>

            {/* Palette Buttons Grid */}
            <div className="grid grid-cols-5 gap-1.5 pt-2 max-h-[380px] overflow-y-auto pr-1">
              {questions.map((_, idx) => {
                const isSelected = selectedAnswers[idx] !== undefined;
                const isReview = markedForReview[idx];
                const isCurrent = currentIndex === idx;
                const isSeen = visited[idx];

                let bgClass = isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600';
                if (isReview) {
                  bgClass = 'bg-purple-600 text-white';
                } else if (isSelected) {
                  bgClass = 'bg-emerald-600 text-white';
                } else if (isSeen) {
                  bgClass = 'bg-[#FF7900] text-white';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`h-8 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center ${bgClass} ${
                      isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className={`pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full py-2.5 bg-[#FF7900] hover:bg-[#FF7900]/90 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                {lang === 'en' ? 'Submit Test Now' : 'टेस्ट सबमिट करें'}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-md w-full p-6 shadow-xl border space-y-4 ${cardBg}`}>
              <h3 className={`font-display text-lg font-bold ${textPrimary}`}>
                {lang === 'en' ? 'Confirm Test Submission' : 'क्या आप टेस्ट सबमिट करना चाहते हैं?'}
              </h3>

              <div className="space-y-2 py-2 text-xs">
                <div className={`flex justify-between p-2.5 rounded-lg ${innerCardBg}`}>
                  <span className={textSecondary}>{lang === 'en' ? 'Total Questions' : 'कुल प्रश्न'}:</span>
                  <span className={`font-mono font-bold ${textPrimary}`}>{questions.length}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                  <span>{lang === 'en' ? 'Answered' : 'उत्तर दिए गए'}:</span>
                  <span className="font-mono font-bold">{answeredCount}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-purple-500/15 text-purple-400">
                  <span>{lang === 'en' ? 'Marked for Review' : 'समीक्षा हेतु चिन्हित'}:</span>
                  <span className="font-mono font-bold">{reviewCount}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-rose-500/15 text-rose-400">
                  <span>{lang === 'en' ? 'Unanswered' : 'छूटे हुए (0 अंक)'}:</span>
                  <span className="font-mono font-bold">{unansweredCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {lang === 'en' ? 'Back to Test' : 'वापस टेस्ट पर जाएं'}
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF7900] hover:bg-[#FF7900]/90 rounded-lg transition-colors"
                >
                  {lang === 'en' ? 'Confirm & Finish' : 'सबमिट करें'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. DETAILED RESULT SCREEN
  if (isResultMode && lastResult) {
    const projectedPercentile =
      lastResult.rawScore >= 75
        ? '98.80%'
        : lastResult.rawScore >= 68
        ? '94.50%'
        : lastResult.rawScore >= 55
        ? '85.00%'
        : '68.00%';

    const displayedQuestions =
      filterReviewMode === 'incorrect'
        ? questions.filter((q) => lastResult.incorrectQuestionIds.includes(q.id))
        : questions;

    return (
      <div className="space-y-6">
        {/* Scorecard Hero */}
        <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${cardBg}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#FF7900] uppercase tracking-wider block">
                {lang === 'en' ? 'TEST RESULT EVALUATION' : 'मॉक टेस्ट परिणाम मूल्यांकन'}
              </span>
              <h2 className={`font-display text-2xl sm:text-3xl font-extrabold ${textPrimary}`}>
                {lang === 'en' ? lastResult.testTitleEn : lastResult.testTitleHi}
              </h2>
              <p className={`text-xs ${textSecondary}`}>
                Formula: (Correct × 1.00) − (Incorrect × 0.25). Unanswered receive 0 marks.
              </p>
            </div>

            {/* Net Score Pill */}
            <div className={`p-4 rounded-xl border flex items-center gap-6 ${innerCardBg}`}>
              <div>
                <span className={`text-[11px] block ${textSecondary}`}>{lang === 'en' ? 'Net Raw Score' : 'अंतिम रॉ स्कोर'}</span>
                <span className="font-display text-3xl font-extrabold text-[#FF7900] tabular-nums">
                  {lastResult.rawScore.toFixed(2)}
                </span>
                <span className={`text-xs ${textSecondary}`}> / {lastResult.totalQuestions}</span>
              </div>
              <div className={`h-10 w-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
              <div>
                <span className={`text-[11px] block ${textSecondary}`}>{lang === 'en' ? 'Estimated Percentile' : 'अनुमानित पर्सेंटाइल'}</span>
                <span className="font-display text-2xl font-bold text-emerald-400 tabular-nums">
                  {projectedPercentile}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t text-xs ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <div className={`p-3 rounded-xl border ${innerCardBg}`}>
              <span className={`block ${textSecondary}`}>{lang === 'en' ? 'Accuracy Rate' : 'सटीकता दर'}</span>
              <span className="font-mono text-lg font-bold text-emerald-400">{lastResult.accuracy}%</span>
            </div>
            <div className={`p-3 rounded-xl border ${innerCardBg}`}>
              <span className={`block ${textSecondary}`}>{lang === 'en' ? 'Correct Answers' : 'सही उत्तर'}</span>
              <span className="font-mono text-lg font-bold text-emerald-400">+{lastResult.correct}</span>
            </div>
            <div className={`p-3 rounded-xl border ${innerCardBg}`}>
              <span className={`block ${textSecondary}`}>{lang === 'en' ? 'Incorrect Answers' : 'गलत (-0.25 कटौती)'}</span>
              <span className="font-mono text-lg font-bold text-rose-400">-{lastResult.incorrect}</span>
            </div>
            <div className={`p-3 rounded-xl border ${innerCardBg}`}>
              <span className={`block ${textSecondary}`}>{lang === 'en' ? 'Time Spent' : 'लिया गया समय'}</span>
              <span className={`font-mono text-lg font-bold ${textPrimary}`}>
                {Math.floor(lastResult.timeTakenSeconds / 60)}m {lastResult.timeTakenSeconds % 60}s
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Action Bar */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterReviewMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterReviewMode === 'all'
                  ? 'bg-[#FF7900] text-white'
                  : isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {lang === 'en' ? `All Questions (${questions.length})` : `सभी प्रश्न (${questions.length})`}
            </button>
            <button
              onClick={() => setFilterReviewMode('incorrect')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterReviewMode === 'incorrect'
                  ? 'bg-rose-600 text-white'
                  : isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {lang === 'en' ? `Incorrect Only (${lastResult.incorrect})` : `केवल गलत प्रश्न (${lastResult.incorrect})`}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedConfig && (
              <button
                onClick={() => handleStartTest(selectedConfig)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  isDark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Retry Test' : 'पुनः टेस्ट दें'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsResultMode(false);
                setSelectedConfig(null);
              }}
              className="px-4 py-1.5 bg-[#FF7900] hover:bg-[#FF7900]/90 text-white text-xs font-bold rounded-lg transition-colors"
            >
              {lang === 'en' ? 'Back to Test Hub' : 'टेस्ट सूची पर वापस'}
            </button>
          </div>
        </div>

        {/* Detailed Solutions */}
        <div className="space-y-4">
          <h3 className={`font-display text-base font-bold ${textPrimary}`}>
            {lang === 'en' ? 'Question-by-Question Detailed Review & Answer Key' : 'विस्तृत प्रश्न समीक्षा एवं उत्तर कुंजी'}
          </h3>

          {displayedQuestions.map((q) => {
            const originalIndex = questions.findIndex((item) => item.id === q.id);
            const userChoice = selectedAnswers[originalIndex];
            const isCorrect = userChoice === q.correctIndex;
            const isUnanswered = userChoice === undefined;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border space-y-4 ${cardBg} ${
                  isCorrect
                    ? 'border-emerald-500/40'
                    : isUnanswered
                    ? isDark ? 'border-zinc-800' : 'border-zinc-200'
                    : 'border-rose-500/40'
                }`}
              >
                <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#FF7900]">Q{originalIndex + 1}.</span>
                    <span className={`font-medium ${textPrimary}`}>
                      {lang === 'en' ? q.subjectNameEn : q.subjectNameHi}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className={textSecondary}>{lang === 'en' ? q.topicEn : q.topicHi}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>+1.00 {lang === 'en' ? 'Correct' : 'सही'}</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>
                        0.00 {lang === 'en' ? 'Unanswered' : 'अनुत्तरित'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>-0.25 {lang === 'en' ? 'Incorrect' : 'गलत'}</span>
                      </span>
                    )}

                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className="p-1 text-zinc-400 hover:text-[#FF7900] transition-colors"
                      title="Bookmark Question"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          userData.bookmarkedQuestionIds.includes(q.id)
                            ? 'fill-[#FF7900] text-[#FF7900]'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className={`text-sm font-semibold leading-relaxed ${textPrimary}`}>
                  {lang === 'en' ? q.questionEn : q.questionHi}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(lang === 'en' ? q.optionsEn : q.optionsHi).map((opt, oIdx) => {
                    const isRightOption = oIdx === q.correctIndex;
                    const isUserPick = userChoice === oIdx;

                    let optStyle = innerCardBg;
                    if (isRightOption) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isUserPick && !isRightOption) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-medium line-through';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-lg border flex items-center gap-2 ${optStyle}`}
                      >
                        <span className="font-mono font-bold shrink-0">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span>{opt}</span>
                        {isRightOption && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                        )}
                        {isUserPick && !isRightOption && (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 ml-auto shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  isDark ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-[#FF7900]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Official Explanation:' : 'विस्तृत व्याख्या एवं तथ्य:'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {lang === 'en' ? q.explanationEn : q.explanationHi}
                  </p>
                  <span className="text-[10px] text-zinc-400 block pt-1">
                    Source: {q.sourceType} ({q.sourceDetail})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
