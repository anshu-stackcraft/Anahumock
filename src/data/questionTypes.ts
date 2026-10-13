/**
 * Types and interfaces for UPSSSC PET Question Bank and Mock Tests
 */

export type SourceClassification = 
  | 'Verified Previous-Year Question'
  | 'Original Practice Question'
  | 'Current Affairs Question';

export interface Question {
  id: string;
  subjectId: string;
  subjectNameHi: string;
  subjectNameEn: string;
  topicHi: string;
  topicEn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionHi: string;
  questionEn: string;
  optionsHi: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationHi: string;
  explanationEn: string;
  sourceType: SourceClassification;
  sourceDetail: string; // e.g. "UPSSSC PET 2021 Shift 1", "March 2026 PIB / UP Budget", "NCERT Class 10"
  hasDataInterpretation?: boolean;
  tableOrChartData?: {
    type: 'table' | 'bar' | 'line' | 'passage';
    titleHi: string;
    titleEn: string;
    content: string;
  };
}

export interface MockTestConfig {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  type: 'full' | 'mini' | 'subject';
  totalQuestions: number;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarking: number;
  subjectFilter?: string;
  questionIds: string[];
}
