/**
 * Local Storage Persistence Layer for UPSSSC PET Master
 * Versioned schema (v2), theme support, data import/export with validation
 */

export interface PlannerTask {
  id: string;
  titleHi: string;
  titleEn: string;
  subjectId: string;
  topic?: string;
  plannedDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

export interface MockResultRecord {
  id: string;
  testId: string;
  testTitleHi: string;
  testTitleEn: string;
  date: string; // ISO date string
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  rawScore: number;
  accuracy: number; // percentage
  timeTakenSeconds: number;
  incorrectQuestionIds: string[];
}

export interface UserStudyData {
  version: number;
  theme: 'dark' | 'light';
  dailyTargetHours: number;
  examDate: string; // YYYY-MM-DD
  tasks: PlannerTask[];
  mockHistory: MockResultRecord[];
  bookmarkedQuestionIds: string[];
  mistakeQuestionIds: string[];
  subjectMastery: Record<string, 'not_started' | 'in_progress' | 'mastered'>;
  dailyStudyMinutes: Record<string, number>; // date "YYYY-MM-DD" -> minutes
}

const STORAGE_KEY_V2 = 'upsssc_pet_master_v2';
const STORAGE_KEY_V1 = 'upsssc_pet_master_userdata_v1';

export const getTodayDateStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDefaultUserData = (): UserStudyData => {
  const today = getTodayDateStr();
  return {
    version: 2,
    theme: 'dark', // Apple-inspired orange + black
    dailyTargetHours: 4.0,
    examDate: '2026-10-28',
    tasks: [], // Clean real state without fabricated tasks
    mockHistory: [], // Real tests attempted by user
    bookmarkedQuestionIds: [],
    mistakeQuestionIds: [],
    subjectMastery: {
      history: 'not_started',
      inm: 'not_started',
      geography: 'not_started',
      economy: 'not_started',
      polity: 'not_started',
      science: 'not_started',
      arithmetic: 'not_started',
      general_hindi: 'not_started',
      general_english: 'not_started',
      reasoning: 'not_started',
      current_affairs: 'not_started',
      general_awareness: 'not_started',
      hindi_passage: 'not_started',
      graph_di: 'not_started',
      table_di: 'not_started'
    },
    dailyStudyMinutes: {
      [today]: 0
    }
  };
};

export const loadUserData = (): UserStudyData => {
  try {
    // 1. Try loading V2 schema
    const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      if (parsed && typeof parsed === 'object') {
        const defaults = getDefaultUserData();
        return {
          ...defaults,
          ...parsed,
          subjectMastery: { ...defaults.subjectMastery, ...(parsed.subjectMastery || {}) },
          dailyStudyMinutes: { ...(parsed.dailyStudyMinutes || {}) },
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
          mockHistory: Array.isArray(parsed.mockHistory) ? parsed.mockHistory : [],
          bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
          mistakeQuestionIds: Array.isArray(parsed.mistakeQuestionIds) ? parsed.mistakeQuestionIds : [],
        };
      }
    }

    // 2. Migration from V1 if exists
    const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
    if (rawV1) {
      try {
        const v1 = JSON.parse(rawV1);
        const migrated: UserStudyData = {
          ...getDefaultUserData(),
          tasks: Array.isArray(v1.tasks) ? v1.tasks : [],
          mockHistory: Array.isArray(v1.mockHistory) ? v1.mockHistory : [],
          bookmarkedQuestionIds: Array.isArray(v1.bookmarkedQuestionIds) ? v1.bookmarkedQuestionIds : [],
          mistakeQuestionIds: Array.isArray(v1.mistakeQuestionIds) ? v1.mistakeQuestionIds : [],
          dailyStudyMinutes: v1.dailyStudyMinutes || {},
          dailyTargetHours: v1.dailyTargetHours || 4.0,
          examDate: v1.examDate || '2026-10-28',
          subjectMastery: v1.subjectMastery || getDefaultUserData().subjectMastery,
          theme: 'dark'
        };
        saveUserData(migrated);
        return migrated;
      } catch (err) {
        console.warn('V1 migration failed, using fresh state', err);
      }
    }

    // 3. Fallback to fresh defaults
    const defaults = getDefaultUserData();
    saveUserData(defaults);
    return defaults;
  } catch (err) {
    console.error('Failed to load user data from storage, recovering with default schema', err);
    return getDefaultUserData();
  }
};

export const saveUserData = (data: UserStudyData): void => {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save user data to localStorage', err);
  }
};

export const logStudyTimeMinutes = (minutesToAdd: number): number => {
  const data = loadUserData();
  const today = getTodayDateStr();
  const current = data.dailyStudyMinutes[today] || 0;
  const updated = current + minutesToAdd;
  data.dailyStudyMinutes[today] = updated;
  saveUserData(data);
  return updated;
};

export const exportUserDataAsJson = (): string => {
  const data = loadUserData();
  return JSON.stringify(data, null, 2);
};

export const importUserDataFromJson = (jsonStr: string): boolean => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') return false;

    // Validate required fields
    const validated: UserStudyData = {
      version: 2,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      dailyTargetHours: typeof parsed.dailyTargetHours === 'number' ? parsed.dailyTargetHours : 4.0,
      examDate: typeof parsed.examDate === 'string' ? parsed.examDate : '2026-10-28',
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      mockHistory: Array.isArray(parsed.mockHistory) ? parsed.mockHistory : [],
      bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
      mistakeQuestionIds: Array.isArray(parsed.mistakeQuestionIds) ? parsed.mistakeQuestionIds : [],
      subjectMastery: parsed.subjectMastery || getDefaultUserData().subjectMastery,
      dailyStudyMinutes: parsed.dailyStudyMinutes || {}
    };

    saveUserData(validated);
    return true;
  } catch (err) {
    console.error('Failed to import user data JSON', err);
    return false;
  }
};
