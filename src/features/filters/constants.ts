import type { FieldOption } from "./types";

export const FILTER_USPS = [
  "+30.000 voertuigen",
  "Binnen een dag geregeld",
  "Zonder jaarcijfers",
] as const;

/**
 * POC: Generates options for the price dropdown.
 * Since the API only returns a max price, we filter our hardcoded steps
 * to only show relevant options to the user.
 */
export const PRICE_OPTIONS: FieldOption[] = [
  { label: "€ 250", value: "250" },
  { label: "€ 500", value: "500" },
  { label: "€ 750", value: "750" },
  { label: "€ 1.000", value: "1000" },
  { label: "€ 1.500", value: "1500" },
  { label: "€ 2.000", value: "2000" },
  { label: "€ 2.500", value: "2500" },
  { label: "€ 3.000", value: "3000" },
  { label: "€ 4.000", value: "4000" },
  { label: "€ 5.000", value: "5000" },
  { label: "€ 7.500", value: "7500" },
  { label: "€ 10.000", value: "10000" },
];

