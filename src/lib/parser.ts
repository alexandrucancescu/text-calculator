import type { CalculationResult, ParsedRow } from "../types";

const NUMBER_RE = /^([+-]?\d+(?:[.,]\d+)?)(?:\s+(.*))?$/;

export function parseRow(line: string): ParsedRow {
  const trimmed = line.trim();

  if (trimmed === "") {
    return {
      raw: line,
      kind: "empty",
      value: null,
      label: null,
    };
  }

  if (trimmed.startsWith("#")) {
    return {
      raw: line,
      kind: "comment",
      value: null,
      label: null,
    };
  }

  const match = trimmed.match(NUMBER_RE);
  if (match) {
    const value = parseFloat(match[1].replace(",", "."));
    const label = match[2]?.trim() || null;
    return { raw: line, kind: "valid", value, label };
  }

  return {
    raw: line,
    kind: "invalid",
    value: null,
    label: null,
  };
}

export function computeResult(text: string): CalculationResult {
  const rows = text.split("\n").map(parseRow);
  const validRows = rows.filter(
    (r): r is ParsedRow & { value: number } =>
      r.kind === "valid" && r.value !== null,
  );

  const validValues = validRows.map((r) => r.value);
  const equation = validValues.join(" + ");
  const total = parseFloat(
    validValues.reduce((sum, v) => sum + v, 0).toFixed(10),
  );
  const autoTitle = validRows
    .map((r) => r.label)
    .filter(Boolean)
    .join(" ");

  return { rows, validValues, equation, total, autoTitle };
}
