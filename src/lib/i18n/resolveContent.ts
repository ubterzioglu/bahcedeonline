import type { Locale } from "./types";

/**
 * Pick the value of a multilingual text field, falling back to the TR/base field
 * when the requested locale's column is empty or null.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T & string>(
  row: T,
  field: K,
  locale: Locale,
): string {
  if (locale === "tr") return (row[field] as string | null | undefined) ?? "";
  const enKey = `${field}_en` as keyof T & string;
  const enVal = row[enKey] as string | null | undefined;
  if (enVal && enVal.trim().length > 0) return enVal;
  return (row[field] as string | null | undefined) ?? "";
}

/**
 * Same but for array fields (e.g. tags → tags_en).
 */
export function pickArray<T extends Record<string, unknown>, K extends keyof T & string>(
  row: T,
  field: K,
  locale: Locale,
): string[] {
  if (locale === "tr") return ((row[field] as string[] | null | undefined) ?? []) as string[];
  const enKey = `${field}_en` as keyof T & string;
  const enVal = row[enKey] as string[] | null | undefined;
  if (enVal && enVal.length > 0) return enVal;
  return ((row[field] as string[] | null | undefined) ?? []) as string[];
}
