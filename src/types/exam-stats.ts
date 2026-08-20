import { QuestionDifficulty } from "./exam";

export interface ScoreDistributionBand {
  range: string; // e.g. "90-100%", "80-90%", "70-80%", "60-70%", "< 60%"
  count: number;
  isPassing: boolean;
}

export interface ExamDifficultyStatItem {
  difficulty: QuestionDifficulty;
  questionCount: number;
  successRate: number; // percentage 0 - 100
}

export interface StudentExamResult {
  id: string;
  studentId: string;
  fullName: string;
  image?: string;
  phoneNumber: string;
  gpa: string; // e.g. "3.85 / 4.0" or "94.5%"
  triesCount: number;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: string; // ISO date
}

export interface ExamStatsData {
  examId: string;
  totalStudents: number;
  studentsDeltaPercentage: number; // e.g. +12.5%
  averagePercentage: number; // e.g. 76.4%
  avgDeltaPercentage: number; // e.g. +3.8%
  passRate: number; // e.g. 84.5%
  passedStudentsCount: number;
  highestPercentage: number; // e.g. 100%
  highestScorersCount: number;
  lowestPercentage: number; // e.g. 32%
  lowestScorersCount: number;
  lastUpdatedAt: string; // ISO date string
  scoreDistribution: ScoreDistributionBand[];
  difficultyStats: ExamDifficultyStatItem[];
  studentResults: StudentExamResult[];
}
