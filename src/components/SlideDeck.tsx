import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  BarChart3, 
  Clock, 
  Award, 
  HelpCircle,
  Lightbulb,
  Sparkles,
  BookOpen,
  TrendingUp,
  Target
} from 'lucide-react';
import { SLIDES_DATA, PET_SUBJECTS, POST_CUTOFFS, SlideContent } from '../data/petData';

interface SlideDeckProps {
  lang: 'en' | 'hi';
  onNavigateToSyllabus?: () => void;
  onNavigateToCalculator?: () => void;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ lang, onNavigateToSyllabus, onNavigateToCalculator }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [selectedGsSubject, setSelectedGsSubject] = useState<'history' | 'inm' | 'geography' | 'economy' | 'polity'>('history');
  const [selectedMegaSection, setSelectedMegaSection] = useState<'di' | 'passage'>('di');
  const [selectedStaticTopic, setSelectedStaticTopic] = useState<'orgs' | 'dances' | 'borders'>('orgs');
  
  // Interactive mini-simulator on Slide 2
  const [simAttempts, setSimAttempts] = useState(88);
  const [simWrong, setSimWrong] = useState(8);

  const currentSlide: SlideContent = SLIDES_DATA[currentSlideIndex];
  const totalSlides = SLIDES_DATA.length;

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autoplay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        nextSlide();
      }, 9000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSlideIndex]);

  // Negative marking calculations on Slide 2
  const simRight = simAttempts - simWrong;
  const simGrossScore = simRight * 1.0;
  const simNegativeDeduction = simWrong * 0.25;
  const simNetScore = Math.max(0, simGrossScore - simNegativeDeduction);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Slide Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {lang === 'en' ? 'Slide' : 'स्लाइड'}
          </span>
          <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
            {currentSlideIndex + 1} <span className="text-slate-400">/</span> {totalSlides}
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-xs font-medium text-slate-600 truncate max-w-[200px] sm:max-w-xs hidden sm:inline">
            {lang === 'en' ? currentSlide.titleEn : currentSlide.titleHi}
          </span>
        </div>

        {/* Slide Thumbnail Dots / Stepper */}
        <div className="hidden lg:flex items-center gap-1.5">
          {SLIDES_DATA.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlideIndex
                  ? 'w-7 bg-amber-600'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`${slide.id}. ${lang === 'en' ? slide.titleEn : slide.titleHi}`}
            />
          ))}
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              showNotes ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Speaker & Teaching Notes"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Teaching Notes' : 'शिक्षक नोट्स'}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={isPlaying ? 'Pause Auto-advance' : 'Auto-advance Slides (9s)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={prevSlide}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
            title="Previous Slide (← Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextSlide}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            title="Next Slide (→ Arrow or Space)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[580px] flex flex-col justify-between">
        {/* Top Header of the Slide */}
        <div className="px-6 sm:px-10 pt-8 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              {lang === 'en' ? currentSlide.taglineEn : currentSlide.taglineHi}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentSlide.badge} · {lang === 'en' ? `Module ${currentSlideIndex + 1}` : `मॉड्यूल ${currentSlideIndex + 1}`}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            {lang === 'en' ? currentSlide.titleEn : currentSlide.titleHi}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {lang === 'en' ? currentSlide.subtitleEn : currentSlide.subtitleHi}
          </p>
        </div>

        {/* Dynamic Slide Body Content */}
        <div className="px-6 sm:px-10 py-6 flex-1 overflow-y-auto">
          {/* SLIDE 1: INTRO */}
          {currentSlide.type === 'intro' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Hero Photo Card */}
                <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-slate-200 min-h-[220px] bg-slate-100">
                  <img
                    src="/src/assets/images/pet_exam_study_hero_1791899626491.jpg"
                    alt="UPSSSC PET Exam Preparation Desk"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback in case of image load delay
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-xs font-semibold text-amber-400">UPSSSC PET Exam 2026</span>
                    <p className="text-xs text-slate-200 mt-0.5">
                      {lang === 'en'
                        ? 'Preliminary Eligibility Test for UP Government Recruitment'
                        : 'उत्तर प्रदेश सरकार की भर्तियों हेतु प्रारम्भिक अर्हकारी परीक्षा'}
                    </p>
                  </div>
                </div>

                {/* 4 Key Stats */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-3">
                  {currentSlide.keyStats?.map((stat, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        {lang === 'en' ? stat.labelEn : stat.labelHi}
                      </span>
                      <div className="my-1">
                        <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                          {stat.value}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {lang === 'en' ? stat.hintEn : stat.hintHi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {currentSlide.bulletPoints?.map((bp, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="text-sm font-semibold text-slate-900">
                        {lang === 'en' ? bp.titleEn : bp.titleHi}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'en' ? bp.descEn : bp.descHi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 2: EXAM PATTERN & NEGATIVE MARKING CALCULATOR */}
          {currentSlide.type === 'pattern' && (
            <div className="space-y-6">
              {/* Interactive Negative Marking Live Simulator Widget */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-semibold text-white">
                      {lang === 'en' ? 'Live Negative Marking Impact Simulation' : 'नेगेटिव मार्किंग प्रभाव सिम्युलेटर'}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    Formula: Net Score = (Correct × 1.00) − (Incorrect × 0.25)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Sliders */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-300">
                          {lang === 'en' ? 'Questions Attempted:' : 'हल किए गए प्रश्न:'}
                        </span>
                        <span className="font-mono text-amber-400 font-bold tabular-nums">
                          {simAttempts} / 100
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={simAttempts}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSimAttempts(val);
                          if (simWrong > val) setSimWrong(val);
                        }}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-300">
                          {lang === 'en' ? 'Incorrect Answers (Errors):' : 'गलत उत्तर (त्रुटियाँ):'}
                        </span>
                        <span className="font-mono text-red-400 font-bold tabular-nums">
                          {simWrong} (Penalty: -{(simWrong * 0.25).toFixed(2)})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={simAttempts}
                        value={simWrong}
                        onChange={(e) => setSimWrong(Number(e.target.value))}
                        className="w-full accent-red-500"
                      />
                    </div>
                  </div>

                  {/* Calculated Metric Box */}
                  <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{lang === 'en' ? 'Correct Answers' : 'सही उत्तर'}</span>
                      <span className="text-emerald-400 font-mono font-bold tabular-nums">+{simRight}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{lang === 'en' ? 'Negative Deduction' : 'नेगेटिव कटौती'}</span>
                      <span className="text-red-400 font-mono font-bold tabular-nums">-{simNegativeDeduction.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                      <span className="text-xs font-semibold text-slate-200">
                        {lang === 'en' ? 'Projected Raw Score' : 'अंतिम रॉ स्कोर'}
                      </span>
                      <span className="font-display text-2xl font-extrabold text-amber-400 tabular-nums">
                        {simNetScore.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 italic">
                      {simNetScore >= 75
                        ? (lang === 'en' ? '★ Safe zone for Lekhpal, VDO & all top calls' : '★ लेखपाल व वी.डी.ओ. मुख्य परीक्षा हेतु सुरक्षित')
                        : simNetScore >= 65
                        ? (lang === 'en' ? 'Moderate zone (Junior Assistant / Forest Guard)' : 'मध्यम स्थिति (कनिष्ठ सहायक व वन रक्षक योग्य)')
                        : (lang === 'en' ? 'Risk zone: May miss top group C vacancies' : 'जोखिम क्षेत्र: मुख्य परीक्षाओं में बुलावा संदिग्ध')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Strategic Rules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSlide.bulletPoints?.map((bp, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      {lang === 'en' ? bp.titleEn : bp.titleHi}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'en' ? bp.descEn : bp.descHi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 3: 15-SECTION MARKS WEIGHTAGE RADAR */}
          {currentSlide.type === 'weightage' && (
            <div className="space-y-6">
              {/* Visual 50:25:25 Tier Breakdown Bar */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{lang === 'en' ? 'Paper Composition (Total 100 Marks)' : 'संपूर्ण प्रश्नपत्र संरचना (कुल 100 अंक)'}</span>
                  <span className="text-amber-700">100 Questions = 100 Marks</span>
                </div>
                
                {/* Segmented bar */}
                <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-200">
                  <div className="h-full bg-amber-600 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '50%' }}>
                    50% High Yield (5 Subjects)
                  </div>
                  <div className="h-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '25%' }}>
                    25% GS Core (5 Subj)
                  </div>
                  <div className="h-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '25%' }}>
                    25% Aptitude & Lang (5 Subj)
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    <span>{lang === 'en' ? 'High-Yield Block: DI (20) + Passages (10) + CA/GK (20)' : 'हाई-यील्ड: डीआई (20) + गद्यांश (10) + करेंट/जीके (20)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>{lang === 'en' ? 'GS Core: History, INM, Geo, Eco, Polity (5 ea)' : 'जीएस कोर: इतिहास, आंदोलन, भूगोल, अर्थ, संविधान (5 प्रत्येक)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>{lang === 'en' ? 'Skill & Language: Math, Hindi, Eng, Reason, Sci (5 ea)' : 'कौशल/भाषा: गणित, हिन्दी, अंग्रेजी, तर्क, विज्ञान (5 प्रत्येक)'}</span>
                  </div>
                </div>
              </div>

              {/* 15 Subjects Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {PET_SUBJECTS.map((sub) => (
                  <div
                    key={sub.id}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      sub.highYield
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                        : sub.category === 'gs'
                        ? 'bg-blue-50/40 border-blue-200'
                        : 'bg-emerald-50/40 border-emerald-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          sub.highYield ? 'text-amber-700' : 'text-slate-500'
                        }`}>
                          {sub.category === 'high_yield' ? 'High Yield' : sub.category.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                          {sub.marks}M
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {lang === 'en' ? sub.nameEn : sub.nameHi}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-2 truncate">
                      {sub.questionCount} {lang === 'en' ? 'Questions' : 'प्रश्न'}
                    </span>
                  </div>
                ))}
              </div>

              {onNavigateToSyllabus && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={onNavigateToSyllabus}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    <span>{lang === 'en' ? 'Explore Full Syllabus & Checklist →' : 'विस्तृत पाठ्यक्रम व चेकलिस्ट देखें →'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 4: GS DEEP DIVE (25 MARKS) */}
          {currentSlide.type === 'gs_deepdive' && (
            <div className="space-y-4">
              {/* Interactive Subject Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(['history', 'inm', 'geography', 'economy', 'polity'] as const).map((subjectKey) => {
                  const sub = PET_SUBJECTS.find((s) => s.id === subjectKey)!;
                  return (
                    <button
                      key={subjectKey}
                      onClick={() => setSelectedGsSubject(subjectKey)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        selectedGsSubject === subjectKey
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lang === 'en' ? sub.nameEn : sub.nameHi} (5M)
                    </button>
                  );
                })}
              </div>

              {/* Active Subject Detail */}
              {(() => {
                const active = PET_SUBJECTS.find((s) => s.id === selectedGsSubject)!;
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {lang === 'en' ? active.nameEn : active.nameHi}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {lang === 'en' ? active.descriptionEn : active.descriptionHi}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          5 Questions = 5 Marks
                        </span>
                      </div>
                    </div>

                    {/* Official Topics */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        {lang === 'en' ? 'Official Syllabus Topics (NCERT Bound)' : 'आधिकारिक पाठ्यक्रम के विषय (एनसीईआरटी आधारित)'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(lang === 'en' ? active.topicsEn : active.topicsHi).map((t, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-amber-600 font-bold shrink-0">•</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Exam Tip */}
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900">
                        <span className="font-bold">{lang === 'en' ? 'High-Yield Tip: ' : 'महत्वपूर्ण परीक्षा टिप: '}</span>
                        <span>{lang === 'en' ? active.keyTipsEn : active.keyTipsHi}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SLIDE 5: APTITUDE, SCIENCE & LANGUAGES (25 MARKS) */}
          {currentSlide.type === 'aptitude_deepdive' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentSlide.bulletPoints?.map((bp, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {lang === 'en' ? bp.titleEn : bp.titleHi}
                        </h4>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          5 Marks
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lang === 'en' ? bp.descEn : bp.descHi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scoring Insight */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-950 font-medium">
                    {lang === 'en'
                      ? 'Unlike GS where syllabus is boundless, these 5 sections have finite patterns. Aim for 22+ out of 25 here.'
                      : 'जीएस की तुलना में इन 5 विषयों के नियम निश्चित हैं। यहाँ 25 में से 22+ अंक अर्जित करना अत्यंत आसान है।'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: MEGA HIGH YIELD SECTIONS (30 MARKS) */}
          {currentSlide.type === 'mega_sections' && (
            <div className="space-y-4">
              {/* Toggle DI vs Passages */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg max-w-md">
                <button
                  onClick={() => setSelectedMegaSection('di')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    selectedMegaSection === 'di' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'Data Interpretation (20 Marks)' : 'आंकड़ा व्याख्या / DI (20 अंक)'}
                </button>
                <button
                  onClick={() => setSelectedMegaSection('passage')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    selectedMegaSection === 'passage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'Hindi Passages (10 Marks)' : 'हिन्दी गद्यांश (10 अंक)'}
                </button>
              </div>

              {selectedMegaSection === 'di' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  {/* Sample DI Chart Demonstration */}
                  <div className="lg:col-span-5 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-amber-400">Sample Line Graph / Bar Chart</span>
                        <span className="text-[11px] text-slate-400">Production (in Lakhs)</span>
                      </div>
                      
                      {/* Mini visual mockup bar */}
                      <div className="space-y-2 py-2">
                        {[
                          { year: '2020', val: 320, pct: '50%' },
                          { year: '2021', val: 400, pct: '65%' },
                          { year: '2022', val: 520, pct: '85%' },
                          { year: '2023', val: 610, pct: '100%' },
                        ].map((d, i) => (
                          <div key={i} className="space-y-0.5">
                            <div className="flex justify-between text-[11px] text-slate-300">
                              <span>Year {d.year}</span>
                              <span className="font-mono">{d.val} Lakhs</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: d.pct }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                      <p className="font-semibold text-amber-300 mb-0.5">3 Classic UPSSSC Questions:</p>
                      <p>1. Percentage growth 2021 to 2022 = ((520-400)/400)*100 = 30%</p>
                      <p>2. Ratio of 2020 to 2023 production = 320 : 610 = 32:61</p>
                      <p>3. Average annual output = (320+400+520+610)/4 = 462.5</p>
                    </div>
                  </div>

                  {/* Strategy & Daily Drill for DI */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <h4 className="text-sm font-bold text-amber-950 mb-1">
                        {lang === 'en' ? 'The 20-Mark DI Blueprint' : '20 अंक डीआई का मास्टर प्लान'}
                      </h4>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        {lang === 'en'
                          ? 'Comprises 2 Graph Questions (10 Marks) + 2 Table Questions (10 Marks). The single biggest differentiator in UPSSSC PET. Solve 4 sets daily starting today.'
                          : 'इसमें 2 ग्राफ (10 अंक) तथा 2 तालिकाएं (10 अंक) आती हैं। यह पीईटी परीक्षा का सबसे बड़ा गेम चेंजर है। रोजाना 4 सेट हल करने का नियम बनाएं।'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="font-bold text-slate-900 block mb-1">Rule 1: Unit Traps</span>
                        <span className="text-slate-600">Always verify if the table is in Thousand, Lakh or Crores before calculating ratios.</span>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="font-bold text-slate-900 block mb-1">Rule 2: Approximation</span>
                        <span className="text-slate-600">Round off decimals if options have &gt;2% difference. Never calculate to 5 decimal places.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {lang === 'en' ? 'Hindi Unseen Prose Passages (10 Marks)' : 'अपठित हिन्दी गद्यांश (2 गद्यांश = 10 अंक)'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {lang === 'en'
                          ? 'Zero formula memorization required. 100% reading comprehension score.'
                          : 'बिना किसी सूत्र के केवल समझ के आधार पर पूरे 10 में से 10 अंक प्राप्त करें।'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                      2 × 5 = 10 Marks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                      <span className="text-xs font-bold text-amber-700 block mb-1">Step 1: Reverse Reading</span>
                      <p className="text-xs text-slate-600">Read all 5 questions in 45 seconds before touching the passage. Your brain will instinctively spot answers.</p>
                    </div>
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                      <span className="text-xs font-bold text-amber-700 block mb-1">Step 2: Strict Adherence</span>
                      <p className="text-xs text-slate-600">Answer strictly according to the author's viewpoint written in the lines. Never substitute your general knowledge.</p>
                    </div>
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                      <span className="text-xs font-bold text-amber-700 block mb-1">Step 3: Title Identification</span>
                      <p className="text-xs text-slate-600">The title of a passage is usually found in the opening sentence or the final concluding moral sentence.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 7: CURRENT AFFAIRS & STATIC GK (20 MARKS) */}
          {currentSlide.type === 'current_affairs' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setSelectedStaticTopic('orgs')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedStaticTopic === 'orgs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'World Organizations & HQs' : 'अंतरराष्ट्रीय संगठन व मुख्यालय'}
                </button>
                <button
                  onClick={() => setSelectedStaticTopic('dances')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedStaticTopic === 'dances' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'Art, Culture & UP Dances' : 'कला, संस्कृति व यूपी लोकनृत्य'}
                </button>
                <button
                  onClick={() => setSelectedStaticTopic('borders')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedStaticTopic === 'borders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'Neighboring Nations & Borders' : 'पड़ोसी देश व सीमाएं'}
                </button>
              </div>

              {selectedStaticTopic === 'orgs' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { org: 'UNESCO', hq: 'Paris, France', note: 'World Heritage' },
                    { org: 'WHO & WTO', hq: 'Geneva, Switzerland', note: 'Health & Trade' },
                    { org: 'IMF & World Bank', hq: 'Washington D.C., USA', note: 'Bretton Woods' },
                    { org: 'United Nations (UN)', hq: 'New York, USA', note: 'HQ & Secretariat' },
                    { org: 'ICJ (Intl Court)', hq: 'The Hague, Netherlands', note: 'Peace Palace' },
                    { org: 'UNEP', hq: 'Nairobi, Kenya', note: 'Environment Programme' },
                    { org: 'BRICS Bank (NDB)', hq: 'Shanghai, China', note: 'Development' },
                    { org: 'SAARC', hq: 'Kathmandu, Nepal', note: 'South Asia' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="font-bold text-slate-900 block">{item.org}</span>
                      <span className="text-amber-700 font-medium block mt-0.5">{item.hq}</span>
                      <span className="text-[11px] text-slate-500">{item.note}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedStaticTopic === 'dances' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      {lang === 'en' ? '8 Classical Dances of India' : 'भारत के 8 शास्त्रीय नृत्य'}
                    </span>
                    <ul className="space-y-1 text-slate-600">
                      <li>• <strong className="text-slate-900">Kathak:</strong> Uttar Pradesh (उत्तर प्रदेश)</li>
                      <li>• <strong className="text-slate-900">Bharatnatyam:</strong> Tamil Nadu</li>
                      <li>• <strong className="text-slate-900">Kathakali & Mohiniyattam:</strong> Kerala</li>
                      <li>• <strong className="text-slate-900">Kuchipudi:</strong> Andhra Pradesh</li>
                      <li>• <strong className="text-slate-900">Sattriya:</strong> Assam (Mahapurush Srimanta Sankardev)</li>
                      <li>• <strong className="text-slate-900">Odissi & Manipuri:</strong> Odisha & Manipur</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <span className="font-bold text-amber-950 block text-sm">
                      {lang === 'en' ? 'Uttar Pradesh Specific Folk Dances & Fairs' : 'उत्तर प्रदेश के प्रमुख लोकनृत्य एवं मेले'}
                    </span>
                    <ul className="space-y-1 text-amber-900">
                      <li>• <strong className="text-slate-900">Charkula (चरकुला):</strong> Braj Region (108 lamps wheel)</li>
                      <li>• <strong className="text-slate-900">Raslila & Nautanki:</strong> Braj, Kanpur, Hathras</li>
                      <li>• <strong className="text-slate-900">Kajri (कजरी):</strong> Mirzapur / Varanasi (Monsoon)</li>
                      <li>• <strong className="text-slate-900">Alha (आल्हा):</strong> Bundelkhand (Veer Ras ballads)</li>
                      <li>• <strong className="text-slate-900">Bateshwar Fair:</strong> Camel/Animal fair, Agra</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedStaticTopic === 'borders' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900">
                      {lang === 'en' ? 'Neighboring Countries Border Length Order' : 'भारत से सीमा साझा करने वाले देश (लंबाई क्रम)'}
                    </span>
                    <span className="text-slate-500 font-mono">Mnemonics: 'बचपन में MBA' (B-C-P-N-M-B-A)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { country: 'Bangladesh', len: '4,096 km', cap: 'Dhaka', cur: 'Taka' },
                      { country: 'China', len: '3,488 km', cap: 'Beijing', cur: 'Yuan/Renminbi' },
                      { country: 'Pakistan', len: '3,323 km', cap: 'Islamabad', cur: 'Rupee' },
                      { country: 'Nepal', len: '1,751 km', cap: 'Kathmandu', cur: 'Nepalese Rupee' },
                      { country: 'Myanmar', len: '1,643 km', cap: 'Naypyidaw', cur: 'Kyat' },
                      { country: 'Bhutan', len: '699 km', cap: 'Thimphu', cur: 'Ngultrum' },
                      { country: 'Afghanistan', len: '106 km', cap: 'Kabul', cur: 'Afghani' },
                      { country: 'Sri Lanka', len: 'Maritime', cap: 'Colombo/Kotte', cur: 'Palk Strait' },
                    ].map((c, i) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="font-bold text-slate-900 block">{c.country}</span>
                        <span className="text-amber-700 font-mono text-[11px] block">{c.len}</span>
                        <span className="text-slate-500 text-[11px] block">{c.cap} · {c.cur}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 8: 60-DAY STUDY PLAN */}
          {currentSlide.type === 'study_plan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSlide.bulletPoints?.map((bp, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {lang === 'en' ? bp.titleEn : bp.titleHi}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lang === 'en' ? bp.descEn : bp.descHi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Daily Schedule Breakdown Box */}
              <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400">
                    {lang === 'en' ? 'Ideal 5-Hour Daily Study Rhythm' : 'दैनिक 5 घंटे का आदर्श समय-विभाजन'}
                  </span>
                  <span className="text-xs text-slate-400">Balanced Productivity</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-amber-300 block font-mono">1.5 Hours</span>
                    <span className="text-slate-300">DI & Arithmetic Drill (4 DI + Math)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-amber-300 block font-mono">1.5 Hours</span>
                    <span className="text-slate-300">General Studies Core (NCERT/Lucent)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-amber-300 block font-mono">1.0 Hour</span>
                    <span className="text-slate-300">Hindi Grammar & 2 Passages</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-amber-300 block font-mono">1.0 Hour</span>
                    <span className="text-slate-300">Current Affairs + Static GK Daily</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 9: RECOMMENDED BOOKLIST */}
          {currentSlide.type === 'booklist' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSlide.bulletPoints?.map((bp, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                        <h4 className="text-sm font-bold text-slate-900">
                          {lang === 'en' ? bp.titleEn : bp.titleHi}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lang === 'en' ? bp.descEn : bp.descHi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Topper Advice Quote */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">
                    {lang === 'en' ? 'Golden Revision Principle:' : 'स्वर्णिम पुनरावृत्ति नियम:'}
                  </span>
                  <p>
                    {lang === 'en'
                      ? 'Do not buy 10 different books. Re-reading Aditya Hindi and Lucent GK 3 times yields a 10x higher memory retention in objective multiple-choice exams.'
                      : 'बाजार से 10 तरह की किताबें खरीदने से बचें। आदित्य पब्लिकेशन हिन्दी और लूसेंट को 3 बार दोहराना परीक्षा हॉल में सीधे विकल्पों को पहचानने की क्षमता देता है।'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 10: EXAM DAY STRATEGY & CUTOFFS */}
          {currentSlide.type === 'exam_day' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentSlide.keyStats?.map((stat, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-500 font-medium block">
                      {lang === 'en' ? stat.labelEn : stat.labelHi}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 tabular-nums block my-1">
                      {stat.value}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {lang === 'en' ? stat.hintEn : stat.hintHi}
                    </span>
                  </div>
                ))}
              </div>

              {/* Target Post Cutoffs Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-100 px-4 py-2 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{lang === 'en' ? 'Target UP Group B & C Vacancies Cutoff Thresholds' : 'प्रमुख भर्तियों के अपेक्षित कटऑफ व पर्सेंटाइल लक्ष्य'}</span>
                  <span className="text-amber-700">Past Trend Normalized</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 font-medium">{lang === 'en' ? 'Post / Examination' : 'पद / भर्ती'}</th>
                        <th className="px-4 py-2 font-medium">{lang === 'en' ? 'Vacancies' : 'रिक्तियां'}</th>
                        <th className="px-4 py-2 font-medium">{lang === 'en' ? 'Safe Percentile' : 'सुरक्षित पर्सेंटाइल'}</th>
                        <th className="px-4 py-2 font-medium text-right">{lang === 'en' ? 'Target Raw Score' : 'अपेक्षित रॉ स्कोर'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {POST_CUTOFFS.slice(0, 4).map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-semibold text-slate-900">
                            {lang === 'en' ? p.postEn : p.postHi}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600 font-mono">{p.approxVacancies}</td>
                          <td className="px-4 py-2.5 text-amber-700 font-mono font-medium">{p.targetPercentile}</td>
                          <td className="px-4 py-2.5 text-slate-900 font-mono font-bold text-right tabular-nums">{p.safeRawScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {onNavigateToCalculator && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={onNavigateToCalculator}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    <span>{lang === 'en' ? 'Open Interactive Cutoff Simulator →' : 'विस्तृत कटऑफ सिम्युलेटर खोलें →'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="px-6 sm:px-10 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>UPSSSC PET 2026</span>
            <span aria-hidden="true">·</span>
            <span>{currentSlide.badge}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'en' ? '100 Questions / 120 Minutes' : '100 प्रश्न / 120 मिनट'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">
              {lang === 'en' ? 'Use Arrow keys (← →) or Space' : 'कीबोर्ड तीर कुंजियों का उपयोग करें'}
            </span>
            <span className="font-mono font-semibold text-slate-700">
              {currentSlideIndex + 1} of {totalSlides}
            </span>
          </div>
        </div>
      </div>

      {/* Speaker / Coaching Notes Collapsible Drawer */}
      {showNotes && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl transition-all text-xs text-amber-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>
              {lang === 'en'
                ? `Presenter & Coaching Notes (Slide ${currentSlideIndex + 1}):`
                : `शिक्षक एवं मार्गदर्शक नोट्स (स्लाइड ${currentSlideIndex + 1}):`}
            </span>
          </div>
          <p className="leading-relaxed pl-6">
            {lang === 'en' ? currentSlide.speakerNotesEn : currentSlide.speakerNotesHi}
          </p>
        </div>
      )}
    </div>
  );
};
