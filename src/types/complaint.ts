export interface ExamComplaint {
  id: string;
  examId: string;
  studentId?: string;
  studentName: string;
  studentImage?: string;
  phoneNumber: string;
  complaintTitle: string;
  complaintDescription: string;
  dateOfComplaint: string; // ISO string
}
