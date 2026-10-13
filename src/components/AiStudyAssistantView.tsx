import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  BookOpen, 
  Calendar, 
  Award, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { UserStudyData } from '../data/storage';
import { PET_SUBJECTS } from '../data/petData';

interface AiStudyAssistantViewProps {
  userData: UserStudyData;
  lang: 'en' | 'hi';
}

interface GeneratedQuizQuestion {
  questionHi: string;
  questionEn?: string;
  optionsHi: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanationHi: string;
  difficulty: string;
}

export const AiStudyAssistantView: React.FC<AiStudyAssistantViewProps> = ({
  userData,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'ask' | 'quiz' | 'plan' | 'analyze'>('ask');

  // Tab 1: Doubt Solver state
  const [userQuery, setUserQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('history');
  const [isLoadingAsk, setIsLoadingAsk] = useState(false);
  const [askResponse, setAskResponse] = useState<string | null>(null);

  // Tab 2: Quiz Generator state
  const [quizTopic, setQuizTopic] = useState('भारतीय संविधान - मौलिक अधिकार');
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuizQuestion[]>([]);
  const [quizUserAnswers, setQuizUserAnswers] = useState<Record<number, number>>({});
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});

  // Tab 3: Study Plan Generator state
  const [planDaysLeft, setPlanDaysLeft] = useState(45);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  // 1. Submit Question to Server AI
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsLoadingAsk(true);
    setAskResponse(null);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          subject: selectedSubject,
        }),
      });
      const data = await res.json();
      setAskResponse(data.answer || 'उत्तर उपलब्ध नहीं है।');
    } catch (err) {
      setAskResponse('सर्वर से संपर्क करने में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoadingAsk(false);
    }
  };

  // 2. Generate Custom Practice Quiz
  const handleGenerateQuiz = async () => {
    setIsLoadingQuiz(true);
    setGeneratedQuestions([]);
    setQuizUserAnswers({});
    setQuizRevealed({});

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          subject: selectedSubject,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // 3. Generate Personalized Plan
  const handleGeneratePlan = async () => {
    setIsLoadingPlan(true);
    setGeneratedPlan(null);

    const weakSubjects = userData.mistakeQuestionIds.length > 0
      ? ['ग्राफ व्याख्या (DI)', 'भारतीय राष्ट्रीय आन्दोलन', 'सामान्य विज्ञान']
      : ['सामान्य अध्ययन कोर', 'तालिका व्याख्या', 'करेंट अफेयर्स'];

    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakSubjects,
          targetHours: userData.dailyTargetHours,
          daysLeft: planDaysLeft,
        }),
      });
      const data = await res.json();
      setGeneratedPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Assistant Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-emerald-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                UPSSSC PET AI MENTOR
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'en' ? 'AI Study Assistant & Doubt Solver' : 'एआई स्टडी साथी एवं संशय निवारण'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'en'
                ? 'Get crystal-clear explanations in simple Hindi, generate custom mock quizzes, and receive customized study timetables.'
                : 'कठिन प्रश्नों की सरल हिन्दी व्याख्या, मनचाहे टॉपिक पर लाइव क्विज और व्यक्तिगत अध्ययन योजना प्राप्त करें।'}
            </p>
          </div>
        </div>

        {/* Feature Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'ask' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Doubt Solver' : 'संशय समाधान (Doubt Solver)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Topic Quiz Generator' : 'टॉपिक क्विज जनरेटर'}</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'plan' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'AI Study Plan' : 'एआई स्टडी प्लान'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DOUBT SOLVER & EXPLAINER */}
      {activeTab === 'ask' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">
              {lang === 'en' ? 'Ask Any Exam Doubt or Concept' : 'कोई भी संशय या कठिन टॉपिक पूछें'}
            </h3>

            {/* Quick Prompt Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 shrink-0 font-medium">{lang === 'en' ? 'Sample Questions:' : 'उदाहरण प्रश्न:'}</span>
              {[
                'कलिंग युद्ध का वर्ष और अशोक के शिलालेख',
                'अनुच्छेद 32 और सर्वोच्च न्यायालय की 5 रिटें',
                'ग्राफ में प्रतिशत वृद्धि हल करने का शॉर्टकट',
                'यण संधि और गुण संधि में क्या अंतर है?'
              ].map((sample, i) => (
                <button
                  key={i}
                  onClick={() => setUserQuery(sample)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
                >
                  {sample}
                </button>
              ))}
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="sm:w-56 py-2 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-700"
                >
                  {PET_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === 'en' ? s.nameEn : s.nameHi}
                    </option>
                  ))}
                </select>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Type your doubt (e.g. How to identify Yan Sandhi?)...' : 'अपना सवाल यहाँ टाइप करें (जैसे: 1935 के भारत शासन अधिनियम के मुख्य बिंदु क्या थे?)...'}
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full py-2.5 pl-3 pr-24 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoadingAsk || !userQuery.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <span>{isLoadingAsk ? 'सोच रहे हैं...' : 'पूछें'}</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* AI Response Display */}
          {askResponse && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'en' ? 'Mentor Explanation:' : 'स्टडी साथी समाधान एवं व्याख्या:'}</span>
              </div>
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {askResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TOPIC QUIZ GENERATOR */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">
              {lang === 'en' ? 'Generate Topic-Wise Practice Quiz' : 'मनचाहे टॉपिक पर तुरंत 3 अभ्यास प्रश्न बनाएं'}
            </h3>
            <p className="text-xs text-slate-600">
              {lang === 'en'
                ? 'Enter any PET topic and our AI question generator will produce 3 fresh multiple-choice questions with answer keys.'
                : 'विषय का नाम दर्ज करें और आधिकारिक एनसीईआरटी पैटर्न पर नए प्रश्न प्राप्त करें।'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={lang === 'en' ? 'Enter topic (e.g. Indus Valley, GST, Indian Rivers)...' : 'टॉपिक दर्ज करें (जैसे: सिन्धु घाटी, भारत की नदियां, GST)...'}
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="flex-1 py-2 px-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleGenerateQuiz}
                disabled={isLoadingQuiz || !quizTopic.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoadingQuiz ? 'प्रश्न तैयार हो रहे हैं...' : 'क्विज बनाएं (Generate Quiz)'}</span>
              </button>
            </div>
          </div>

          {/* Generated Questions List */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-display text-sm font-bold text-slate-900">
                {lang === 'en' ? `Practice Questions on: ${quizTopic}` : `${quizTopic} पर अभ्यास प्रश्न`}
              </h4>

              {generatedQuestions.map((q, idx) => {
                const userPick = quizUserAnswers[idx];
                const isRevealed = quizRevealed[idx];

                return (
                  <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      Q{idx + 1}. {q.questionHi}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.optionsHi.map((opt, oIdx) => {
                        const isRight = oIdx === q.correctIndex;
                        const isPicked = userPick === oIdx;

                        let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                        if (isRevealed) {
                          if (isRight) {
                            style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                          } else if (isPicked && !isRight) {
                            style = 'bg-rose-50 border-rose-400 text-rose-950 font-medium line-through';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              setQuizUserAnswers((prev) => ({ ...prev, [idx]: oIdx }));
                              setQuizRevealed((prev) => ({ ...prev, [idx]: true }));
                            }}
                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-all ${style}`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isRevealed && isRight && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {isRevealed && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {isRevealed && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950">
                        <span className="font-bold block mb-0.5">व्याख्या:</span>
                        <p>{q.explanationHi}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PERSONALIZED STUDY PLAN */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">
              {lang === 'en' ? 'Generate 7-Day Customized Study Roadmap' : '7-दिवसीय कस्टमाइज्ड स्टडी टाइमटेबल बनाएं'}
            </h3>
            <p className="text-xs text-slate-600">
              {lang === 'en'
                ? 'AI analyzes your study targets and automatically builds an hour-by-hour roadmap.'
                : 'एआई आपकी दैनिक अध्ययन क्षमता और कमजोर विषयों के अनुसार 7 दिनों की वैज्ञानिक समय सारिणी तैयार करता है।'}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  {lang === 'en' ? 'Days left for Exam:' : 'परीक्षा में शेष दिन:'}
                </span>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={planDaysLeft}
                  onChange={(e) => setPlanDaysLeft(Number(e.target.value))}
                  className="py-1.5 px-3 text-xs border border-slate-200 rounded-lg font-mono w-28"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  {lang === 'en' ? 'Daily Study Capacity:' : 'दैनिक अध्ययन क्षमता:'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {userData.dailyTargetHours} Hours / Day
                </span>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleGeneratePlan}
                  disabled={isLoadingPlan}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isLoadingPlan ? 'योजना तैयार हो रही है...' : 'स्टडी प्लान जनरेट करें'}</span>
                </button>
              </div>
            </div>
          </div>

          {generatedPlan && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'en' ? 'Your Tailored 7-Day Timetable:' : 'आपकी व्यक्तिगत 7-दिवसीय समय-सारिणी:'}</span>
              </div>
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {generatedPlan}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
