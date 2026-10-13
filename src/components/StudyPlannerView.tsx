import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  RotateCcw, 
  AlertTriangle, 
  Target, 
  Sparkles,
  Edit2,
  ArrowRight,
  Flame,
  Check,
  X
} from 'lucide-react';
import { PET_SUBJECTS } from '../data/petData';
import { UserStudyData, PlannerTask, saveUserData, logStudyTimeMinutes, getTodayDateStr } from '../data/storage';

interface StudyPlannerViewProps {
  userData: UserStudyData;
  setUserData: React.Dispatch<React.SetStateAction<UserStudyData>>;
  lang: 'en' | 'hi';
  isDark: boolean;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  userData,
  setUserData,
  lang,
  isDark,
}) => {
  const todayStr = getTodayDateStr();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubjectId, setTaskSubjectId] = useState('history');
  const [taskTopic, setTaskTopic] = useState('');
  const [taskStartTime, setTaskStartTime] = useState('10:00');
  const [taskDuration, setTaskDuration] = useState(45);

  // Quick study minutes logger state
  const [quickMinutes, setQuickMinutes] = useState(30);

  // Theme style classes
  const cardBg = isDark ? 'bg-[#19191D] border-[#27272A]' : 'bg-white border-zinc-200 shadow-xs';
  const textPrimary = isDark ? 'text-[#F5F5F7]' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-zinc-500';
  const innerCardBg = isDark ? 'bg-[#222227] border-[#2E2E35]' : 'bg-zinc-50 border-zinc-200';
  const inputBg = isDark ? 'bg-[#131316] border-[#27272A] text-[#F5F5F7]' : 'bg-white border-zinc-200 text-zinc-900';

  // Filter tasks for selected date
  const dateTasks = userData.tasks.filter((t) => t.plannedDate === selectedDate);
  const plannedMinutesOnDate = dateTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const actualMinutesOnDate = userData.dailyStudyMinutes[selectedDate] || 0;
  const targetMinutesToday = (userData.dailyTargetHours || 4) * 60;
  const targetPct = Math.min(100, Math.round((actualMinutesOnDate / targetMinutesToday) * 100));

  // Missed tasks (past date tasks that are incomplete)
  const missedTasks = userData.tasks.filter(
    (t) => t.plannedDate < todayStr && !t.completed
  );

  // Handle open add / edit modal
  const handleOpenAddModal = (taskToEdit?: PlannerTask) => {
    if (taskToEdit) {
      setEditingTaskId(taskToEdit.id);
      setTaskTitle(lang === 'hi' ? taskToEdit.titleHi : taskToEdit.titleEn);
      setTaskSubjectId(taskToEdit.subjectId);
      setTaskTopic(taskToEdit.topic || '');
      setTaskStartTime(taskToEdit.startTime);
      setTaskDuration(taskToEdit.durationMinutes);
    } else {
      setEditingTaskId(null);
      setTaskTitle('');
      setTaskSubjectId('history');
      setTaskTopic('');
      setTaskStartTime('10:00');
      setTaskDuration(45);
    }
    setShowAddModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTaskId) {
      // Edit existing
      const updatedTasks = userData.tasks.map((t) => {
        if (t.id === editingTaskId) {
          return {
            ...t,
            titleHi: taskTitle,
            titleEn: taskTitle,
            subjectId: taskSubjectId,
            topic: taskTopic.trim() || undefined,
            startTime: taskStartTime,
            durationMinutes: taskDuration,
          };
        }
        return t;
      });
      const updatedData = { ...userData, tasks: updatedTasks };
      saveUserData(updatedData);
      setUserData(updatedData);
    } else {
      // Add new
      const newTask: PlannerTask = {
        id: `task-${Date.now()}`,
        titleHi: taskTitle,
        titleEn: taskTitle,
        subjectId: taskSubjectId,
        topic: taskTopic.trim() || undefined,
        plannedDate: selectedDate,
        startTime: taskStartTime,
        durationMinutes: taskDuration,
        completed: false,
      };
      const updatedTasks = [...userData.tasks, newTask];
      const updatedData = { ...userData, tasks: updatedTasks };
      saveUserData(updatedData);
      setUserData(updatedData);
    }

    setShowAddModal(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = userData.tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    const updatedData = { ...userData, tasks: updatedTasks };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = userData.tasks.filter((t) => t.id !== taskId);
    const updatedData = { ...userData, tasks: updatedTasks };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  // Roll-forward all missed tasks to today
  const handleRollForwardMissedTasks = () => {
    const updatedTasks = userData.tasks.map((t) => {
      if (t.plannedDate < todayStr && !t.completed) {
        return { ...t, plannedDate: todayStr };
      }
      return t;
    });
    const updatedData = { ...userData, tasks: updatedTasks };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  // Move single task to today
  const handleMoveTaskToToday = (taskId: string) => {
    const updatedTasks = userData.tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, plannedDate: todayStr };
      }
      return t;
    });
    const updatedData = { ...userData, tasks: updatedTasks };
    saveUserData(updatedData);
    setUserData(updatedData);
  };

  // Log study time quickly
  const handleLogQuickMinutes = (mins: number) => {
    const newTotal = logStudyTimeMinutes(mins);
    setUserData((prev) => ({
      ...prev,
      dailyStudyMinutes: {
        ...prev.dailyStudyMinutes,
        [todayStr]: newTotal,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FF7900]">
              {lang === 'en' ? 'Smart Timetable & Scheduler' : 'स्मार्ट टाइमटेबल एवं दैनिक कार्ययोजना'}
            </span>
          </div>
          <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>
            {lang === 'en' ? 'UPSSSC PET Study Planner' : 'यूपीएसएसएससी पीईटी स्टडी प्लानर'}
          </h2>
          <p className={`text-sm ${textSecondary} mt-1`}>
            {lang === 'en'
              ? 'Organize syllabus topics, set daily targets, log study hours, and eliminate study backlog.'
              : 'दैनिक अध्ययन लक्ष्य निर्धारित करें, छूटे हुए कार्यों को री-शेड्यूल करें और समय पर सिलेबस पूरा करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#FF7900] text-black hover:bg-[#FF9F43] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'en' ? 'Add Study Task' : 'नया कार्य जोड़ें'}</span>
          </button>
        </div>
      </div>

      {/* Target Progress & Quick Minutes Logger */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Daily Target Ring / Bar */}
        <div className={`md:col-span-7 p-5 rounded-2xl border transition-all ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF7900]/10 flex items-center justify-center text-[#FF7900]">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`font-display text-sm font-bold ${textPrimary}`}>
                  {lang === 'en' ? 'Today\'s Study Target' : 'आज का अध्ययन लक्ष्य'}
                </h3>
                <span className={`text-xs ${textSecondary}`}>
                  {actualMinutesOnDate} min / {targetMinutesToday} min ({userData.dailyTargetHours} hours)
                </span>
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-[#FF7900]">{targetPct}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-zinc-800/40 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF7900] to-[#FF9F43] transition-all duration-500"
              style={{ width: `${targetPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className={textSecondary}>
              {targetPct >= 100
                ? (lang === 'en' ? 'Target achieved! Great job!' : 'दैनिक लक्ष्य पूरा हुआ! बहुत बढ़िया!')
                : (lang === 'en' ? `${targetMinutesToday - actualMinutesOnDate} min left to hit target` : `लक्ष्य के लिए ${Math.max(0, targetMinutesToday - actualMinutesOnDate)} मिनट शेष`)}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] ${textSecondary}`}>{lang === 'en' ? 'Log study:' : 'स्टडी जोड़ें:'}</span>
              <button
                onClick={() => handleLogQuickMinutes(30)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${innerCardBg} hover:text-[#FF7900]`}
              >
                +30m
              </button>
              <button
                onClick={() => handleLogQuickMinutes(60)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${innerCardBg} hover:text-[#FF7900]`}
              >
                +60m
              </button>
            </div>
          </div>
        </div>

        {/* Date Selector Strip */}
        <div className={`md:col-span-5 p-5 rounded-2xl border transition-all ${cardBg} flex flex-col justify-between space-y-3`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
              {lang === 'en' ? 'Viewing Date' : 'तारीख का चयन'}
            </span>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-xs font-bold text-[#FF7900] hover:underline"
            >
              {lang === 'en' ? 'Jump to Today' : 'आज की तारीख'}
            </button>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full py-2.5 px-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
          />
          <div className="flex items-center justify-between text-xs">
            <span className={textSecondary}>{dateTasks.length} {lang === 'en' ? 'Tasks Scheduled' : 'कार्य निर्धारित'}</span>
            <span className="font-mono font-bold text-[#FF7900]">{plannedMinutesOnDate} min total</span>
          </div>
        </div>
      </div>

      {/* Missed Tasks Alert & Roll-Forward Banner */}
      {missedTasks.length > 0 && (
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
          isDark
            ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  {lang === 'en'
                    ? `${missedTasks.length} Missed / Incomplete Tasks from Previous Days`
                    : `पिछले दिनों के ${missedTasks.length} अधूरे कार्य लंबित हैं`}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  {lang === 'en'
                    ? 'Keep your PET preparation on schedule by rescheduling them to today.'
                    : 'अपनी पीईटी तैयारी को पटरी पर रखने के लिए इन सभी को आज के दिन में स्थानांतरित करें।'}
                </p>
              </div>
            </div>

            <button
              onClick={handleRollForwardMissedTasks}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-xs shrink-0"
            >
              {lang === 'en' ? 'Roll Forward All to Today →' : 'सभी को आज में जोड़ें →'}
            </button>
          </div>

          {/* Missed Tasks Mini List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {missedTasks.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-semibold block truncate">{lang === 'hi' ? t.titleHi : t.titleEn}</span>
                  <span className="text-[10px] opacity-70">Planned: {t.plannedDate} ({t.durationMinutes}m)</span>
                </div>
                <button
                  onClick={() => handleMoveTaskToToday(t.id)}
                  className="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-500/30 hover:bg-rose-500/50 shrink-0"
                >
                  {lang === 'en' ? 'Move' : 'आज'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks for the Selected Date */}
      <div className={`p-6 rounded-2xl border transition-all ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF7900]" />
            <h3 className={`font-display text-base font-bold ${textPrimary}`}>
              {selectedDate === todayStr
                ? (lang === 'en' ? 'Today\'s Study Schedule' : 'आज का अध्ययन कार्यक्रम')
                : (lang === 'en' ? `Schedule for ${selectedDate}` : `${selectedDate} की कार्ययोजना`)}
            </h3>
          </div>
          <span className={`text-xs ${textSecondary}`}>
            {dateTasks.filter((t) => t.completed).length} / {dateTasks.length} {lang === 'en' ? 'Completed' : 'पूर्ण'}
          </span>
        </div>

        {dateTasks.length === 0 ? (
          <div className={`text-center py-12 rounded-xl border ${innerCardBg} space-y-3`}>
            <Calendar className="w-8 h-8 text-[#A1A1AA] mx-auto" />
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {lang === 'en' ? 'No study tasks scheduled for this day' : 'इस दिन के लिए कोई कार्य निर्धारित नहीं है'}
            </p>
            <p className={`text-xs ${textSecondary}`}>
              {lang === 'en' ? 'Plan your high-weightage topics like Graph DI, Passages or Current Affairs' : 'ग्राफ एवं तालिका या इतिहास जैसे महत्वपूर्ण विषयों की योजना बनाएं'}
            </p>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#FF7900] text-black hover:bg-[#FF9F43] transition-all"
            >
              {lang === 'en' ? '+ Add Task for this Day' : '+ इस दिन के लिए कार्य जोड़ें'}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dateTasks.map((task) => {
              const subObj = PET_SUBJECTS.find((s) => s.id === task.subjectId);

              return (
                <div
                  key={task.id}
                  className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    task.completed
                      ? isDark ? 'bg-zinc-900/40 border-zinc-800/40 opacity-70' : 'bg-zinc-50 border-zinc-200 opacity-60'
                      : innerCardBg
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : isDark ? 'border-zinc-700 bg-black/40' : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-zinc-500' : textPrimary
                        }`}>
                          {lang === 'hi' ? task.titleHi : task.titleEn}
                        </span>
                        {task.topic && (
                          <span className={`text-xs ${textSecondary} hidden sm:inline`}>
                            · {task.topic}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span className="text-[#FF7900] font-medium">
                          {subObj ? (lang === 'en' ? subObj.nameEn : subObj.nameHi) : task.subjectId}
                        </span>
                        <span>•</span>
                        <span>{task.startTime}</span>
                        <span>•</span>
                        <span>{task.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenAddModal(task)}
                      className={`p-1.5 rounded-lg ${textSecondary} hover:text-white hover:bg-zinc-800 transition-colors`}
                      title="Edit Task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`p-1.5 rounded-lg ${textSecondary} hover:text-rose-400 hover:bg-zinc-800 transition-colors`}
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Modal (Add / Edit) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border ${cardBg} space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className={`font-display text-lg font-bold ${textPrimary}`}>
                {editingTaskId
                  ? (lang === 'en' ? 'Edit Study Task' : 'अध्ययन कार्य संपादित करें')
                  : (lang === 'en' ? 'Schedule New Study Task' : 'नया अध्ययन कार्य जोड़ें')}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1 rounded-lg ${textSecondary} hover:text-white`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${textSecondary}`}>
                  {lang === 'en' ? 'Task Title / Goal' : 'कार्य का नाम / लक्ष्य'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'e.g. Solve 20 Graph Questions' : 'जैसे: 20 ग्राफ एवं तालिका प्रश्न हल करना'}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${textSecondary}`}>
                  {lang === 'en' ? 'PET Syllabus Subject' : 'पाठ्यक्रम विषय'}
                </label>
                <select
                  value={taskSubjectId}
                  onChange={(e) => setTaskSubjectId(e.target.value)}
                  className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
                >
                  {PET_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === 'en' ? s.nameEn : s.nameHi} ({s.marks} Marks)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${textSecondary}`}>
                  {lang === 'en' ? 'Topic / Chapter (Optional)' : 'विशिष्ट अध्याय / टॉपिक (वैकल्पिक)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'e.g. Indus Valley, GST, Average' : 'जैसे: सिन्धु सभ्यता, GST, औसत'}
                  value={taskTopic}
                  onChange={(e) => setTaskTopic(e.target.value)}
                  className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${textSecondary}`}>
                    {lang === 'en' ? 'Start Time' : 'समय'}
                  </label>
                  <input
                    type="time"
                    value={taskStartTime}
                    onChange={(e) => setTaskStartTime(e.target.value)}
                    className={`w-full py-2 px-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${textSecondary}`}>
                    {lang === 'en' ? 'Duration (Minutes)' : 'अवधि (मिनट)'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    step="5"
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(parseInt(e.target.value) || 30)}
                    className={`w-full py-2 px-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#FF7900] ${inputBg}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold ${innerCardBg} ${textSecondary} hover:text-white`}
                >
                  {lang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#FF7900] text-black hover:bg-[#FF9F43] transition-all"
                >
                  {editingTaskId
                    ? (lang === 'en' ? 'Update Task' : 'अपडेट करें')
                    : (lang === 'en' ? 'Save Task' : 'सुरक्षित करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
