export type CoursePeriod = "monthly" | "yearly" | "termBased";
export type CourseVenue = "center" | "online" | "all";
export type LessonType = "videoAndText" | "text";
export type LessonCategory = "independent" | "course-dependent";
export type LessonPublishStatus = "draft" | "published" | "scheduled";

export interface ExamQuestionOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  options?: ExamQuestionOption[];
  correctAnswer: string | number | boolean;
  grade: number;
  explanation?: string;
}

export interface ExamContent {
  id: string;
  title: string;
  passingScore: number;
  totalGrade: number;
  questions: ExamQuestion[];
}

export interface LinkedExam {
  sectionId: string;
  examContent: ExamContent;
}

export interface LessonAttachment {
  id: string;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "image" | "doc" | "zip";
  sizeInBytes?: number;
}

export interface Lesson {
  id: string;
  type?: LessonType;
  title: string;
  description?: string;
  coverImage?: string;
  lectureVideoLink?: string;
  writtenText?: string;
  grade?: string;
  subject?: string;
  teacherName?: string;

  // Attachments and Exams
  hasPdfAttachments?: boolean;
  pdfFiles?: LessonAttachment[];
  hasImageAttachments?: boolean;
  imageFiles?: LessonAttachment[];
  isLinkedToExam?: boolean;
  linkedExamId?: string;
  linkedExamTitle?: string;
  isRequiredPassExam?: boolean;

  // Organization and publish status
  venue?: CourseVenue;
  lessonCategory?: LessonCategory;
  courseId?: string;
  courseTitle?: string;
  sectionId?: string;
  publishStatus?: LessonPublishStatus;
  scheduledPublishDate?: string;

  attachments?: LessonAttachment[];
}

export interface SectionTest {
  id: string;
  title: string;
  testContent: ExamContent;
}

export interface CourseSection {
  id: string;
  title: string;
  isDraft: boolean;
  isLinkedToExam: boolean;
  linkedExam?: LinkedExam;
  isRequiredPassExamForNextSection: boolean;
  lessons: Lesson[];
  tests: SectionTest[];
}

export interface Course {
  id: string;
  coverImage: string;
  title: string;
  description: string;
  previewVideoLink?: string;
  subject: string;
  grade: string;
  teacherName: string;
  period: CoursePeriod;
  date: string;
  numberOfLessons: number;
  price: number;
  isFree: boolean;
  currency: string;
  hasOffer: boolean;
  offerPercentage?: string;
  hasTimeLimit: boolean;
  timeLimitValue?: number;
  isSplitToGroups: boolean;
  venue: CourseVenue;
  numberOfParticipants: number;
  isDraft: boolean;
  sections: CourseSection[];
}
