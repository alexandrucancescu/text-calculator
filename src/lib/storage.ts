import type { SavedCalculation } from "../types";

const STORAGE_KEY = "text-calculator-history";

export function loadHistory(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(
  calculations: SavedCalculation[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(calculations),
  );
}
