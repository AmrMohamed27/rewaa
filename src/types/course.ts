export type CoursePeriod = "monthly" | "yearly" | "termBased" | (string & {});
export type CourseVenue = "center" | "online" | "all";
export type LessonType = "videoAndText" | "text";
export type LessonCategory = "independent" | "course-dependent";
export type LessonPublishStatus = "draft" | "published" | "scheduled";

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
  linkedExamId?: string; // FK → Exam.id
  linkedExamTitle?: string; // denormalized
  isRequiredPassExam?: boolean;

  // Organization and publish status
  venue?: CourseVenue;
  lessonCategory?: LessonCategory;
  courseId?: string; // FK → Course.id
  courseTitle?: string; // denormalized
  sectionId?: string; // FK → CourseSection.id
  publishStatus?: LessonPublishStatus;
  scheduledPublishDate?: string;

  attachments?: LessonAttachment[];
}

export interface CourseSection {
  id: string;
  title: string;
  isDraft: boolean;
  status?: LessonPublishStatus;
  scheduledPublishDate?: string;
  isLinkedToExam: boolean;
  linkedExamId?: string; // FK → Exam.id (replaces embedded ExamContent)
  linkedExamTitle?: string;
  isRequiredPassExamForNextSection: boolean;
  lessons: Lesson[];
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
  offerStartDate?: string;
  offerEndDate?: string;
  hasTimeLimit: boolean;
  timeLimitValue?: number;
  isSplitToSections: boolean;
  venue: CourseVenue;
  numberOfParticipants: number;
  isDraft: boolean;
  sections: CourseSection[];
}
