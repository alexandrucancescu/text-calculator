export type RowKind = "valid" | "invalid" | "comment" | "empty";

export interface ParsedRow {
  raw: string;
  kind: RowKind;
  value: number | null;
  label: string | null;
}

export interface CalculationResult {
  rows: ParsedRow[];
  validValues: number[];
  equation: string;
  total: number;
  autoTitle: string;
}

export interface SavedCalculation {
  id: string;
  title: string;
  text: string;
  equation: string;
  total: number;
  savedAt: number;
}
