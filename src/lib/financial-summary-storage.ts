export interface FinancialMonthData {
  monthIndex: number; // 0 to 11
  weeks: [number, number, number, number]; // 4 weeks payments
}

export interface FinancialYearData {
  year: number;
  months: FinancialMonthData[];
}

export interface FinancialSummaryState {
  yearsData: Record<number, FinancialYearData>;
  todayPayments: { amount: number; prevAmount: number };
  thisWeekPayments: { amount: number; prevAmount: number };
  thisMonthPayments: { amount: number; prevAmount: number };
}

const STORAGE_KEY = "rewaa_financial_summary";

function generateSeedData(): FinancialSummaryState {
  const years = [2026, 2025, 2024];
  const yearsData: Record<number, FinancialYearData> = {};

  // Base patterns for realistic payments
  const baseMonthlyPatterns: Record<number, number[]> = {
    2026: [12500, 14200, 15800, 13900, 16400, 18200, 17500, 21300, 19800, 22400, 24000, 25500],
    2025: [9500, 10200, 11800, 12900, 13400, 14200, 15000, 16300, 15800, 17400, 18000, 19500],
    2024: [7500, 8200, 8800, 9400, 9900, 10200, 11000, 11300, 12000, 12400, 13000, 13800],
  };

  years.forEach((yr) => {
    const pattern = baseMonthlyPatterns[yr];
    const months: FinancialMonthData[] = [];
    for (let m = 0; m < 12; m++) {
      const base = pattern[m];
      // Distribute into 4 weeks
      const w1 = Math.round(base * 0.22);
      const w2 = Math.round(base * 0.28);
      const w3 = Math.round(base * 0.24);
      const w4 = base - (w1 + w2 + w3);
      months.push({
        monthIndex: m,
        weeks: [w1, w2, w3, w4],
      });
    }
    yearsData[yr] = { year: yr, months };
  });

  return {
    yearsData,
    todayPayments: { amount: 3450, prevAmount: 2900 },
    thisWeekPayments: { amount: 18200, prevAmount: 16500 },
    thisMonthPayments: { amount: 21300, prevAmount: 19800 },
  };
}

export function getStoredFinancialSummary(): FinancialSummaryState {
  if (typeof window === "undefined") {
    return generateSeedData();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateSeedData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load financial summary from localStorage:", error);
    return generateSeedData();
  }
}

export function resetStoredFinancialSummary(): FinancialSummaryState {
  const fresh = generateSeedData();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      window.dispatchEvent(new Event("rewaa_financial_summary_updated"));
    } catch (error) {
      console.error("Failed to reset financial summary in localStorage:", error);
    }
  }
  return fresh;
}
