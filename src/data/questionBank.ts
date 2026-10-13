/**
 * Comprehensive Question Bank and Preset Mock Tests for UPSSSC PET
 * Aggregates 115+ verified and practice questions across all 15 syllabus subjects
 */

import { Question, MockTestConfig } from './questionTypes';
import { HISTORY_QUESTIONS, NATIONAL_MOVEMENT_QUESTIONS } from './questions/historyAndMovement';
import { GEOGRAPHY_QUESTIONS, ECONOMY_QUESTIONS } from './questions/geographyAndEconomy';
import { POLITY_QUESTIONS, SCIENCE_QUESTIONS } from './questions/polityAndScience';
import { ARITHMETIC_QUESTIONS, HINDI_QUESTIONS, ENGLISH_QUESTIONS, REASONING_QUESTIONS } from './questions/mathAndLanguages';
import { CURRENT_AFFAIRS_QUESTIONS, GENERAL_AWARENESS_QUESTIONS } from './questions/currentAndStatic';
import { PASSAGE_QUESTIONS, DI_QUESTIONS } from './questions/passagesAndDI';

export * from './questionTypes';

export const QUESTION_BANK: Question[] = [
  ...HISTORY_QUESTIONS,
  ...NATIONAL_MOVEMENT_QUESTIONS,
  ...GEOGRAPHY_QUESTIONS,
  ...ECONOMY_QUESTIONS,
  ...POLITY_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...ARITHMETIC_QUESTIONS,
  ...HINDI_QUESTIONS,
  ...ENGLISH_QUESTIONS,
  ...REASONING_QUESTIONS,
  ...CURRENT_AFFAIRS_QUESTIONS,
  ...GENERAL_AWARENESS_QUESTIONS,
  ...PASSAGE_QUESTIONS,
  ...DI_QUESTIONS
];

// Compile exactly 100 questions for the Official Full-Length Test
const FULL_100_QUESTION_IDS: string[] = [
  // 1. History (5 Qs)
  "his-01", "his-02", "his-03", "his-04", "his-05",
  // 2. National Movement (5 Qs)
  "inm-01", "inm-02", "inm-03", "inm-04", "inm-05",
  // 3. Geography (5 Qs)
  "geo-01", "geo-02", "geo-03", "geo-04", "geo-05",
  // 4. Economy (5 Qs)
  "eco-01", "eco-02", "eco-03", "eco-04", "eco-05",
  // 5. Polity (5 Qs)
  "pol-01", "pol-02", "pol-03", "pol-04", "pol-05",
  // 6. Science (5 Qs)
  "sci-01", "sci-02", "sci-03", "sci-04", "sci-05",
  // 7. Arithmetic (5 Qs)
  "math-01", "math-02", "math-03", "math-04", "math-05",
  // 8. General Hindi (5 Qs)
  "hin-01", "hin-02", "hin-03", "hin-04", "hin-05",
  // 9. General English (5 Qs)
  "eng-01", "eng-02", "eng-03", "eng-04", "eng-05",
  // 10. Reasoning (5 Qs)
  "reas-01", "reas-02", "reas-03", "reas-04", "reas-05",
  // 11. Current Affairs (10 Qs)
  "ca-01", "ca-02", "ca-03", "ca-04", "ca-05", "ca-06", "ca-07", "ca-08", "ca-09", "ca-10",
  // 12. General Awareness & UP Special (10 Qs)
  "ga-01", "ga-02", "ga-03", "ga-04", "ga-05", "ga-06", "ga-07", "ga-08", "ga-09", "ga-10",
  // 13. Hindi Passages (10 Qs - 2 Passages x 5)
  "pas-01", "pas-02", "pas-03", "pas-04", "pas-05", "pas-06", "pas-07", "pas-08", "pas-09", "pas-10",
  // 14. Graph Interpretation (10 Qs - 2 Graphs x 5)
  "di-g1-01", "di-g1-02", "di-g1-03", "di-g1-04", "di-g1-05", "di-g2-01", "di-g2-02", "di-g2-03", "di-g2-04", "di-g2-05",
  // 15. Table Interpretation (10 Qs - 2 Tables x 5)
  "di-t1-01", "di-t1-02", "di-t1-03", "di-t1-04", "di-t1-05", "di-t2-01", "di-t2-02", "di-t2-03", "di-t2-04", "di-t2-05"
];

export const PRESET_MOCK_TESTS: MockTestConfig[] = [
  {
    id: "mock-full-100",
    titleHi: "UPSSSC PET सम्पूर्ण फुल मॉक टेस्ट (100 प्रश्न / 120 मिनट)",
    titleEn: "UPSSSC PET Official Full-Length Mock (100 Qs / 120 Min)",
    descriptionHi: "आधिकारिक परीक्षा पाठ्यक्रम के 15 विषयों का 100% संतुलित पूर्ण प्रश्नपत्र। 0.25 नकारात्मक अंकन सहित।",
    descriptionEn: "100-Question full examination strictly balanced according to official UPSSSC PET subject weightages.",
    type: "full",
    totalQuestions: 100,
    durationMinutes: 120,
    marksPerQuestion: 1.0,
    negativeMarking: 0.25,
    questionIds: FULL_100_QUESTION_IDS
  },
  {
    id: "mock-di-mega-20",
    titleHi: "ग्राफ एवं तालिका (DI) 20-अंक महा-अभ्यास टेस्ट",
    titleEn: "Data Interpretation (DI) 20-Mark Mega Test",
    descriptionHi: "2 रेखा व दंड ग्राफ (10 अंक) तथा 2 तालिकाएं (10 अंक)। पीईटी का सबसे बड़ा गेम-चेंजर खंड।",
    descriptionEn: "20 Questions covering 2 Graphs & 2 Tabular datasets with real calculations.",
    type: "mini",
    totalQuestions: 20,
    durationMinutes: 30,
    marksPerQuestion: 1.0,
    negativeMarking: 0.25,
    subjectFilter: "di",
    questionIds: [
      "di-g1-01", "di-g1-02", "di-g1-03", "di-g1-04", "di-g1-05",
      "di-g2-01", "di-g2-02", "di-g2-03", "di-g2-04", "di-g2-05",
      "di-t1-01", "di-t1-02", "di-t1-03", "di-t1-04", "di-t1-05",
      "di-t2-01", "di-t2-02", "di-t2-03", "di-t2-04", "di-t2-05"
    ]
  },
  {
    id: "mock-gs-booster-25",
    titleHi: "सामान्य अध्ययन (GS Core) 25-अंक स्पेशल टेस्ट",
    titleEn: "General Studies Core (25-Mark Booster)",
    descriptionHi: "इतिहास (5), राष्ट्रीय आन्दोलन (5), भूगोल (5), अर्थव्यवस्था (5) तथा संविधान (5)।",
    descriptionEn: "25 Questions from History, National Movement, Geography, Economy, and Constitution.",
    type: "mini",
    totalQuestions: 25,
    durationMinutes: 30,
    marksPerQuestion: 1.0,
    negativeMarking: 0.25,
    subjectFilter: "gs",
    questionIds: [
      "his-01", "his-02", "his-03", "his-04", "his-05",
      "inm-01", "inm-02", "inm-03", "inm-04", "inm-05",
      "geo-01", "geo-02", "geo-03", "geo-04", "geo-05",
      "eco-01", "eco-02", "eco-03", "eco-04", "eco-05",
      "pol-01", "pol-02", "pol-03", "pol-04", "pol-05"
    ]
  },
  {
    id: "mock-ca-gk-20",
    titleHi: "सामयिकी एवं सामान्य जागरूकता 20-अंक टेस्ट",
    titleEn: "Current Affairs & General Awareness (20 Marks)",
    descriptionHi: "राष्ट्रीय, अंतरराष्ट्रीय व यूपी विशेष समसामयिकी तथा अंतरराष्ट्रीय संगठन व दिवस।",
    descriptionEn: "10 Current Affairs + 10 General Awareness verified questions.",
    type: "mini",
    totalQuestions: 20,
    durationMinutes: 20,
    marksPerQuestion: 1.0,
    negativeMarking: 0.25,
    subjectFilter: "current_affairs",
    questionIds: [
      "ca-01", "ca-02", "ca-03", "ca-04", "ca-05", "ca-06", "ca-07", "ca-08", "ca-09", "ca-10",
      "ga-01", "ga-02", "ga-03", "ga-04", "ga-05", "ga-06", "ga-07", "ga-08", "ga-09", "ga-10"
    ]
  },
  {
    id: "mock-lang-math-25",
    titleHi: "गणित, तर्कशक्ति, हिन्दी एवं अंग्रेजी 25-अंक टेस्ट",
    titleEn: "Aptitude, Science & Languages (25 Marks)",
    descriptionHi: "प्रारम्भिक अंकगणित (5), विज्ञान (5), सामान्य हिन्दी (5), अंग्रेजी (5) तथा रीजनिंग (5)।",
    descriptionEn: "25 Questions testing high-accuracy quantitative and linguistic abilities.",
    type: "mini",
    totalQuestions: 25,
    durationMinutes: 30,
    marksPerQuestion: 1.0,
    negativeMarking: 0.25,
    subjectFilter: "aptitude",
    questionIds: [
      "math-01", "math-02", "math-03", "math-04", "math-05",
      "sci-01", "sci-02", "sci-03", "sci-04", "sci-05",
      "hin-01", "hin-02", "hin-03", "hin-04", "hin-05",
      "eng-01", "eng-02", "eng-03", "eng-04", "eng-05",
      "reas-01", "reas-02", "reas-03", "reas-04", "reas-05"
    ]
  }
];
