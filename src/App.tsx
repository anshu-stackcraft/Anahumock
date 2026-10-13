import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Play, 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  BarChart3, 
  Bookmark, 
  Sparkles, 
  Presentation, 
  Settings, 
  Languages, 
  Maximize2, 
  Minimize2,
  Clock,
  Flame,
  Award,
  AlertTriangle,
  RotateCcw,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { loadUserData, saveUserData, UserStudyData, getTodayDateStr } from './data/storage';
import { Dashboard } from './components/Dashboard';
import { MockTestEngine } from './components/MockTestEngine';
import { QuestionBankView } from './components/QuestionBankView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { AnalyticsView } from './components/AnalyticsView';
import { RevisionNotebookView } from './components/RevisionNotebookView';
import { AiStudyAssistantView } from './components/AiStudyAssistantView';
import { SlideDeck } from './components/SlideDeck';
import { SettingsView } from './components/SettingsView';

export type AppTab = 
  | 'dashboard' 
  | 'mock' 
  | 'practice' 
  | 'questions' 
  | 'planner' 
  | 'analytics' 
  | 'bookmarks'
  | 'mistakes'
  | 'revision' 
  | 'ai' 
  | 'slides' 
  | 'settings';

export default function App() {
  const [userData, setUserData] = useState<UserStudyData>(loadUserData);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [lang, setLang] = useState<'hi' | 'en'>('hi'); // Default Hindi as requested
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const isDark = userData.theme === 'dark';

  // Sync state to localStorage whenever modified
  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  // Apply theme class to document body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setUserData((prev) => ({ ...prev, theme: nextTheme }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Nav items configuration grouped for Apple-style sidebar
  const primaryNavGroups = [
    {
      groupLabelHi: 'अध्ययन एवं अभ्यास',
      groupLabelEn: 'Study & Practice',
      items: [
        { id: 'dashboard' as AppTab, labelHi: 'डैशबोर्ड', labelEn: 'Dashboard', icon: LayoutDashboard },
        { id: 'mock' as AppTab, labelHi: 'फुल मॉक टेस्ट', labelEn: 'Full Mock Tests', icon: Play, badge: '100 Qs' },
        { id: 'practice' as AppTab, labelHi: 'विषयवार अभ्यास', labelEn: 'Subject Practice', icon: BookOpen },
        { id: 'questions' as AppTab, labelHi: 'महत्वपूर्ण प्रश्न बैंक', labelEn: 'Question Bank', icon: HelpCircle, badge: '140+' },
        { id: 'planner' as AppTab, labelHi: 'स्टडी प्लानर', labelEn: 'Study Planner', icon: Calendar },
      ]
    },
    {
      groupLabelHi: 'रिवीजन एवं कमजोरियां',
      groupLabelEn: 'Revision & Vault',
      items: [
        { id: 'revision' as AppTab, labelHi: 'रिवीजन मोड', labelEn: 'Revision Mode', icon: RotateCcw },
        { id: 'mistakes' as AppTab, labelHi: 'गलतियों की डायरी', labelEn: 'Mistake Notebook', icon: AlertTriangle, badge: userData.mistakeQuestionIds.length > 0 ? `${userData.mistakeQuestionIds.length}` : undefined },
        { id: 'bookmarks' as AppTab, labelHi: 'बुकमार्क प्रश्न', labelEn: 'Bookmarks', icon: Bookmark, badge: userData.bookmarkedQuestionIds.length > 0 ? `${userData.bookmarkedQuestionIds.length}` : undefined },
        { id: 'slides' as AppTab, labelHi: 'एग्जाम ब्लूप्रिंट', labelEn: 'Exam Blueprint', icon: Presentation },
      ]
    },
    {
      groupLabelHi: 'रिपोर्ट्स एवं सेटिंग्स',
      groupLabelEn: 'Reports & Tools',
      items: [
        { id: 'analytics' as AppTab, labelHi: 'प्रगति विश्लेषण', labelEn: 'Progress & Stats', icon: BarChart3 },
        { id: 'ai' as AppTab, labelHi: 'एआई स्टडी साथी', labelEn: 'AI Assistant', icon: Sparkles },
        { id: 'settings' as AppTab, labelHi: 'सेटिंग्स एवं बैकअप', labelEn: 'Settings & Backup', icon: Settings },
      ]
    }
  ];

  // Mobile bottom navigation bar items (top 5 primary actions)
  const mobileBottomItems: { id: AppTab; labelHi: string; labelEn: string; icon: React.ElementType }[] = [
    { id: 'dashboard', labelHi: 'डैशबोर्ड', labelEn: 'Home', icon: LayoutDashboard },
    { id: 'mock', labelHi: 'मॉक टेस्ट', labelEn: 'Mocks', icon: Play },
    { id: 'questions', labelHi: 'प्रश्न', labelEn: 'Questions', icon: HelpCircle },
    { id: 'planner', labelHi: 'प्लानर', labelEn: 'Planner', icon: Calendar },
    { id: 'revision', labelHi: 'रिवीजन', labelEn: 'Revision', icon: RotateCcw },
  ];

  const todayStr = getTodayDateStr();
  const minutesToday = userData.dailyStudyMinutes[todayStr] || 0;

  // Colors based on theme
  const mainBg = isDark ? 'bg-[#0B0B0D] text-[#F5F5F7]' : 'bg-[#F8F8FA] text-zinc-900';
  const sidebarBg = isDark ? 'bg-[#121215] border-[#222227]' : 'bg-white border-zinc-200';
  const mobileHeaderBg = isDark ? 'bg-[#121215]/90 border-[#222227]' : 'bg-white/90 border-zinc-200';
  const mobileBottomBg = isDark ? 'bg-[#121215]/95 border-[#222227]' : 'bg-white/95 border-zinc-200';

  return (
    <div className={`min-h-screen ${mainBg} flex flex-col lg:flex-row font-sans transition-colors duration-200`}>
      {/* ============================================================== */}
      {/* DESKTOP APPLE-INSPIRED SIDEBAR (Hidden on mobile / tablet < lg) */}
      {/* ============================================================== */}
      <aside className={`hidden lg:flex flex-col w-64 xl:w-72 border-r shrink-0 sticky top-0 h-screen overflow-y-auto ${sidebarBg} z-30 transition-colors`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left group flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF7900] to-[#FF9F43] flex items-center justify-center text-black font-extrabold text-lg shadow-xs group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <div className="font-display font-black text-base tracking-tight flex items-center gap-1 leading-tight">
                <span className={isDark ? 'text-[#F5F5F7]' : 'text-zinc-900'}>UPSSSC PET</span>
                <span className="text-[#FF7900]">MASTER</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] font-medium leading-none mt-1">
                {lang === 'hi' ? 'मेरी पर्सनल स्टडी ऐप' : 'Personal Study App'}
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {primaryNavGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]/70 block mb-1.5">
                {lang === 'hi' ? group.groupLabelHi : group.groupLabelEn}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FF7900] text-black font-bold shadow-xs'
                        : isDark
                        ? 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-white/5'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : isDark ? 'text-[#A1A1AA]' : 'text-zinc-500'}`} />
                      <span className="truncate">{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-black/20 text-black'
                          : item.id === 'mistakes'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : isDark
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer Controls (Stats + Language & Theme Toggles) */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {/* Quick study mini widget */}
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#FF7900]" />
              <span className="text-[11px] text-[#A1A1AA]">{lang === 'hi' ? 'आज का समय:' : 'Today:'}</span>
            </div>
            <span className="font-mono font-bold text-xs text-[#FF7900]">{minutesToday} min</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                isDark ? 'bg-[#19191D] border-[#27272A] text-zinc-300 hover:text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
              title="Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>{lang === 'hi' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark / Light toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'bg-[#19191D] border-[#27272A] text-zinc-300 hover:text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FF7900]" /> : <Moon className="w-4 h-4 text-[#FF7900]" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'bg-[#19191D] border-[#27272A] text-zinc-300 hover:text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE / TABLET TOP BAR (Shown on screens < lg)                */}
      {/* ============================================================== */}
      <header className={`lg:hidden sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between ${mobileHeaderBg}`}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF7900] to-[#FF9F43] flex items-center justify-center text-black font-extrabold text-sm shadow-xs">
            P
          </div>
          <div className="font-display font-black text-sm tracking-tight flex items-center gap-1">
            <span className={isDark ? 'text-[#F5F5F7]' : 'text-zinc-900'}>UPSSSC PET</span>
            <span className="text-[#FF7900]">MASTER</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Language Toggle */}
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className={`p-1.5 px-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
              isDark ? 'bg-[#19191D] border-[#27272A] text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-[#FF7900]" />
            <span>{lang === 'hi' ? 'HI' : 'EN'}</span>
          </button>

          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border ${
              isDark ? 'bg-[#19191D] border-[#27272A] text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FF7900]" /> : <Moon className="w-4 h-4 text-[#FF7900]" />}
          </button>

          {/* More Drawer Trigger */}
          <button
            onClick={() => setIsMobileMoreOpen(true)}
            className={`p-1.5 rounded-lg border ${
              isDark ? 'bg-[#19191D] border-[#27272A] text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
            }`}
            title="All Sections"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN VIEW CONTAINER                                           */}
      {/* ============================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-12 min-w-0">
        {activeTab === 'dashboard' && (
          <Dashboard
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
            onNavigate={(t) => setActiveTab(t as AppTab)}
          />
        )}

        {activeTab === 'mock' && (
          <MockTestEngine
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
          />
        )}

        {activeTab === 'practice' && (
          <QuestionBankView
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
            initialMode="practice"
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBankView
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
            initialMode="all"
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlannerView
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            userData={userData}
            lang={lang}
            isDark={isDark}
            onNavigateToRevision={() => setActiveTab('revision')}
            onNavigateToMock={() => setActiveTab('mock')}
          />
        )}

        {activeTab === 'bookmarks' && (
          <RevisionNotebookView
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
            initialMode="bookmarks"
          />
        )}

        {activeTab === 'mistakes' && (
          <RevisionNotebookView
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
            initialMode="mistakes"
          />
        )}

        {activeTab === 'revision' && (
          <RevisionNotebookView
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            isDark={isDark}
            initialMode="mistakes"
          />
        )}

        {activeTab === 'slides' && (
          <SlideDeck
            lang={lang}
            onNavigateToSyllabus={() => setActiveTab('questions')}
            onNavigateToCalculator={() => setActiveTab('mock')}
          />
        )}

        {activeTab === 'ai' && (
          <AiStudyAssistantView
            userData={userData}
            lang={lang}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            userData={userData}
            setUserData={setUserData}
            lang={lang}
            setLang={setLang}
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
        )}
      </main>

      {/* ============================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom on phones)       */}
      {/* ============================================================== */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-2 py-1.5 flex items-center justify-around ${mobileBottomBg}`}>
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#FF7900] font-bold'
                  : isDark ? 'text-[#A1A1AA] hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#FF7900]/15' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] leading-tight font-medium">
                {lang === 'hi' ? item.labelHi : item.labelEn}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            isDark ? 'text-[#A1A1AA] hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <div className="p-1 rounded-lg">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-tight font-medium">
            {lang === 'hi' ? 'अन्य' : 'More'}
          </span>
        </button>
      </nav>

      {/* ============================================================== */}
      {/* MOBILE "MORE" SLIDE-UP DRAWER                                 */}
      {/* ============================================================== */}
      {isMobileMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end justify-center p-0">
          <div className={`w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t p-6 space-y-6 ${sidebarBg} shadow-2xl animate-in slide-in-from-bottom duration-200`}>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                <h3 className="font-display font-bold text-base">
                  {lang === 'hi' ? 'सभी खंड एवं सुविधाएं' : 'All Sections & Tools'}
                </h3>
              </div>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {primaryNavGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]/70 block mb-1">
                    {lang === 'hi' ? group.groupLabelHi : group.groupLabelEn}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileMoreOpen(false);
                          }}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[#FF7900] text-black font-bold border-[#FF7900]'
                              : isDark
                              ? 'bg-[#19191D] border-[#27272A] text-zinc-300'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/20">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-[#A1A1AA]">
                Official Pattern: 100 Qs / 120 Mins / -0.25 Neg
              </span>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#FF7900] text-black"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
