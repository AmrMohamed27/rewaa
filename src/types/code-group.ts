export interface CodeGroup {
  id: string;
  courseId: string;
  courseTitle: string;
  price: number;
  totalCodes: number;
  availableCodes: number;
  soldCodes: number;
  usedCodes: number;
  codePrefix?: string;
  expiryDate: string; // ISO date string YYYY-MM-DD
  createdAt: string; // ISO date string YYYY-MM-DD
}
