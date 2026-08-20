export type Gender = "male" | "female";

export type RegistrationType = "center" | "online" | "hybrid" | "external";

export type TransactionType = "deposit" | "withdraw" | "refund" | "adjustment";

export interface StudentTransaction {
  id: string;
  studentId: string;
  type: TransactionType;
  amount: number;
  notes?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  additionalName?: string;
  phoneNumber: string;
  parentPhoneNumber: string;
  gender: Gender;
  email: string;
  image?: string;
  password?: string;
  country: string;
  state: string; // state/governorate
  grade: string;
  registrationType: RegistrationType;
  coursesCount?: number;
  enrolledCourseIds?: string[];
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
}
