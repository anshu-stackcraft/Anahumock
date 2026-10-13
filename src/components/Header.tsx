import React from 'react';
import { Presentation, BookOpen, Calculator, CheckCircle2, Languages, Maximize2, Minimize2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'slides' | 'syllabus' | 'calculator' | 'quiz';
  setActiveTab: (tab: 'slides' | 'syllabus' | 'calculator' | 'quiz') => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isFullscreen,
  toggleFullscreen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 whitespace-nowrap">
              UPSSSC PET <span className="text-amber-600">Master</span>
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium border-l border-slate-200 pl-3">
              {lang === 'en' ? 'Syllabus & Exam Pattern' : 'पाठ्यक्रम एवं परीक्षा पैटर्न'}
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'slides'
                  ? 'border-amber-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>{lang === 'en' ? 'Slide Deck' : 'प्रस्तुति स्लाइड्स'}</span>
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'syllabus'
                  ? 'border-amber-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'en' ? 'Syllabus Matrix' : 'विस्तृत पाठ्यक्रम'}</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'calculator'
                  ? 'border-amber-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>{lang === 'en' ? 'Score Simulator' : 'कटऑफ सिम्युलेटर'}</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'quiz'
                  ? 'border-amber-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'Diagnostic Quiz' : 'अभ्यास प्रश्न'}</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Language Toggle & Fullscreen) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="Toggle English / Hindi"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {activeTab === 'slides' && (
              <button
                onClick={toggleFullscreen}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
                title="Toggle Fullscreen Slide Mode"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'slides' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600'
            }`}
          >
            {lang === 'en' ? 'Slides' : 'स्लाइड्स'}
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'syllabus' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600'
            }`}
          >
            {lang === 'en' ? 'Syllabus' : 'पाठ्यक्रम'}
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'calculator' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600'
            }`}
          >
            {lang === 'en' ? 'Calculator' : 'सिम्युलेटर'}
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600'
            }`}
          >
            {lang === 'en' ? 'Quiz' : 'क्विज'}
          </button>
        </div>
      </div>
    </header>
  );
};
