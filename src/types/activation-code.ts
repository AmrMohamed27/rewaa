export type CodeStatus = "available" | "sold" | "used";

export interface ActivationCode {
  id: string;
  groupId: string;
  courseId: string;
  courseTitle: string;
  code: string;
  cost: number;
  status: CodeStatus;
  expiryDate: string; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD
}
