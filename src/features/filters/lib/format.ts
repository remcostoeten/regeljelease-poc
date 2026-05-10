import type { FieldOption } from "./types";

export function toLabel(s: { value: string; displayName?: string }): string {
  return s.displayName ?? s.value;
}

export function toOptions(
  items: { value: string; displayName?: string }[],
): FieldOption[] {
  return items.map((s) => ({ label: toLabel(s), value: s.value }));
}

export function formatTotal(n: number): string {
  return n.toLocaleString("nl-NL");
}
