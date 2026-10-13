import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  Languages, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Moon,
  Sun,
  FileCheck,
  Trash2
} from 'lucide-react';
import { 
  UserStudyData, 
  saveUserData, 
  exportUserDataAsJson, 
  importUserDataFromJson, 
  getDefaultUserData 
} from '../data/storage';

interface SettingsViewProps {
  userData: UserStudyData;
  setUserData: React.Dispatch<React.SetStateAction<UserStudyData>>;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userData,
  setUserData,
  lang,
  setLang,
  isDark,
  toggleTheme,
}) => {
  const [examDate, setExamDate] = useState(userData.examDate || '2026-10-28');
  const [targetHours, setTargetHours] = useState(userData.dailyTargetHours || 4);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Theme style classes
  const cardBg = isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-white border-zinc-200 shadow-xs';
  const textPrimary = isDark ? 'text-[#F5F5F7]' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-zinc-500';
  const innerCardBg = isDark ? 'bg-[#222227] border-[#2E2E35]' : 'bg-zinc-50 border-zinc-200';
  const inputBg = isDark ? 'bg-[#131316] border-[#27272A] text-[#F5F5F7]' : 'bg-white border-zinc-200 text-zinc-900';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserStudyData = {
      ...userData,
      examDate,
      dailyTargetHours: targetHours,
    };
    saveUserData(updated);
    setUserData(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportUserDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `upsssc-pet-study-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importUserDataFromJson(content);
        if (success) {
          setImportStatus(lang === 'en' ? 'Data restored successfully!' : 'डेटा सफलतापूर्वक रीस्टोर हो गया!');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus(lang === 'en' ? 'Invalid backup file format' : 'अमान्य बैकअप फ़ाइल प्रारूप');
        }
      } catch {
        setImportStatus(lang === 'en' ? 'Failed to read file' : 'फ़ाइल पढ़ने में त्रुटि');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAllData = () => {
    const fresh = getDefaultUserData();
    saveUserData(fresh);
    setUserData(fresh);
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#FF7900]">
            {lang === 'en' ? 'Preferences & Local Storage' : 'प्राथमिकताएं एवं लोकल स्टोरेज'}
          </span>
        </div>
        <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>
          {lang === 'en' ? 'Settings & Data Management' : 'सेटिंग्स एवं डेटा प्रबंधन'}
        </h2>
        <p className={`text-sm ${textSecondary} mt-1`}>
          {lang === 'en'
            ? 'Manage app theme, study preferences, and export/import your offline preparation records.'
            : 'ऐप थीम, भाषा, अध्ययन लक्ष्य और बैकअप फ़ाइल का प्रबंधन करें। कोई लॉगिन आवश्यक नहीं है।'}
        </p>
      </div>

      {/* Preferences Form */}
      <div className={`p-6 rounded-2xl border transition-all ${cardBg} space-y-6`}>
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className={`font-display text-base font-bold ${textPrimary}`}>
            {lang === 'en' ? 'Preparation Goals & Interface Preferences' : 'अध्ययन लक्ष्य एवं इंटरफ़ेस सेटिंग्स'}
          </h3>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Saved' : 'सुरक्षित'}
            </span>
          )}
        </div>

        {/* Theme and Language Quick Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Appearance Theme */}
          <div className={`p-4 rounded-xl border ${innerCardBg} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                {lang === 'en' ? 'Appearance Theme' : 'थीम (डिज़ाइन)'}
              </span>
              <span className="text-xs text-[#FF7900] font-mono font-bold">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => { if (!isDark) toggleTheme(); }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isDark
                    ? 'bg-[#FF7900] text-black shadow-xs'
                    : `${cardBg} ${textSecondary} hover:text-white`
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark (#0B0B0D)</span>
              </button>
              <button
                type="button"
                onClick={() => { if (isDark) toggleTheme(); }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  !isDark
                    ? 'bg-[#FF7900] text-black shadow-xs'
                    : `${cardBg} ${textSecondary} hover:text-white`
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Language Switcher */}
          <div className={`p-4 rounded-xl border ${innerCardBg} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                {lang === 'en' ? 'Default Language' : 'डिफ़ॉल्ट भाषा'}
              </span>
              <span className="text-xs text-[#FF7900] font-mono font-bold">
                {lang === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  lang === 'hi'
                    ? 'bg-[#FF7900] text-black shadow-xs'
                    : `${cardBg} ${textSecondary} hover:text-white`
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>हिन्दी (Default)</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  lang === 'en'
                    ? 'bg-[#FF7900] text-black shadow-xs'
                    : `${cardBg} ${textSecondary} hover:text-white`
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>English</span>
              </button>
            </div>
          </div>
        </div>

        {/* Goals form */}
        <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${textSecondary}`}>
                {lang === 'en' ? 'Target Exam Date' : 'लक्षित परीक्षा तिथि'}
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className={`w-full py-2.5 px-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${textSecondary}`}>
                {lang === 'en' ? `Daily Target Hours (${targetHours} Hours)` : `दैनिक अध्ययन लक्ष्य (${targetHours} घंटे)`}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={targetHours}
                  onChange={(e) => setTargetHours(parseFloat(e.target.value))}
                  className="flex-1 accent-[#FF7900]"
                />
                <span className={`font-mono text-sm font-bold text-[#FF7900] w-12 text-right`}>
                  {targetHours}h
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#FF7900] text-black hover:bg-[#FF9F43] transition-all shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'en' ? 'Save Preferences' : 'सेटिंग्स सुरक्षित करें'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup and Data Portability Card */}
      <div className={`p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}>
        <div className="border-b border-white/5 pb-3">
          <h3 className={`font-display text-base font-bold ${textPrimary}`}>
            {lang === 'en' ? 'Data Backup, Export & Restore' : 'डेटा बैकअप एवं रीस्टोर (JSON)'}
          </h3>
          <p className={`text-xs ${textSecondary} mt-0.5`}>
            {lang === 'en'
              ? 'Your timetables, mock test history, bookmarks, and mistakes are stored in browser localStorage. Export to keep a safe backup.'
              : 'आपकी अध्ययन प्रगति ब्राउज़र के लोकल स्टोरेज में सुरक्षित है। डिवाइस बदलने के लिए बैकअप डाउनलोड करें।'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Export Button */}
          <div className={`p-4 rounded-xl border ${innerCardBg} space-y-3`}>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#FF7900]" />
              <span className={`text-xs font-bold ${textPrimary}`}>
                {lang === 'en' ? 'Download JSON Backup' : 'बैकअप फ़ाइल डाउनलोड करें'}
              </span>
            </div>
            <p className={`text-[11px] ${textSecondary}`}>
              {lang === 'en'
                ? 'Save all mock attempts, question bookmarks and task timetables as a single JSON file.'
                : 'सभी टेस्ट परिणाम, बुकमार्क और टाइमटेबल को एक JSON फाइल के रूप में सहेजें।'}
            </p>
            <button
              onClick={handleDownloadBackup}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-all ${cardBg} ${textPrimary} hover:border-[#FF7900] flex items-center justify-center gap-1.5`}
            >
              <Download className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>{lang === 'en' ? 'Export Backup (.json)' : 'डाउनलोड करें (.json)'}</span>
            </button>
          </div>

          {/* Import Button */}
          <div className={`p-4 rounded-xl border ${innerCardBg} space-y-3`}>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <span className={`text-xs font-bold ${textPrimary}`}>
                {lang === 'en' ? 'Restore from Backup' : 'फ़ाइल से डेटा रीस्टोर करें'}
              </span>
            </div>
            <p className={`text-[11px] ${textSecondary}`}>
              {lang === 'en'
                ? 'Upload a previously saved JSON backup file to restore all your history.'
                : 'पहले डाउनलोड की गई बैकअप फाइल अपलोड करके अपनी तैयारी रिकॉर्ड वापस लाएं।'}
            </p>
            <label className={`w-full py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-all ${cardBg} ${textPrimary} hover:border-blue-400 flex items-center justify-center gap-1.5`}>
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'en' ? 'Select File to Restore' : 'फ़ाइल चुनें'}</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
            {importStatus && (
              <p className="text-[11px] font-bold text-emerald-400 text-center">{importStatus}</p>
            )}
          </div>
        </div>
      </div>

      {/* Official Pattern Notice & Danger Zone */}
      <div className={`p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}>
        <div className="flex items-center gap-2 text-[#FF7900]">
          <FileCheck className="w-5 h-5" />
          <h3 className={`font-display text-base font-bold ${textPrimary}`}>
            {lang === 'en' ? 'Official Examination Pattern Verification Notice' : 'आधिकारिक परीक्षा पैटर्न सत्यापन सूचना'}
          </h3>
        </div>
        <p className={`text-xs leading-relaxed ${textSecondary}`}>
          {lang === 'en'
            ? 'This application is calibrated according to official Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) PET notifications: 100 Objective MCQs, 100 Marks, 120 Minutes duration, and 0.25 (1/4th) Negative Marking for every incorrect answer. Unanswered questions carry zero penalty. Generated practice questions are for revision and do not claim to leak official test papers.'
            : 'यह ऐप उत्तर प्रदेश अधीनस्थ सेवा चयन आयोग (UPSSSC) के आधिकारिक पीईटी पैटर्न पर आधारित है: 100 बहुविकल्पीय प्रश्न, 100 अंक, 120 मिनट समय, तथा प्रत्येक गलत उत्तर पर 0.25 (1/4) नकारात्मक अंकन। अनुत्तरित प्रश्नों पर कोई अंक नहीं कटता।'}
        </p>

        {/* Danger Zone: Reset App */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-400 block">
              {lang === 'en' ? 'Reset All Application Records' : 'सभी रिकॉर्ड रीसेट करें'}
            </span>
            <span className={`text-[11px] ${textSecondary}`}>
              {lang === 'en' ? 'Clear all mock history, mistakes, and timetables' : 'सभी टेस्ट स्कोर, गलतियां और टाइमटेबल हटाकर रीसेट करें'}
            </span>
          </div>

          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetAllData}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-500"
              >
                {lang === 'en' ? 'Confirm Reset' : 'पुष्टि करें'}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg ${innerCardBg} ${textSecondary}`}
              >
                {lang === 'en' ? 'Cancel' : 'रद्द'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl text-rose-400 bg-rose-950/20 border border-rose-900/40 hover:bg-rose-900/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Reset Data...' : 'डेटा रीसेट करें...'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
