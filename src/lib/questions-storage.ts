import { getStoredExams, saveStoredExams } from "./exams-storage";
import { Question } from "@/types/exam";

export interface QuestionWithContext extends Question {
  examId: string;
  examTitle: string;
  subject: string;
  academicGrade: string;
  teacherName: string;
  timesUsed: number;
}

export function getAllQuestions(locale: string): QuestionWithContext[] {
  const exams = getStoredExams(locale);
  const questionsList: QuestionWithContext[] = [];

  exams.forEach((exam) => {
    if (exam.examSections && Array.isArray(exam.examSections)) {
      exam.examSections.forEach((section) => {
        if (section.questions && Array.isArray(section.questions)) {
          section.questions.forEach((q) => {
            questionsList.push({
              ...q,
              examId: exam.id,
              examTitle: exam.title,
              subject: exam.subject,
              academicGrade: exam.grade,
              teacherName: exam.teacherName,
              timesUsed: exam.timesUsed || 1,
            });
          });
        }
      });
    }
  });

  return questionsList;
}

export function getQuestionById(locale: string, questionId: string): QuestionWithContext | null {
  const all = getAllQuestions(locale);
  return all.find((q) => q.id === questionId) || null;
}

export function updateStoredQuestion(locale: string, updatedQuestion: Question): boolean {
  const exams = getStoredExams(locale);
  let found = false;

  const newExams = exams.map((exam) => {
    if (!exam.examSections) return exam;
    const newSections = exam.examSections.map((sec) => {
      if (!sec.questions) return sec;
      const questionIndex = sec.questions.findIndex((q) => q.id === updatedQuestion.id);
      if (questionIndex !== -1) {
        found = true;
        const newQuestions = [...sec.questions];
        newQuestions[questionIndex] = { ...newQuestions[questionIndex], ...updatedQuestion };
        return { ...sec, questions: newQuestions };
      }
      return sec;
    });
    return { ...exam, examSections: newSections };
  });

  if (found) {
    saveStoredExams(locale, newExams);
  }
  return found;
}

export function addStoredQuestion(
  locale: string,
  newQuestion: Question,
  context: {
    examId?: string;
    grade?: string;
    subject?: string;
    teacherName?: string;
  },
): void {
  const exams = getStoredExams(locale);

  if (context.examId && context.examId !== "none") {
    let inserted = false;
    const updatedExams = exams.map((exam) => {
      if (exam.id === context.examId) {
        inserted = true;
        const sections =
          exam.examSections && exam.examSections.length > 0 ? [...exam.examSections] : [];
        if (sections.length === 0) {
          sections.push({
            id: `sec-${Date.now()}`,
            title: locale === "ar" ? "القسم الأول" : "Section 1",
            questions: [newQuestion],
          });
        } else {
          sections[0] = {
            ...sections[0],
            questions: [...(sections[0].questions || []), newQuestion],
          };
        }
        return {
          ...exam,
          examSections: sections,
          numberOfQuestions: (exam.numberOfQuestions || 0) + 1,
        };
      }
      return exam;
    });

    if (inserted) {
      saveStoredExams(locale, updatedExams);
      return;
    }
  }

  // If standalone / no exam chosen, append to first matching exam or create synthetic exam wrapper
  const targetExam = exams[0];
  if (targetExam) {
    const updatedExams = exams.map((exam, idx) => {
      if (idx === 0) {
        const sections =
          exam.examSections && exam.examSections.length > 0 ? [...exam.examSections] : [];
        if (sections.length === 0) {
          sections.push({
            id: `sec-${Date.now()}`,
            title: locale === "ar" ? "القسم الأول" : "Section 1",
            questions: [newQuestion],
          });
        } else {
          sections[0] = {
            ...sections[0],
            questions: [...(sections[0].questions || []), newQuestion],
          };
        }
        return {
          ...exam,
          examSections: sections,
          numberOfQuestions: (exam.numberOfQuestions || 0) + 1,
        };
      }
      return exam;
    });
    saveStoredExams(locale, updatedExams);
  }
}
