import { ExamStatsData } from "@/types/exam-stats";
import { Exam } from "@/types/exam";
import { mockStudentsData } from "./mockStudentsData";

export function generateExamStats(exam: Exam, locale: "ar" | "en"): ExamStatsData {
  const isAr = locale === "ar";
  const passThreshold = exam.passingPercentage || 60;
  const rawStudents = mockStudentsData[locale] || mockStudentsData.ar;

  // Calculate total score of exam from sections/questions if available, default to 30
  let calculatedMaxScore = 0;
  if (exam.examSections && exam.examSections.length > 0) {
    exam.examSections.forEach((sec) => {
      sec.questions.forEach((q) => {
        calculatedMaxScore += q.grade || 5;
      });
    });
  }
  const totalScore = calculatedMaxScore > 0 ? calculatedMaxScore : 30;

  // Question counts by difficulty
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;

  if (exam.examSections && exam.examSections.length > 0) {
    exam.examSections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (q.difficulty === "easy") easyCount++;
        else if (q.difficulty === "medium") mediumCount++;
        else if (q.difficulty === "hard") hardCount++;
      });
    });
  }

  if (easyCount === 0 && mediumCount === 0 && hardCount === 0) {
    easyCount = Math.max(1, Math.round(exam.numberOfQuestions * 0.4));
    mediumCount = Math.max(1, Math.round(exam.numberOfQuestions * 0.4));
    hardCount = Math.max(1, exam.numberOfQuestions - easyCount - mediumCount);
  }

  // Pre-defined student mock scores
  const sampleGpas = [
    "3.95 / 4.0",
    "3.80 / 4.0",
    "3.65 / 4.0",
    "3.40 / 4.0",
    "3.10 / 4.0",
    "2.85 / 4.0",
    "2.60 / 4.0",
    "2.30 / 4.0",
    "3.90 / 4.0",
    "3.75 / 4.0",
    "3.50 / 4.0",
    "3.20 / 4.0",
  ];

  // Distribution weights
  const scoreMultipliers = [
    0.96, 0.92, 0.88, 0.84, 0.8, 0.76, 0.72, 0.68, 0.64, 0.6, 0.52, 0.44, 0.98, 0.9, 0.86, 0.78,
    0.74, 0.62, 0.58, 0.4,
  ];

  const studentResults = rawStudents.map((std, index) => {
    const fullName = [std.firstName, std.middleName, std.lastName, std.additionalName]
      .filter(Boolean)
      .join(" ");

    const multiplier = scoreMultipliers[index % scoreMultipliers.length];
    const score = Math.round(totalScore * multiplier);
    const percentage = Math.round((score / totalScore) * 100);
    const passed = percentage >= passThreshold;
    const triesCount = (index % (exam.triesAllowed || 2)) + 1;
    const gpa = sampleGpas[index % sampleGpas.length];

    const avatarPool = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    ];

    return {
      id: `res-${exam.id}-${std.id}`,
      studentId: std.id,
      fullName,
      image: std.image || avatarPool[index % avatarPool.length],
      phoneNumber: std.phoneNumber,
      gpa,
      triesCount,
      score,
      totalScore,
      percentage,
      passed,
      submittedAt: new Date(Date.now() - (index + 1) * 3600000 * 6).toISOString(),
    };
  });

  const totalStudents = exam.numberOfStudents || studentResults.length;
  const passedStudentsCount = Math.round(totalStudents * (exam.successRate / 100));

  // Build dynamic bands around passThreshold
  // Standard format: 90-100%, 80-90%, 70-80%, [passThreshold-70]%, below [passThreshold]%
  const bandBelowLabel = isAr ? `أقل من ${passThreshold}%` : `< ${passThreshold}%`;

  let bandBelowCount = 0;
  let band60_70Count = 0;
  let band70_80Count = 0;
  let band80_90Count = 0;
  let band90_100Count = 0;

  studentResults.forEach((res) => {
    if (res.percentage >= 90) band90_100Count++;
    else if (res.percentage >= 80) band80_90Count++;
    else if (res.percentage >= 70) band70_80Count++;
    else if (res.percentage >= passThreshold) band60_70Count++;
    else bandBelowCount++;
  });

  // Scale up to totalStudents
  const scale = totalStudents / studentResults.length;
  const scoreDistribution = [
    {
      range: "90-100%",
      count: Math.round(band90_100Count * scale) || 165,
      isPassing: 90 >= passThreshold,
    },
    {
      range: "80-90%",
      count: Math.round(band80_90Count * scale) || 280,
      isPassing: 80 >= passThreshold,
    },
    {
      range: "70-80%",
      count: Math.round(band70_80Count * scale) || 220,
      isPassing: 70 >= passThreshold,
    },
    {
      range: `${passThreshold}-70%`,
      count: Math.round(band60_70Count * scale) || 120,
      isPassing: true,
    },
    {
      range: bandBelowLabel,
      count: Math.round(bandBelowCount * scale) || 47,
      isPassing: false,
    },
  ];

  return {
    examId: exam.id,
    totalStudents,
    studentsDeltaPercentage: 12.5,
    averagePercentage: exam.successRate ? Math.min(95, Math.round(exam.successRate * 1.05)) : 76,
    avgDeltaPercentage: 3.2,
    passRate: exam.successRate || 74,
    passedStudentsCount,
    highestPercentage: 100,
    highestScorersCount: Math.round(totalStudents * 0.08) || 34,
    lowestPercentage: 38,
    lowestScorersCount: Math.round(totalStudents * 0.02) || 8,
    lastUpdatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    scoreDistribution,
    difficultyStats: [
      {
        difficulty: "easy",
        questionCount: easyCount,
        successRate: 91,
      },
      {
        difficulty: "medium",
        questionCount: mediumCount,
        successRate: 72,
      },
      {
        difficulty: "hard",
        questionCount: hardCount,
        successRate: 48,
      },
    ],
    studentResults,
  };
}
