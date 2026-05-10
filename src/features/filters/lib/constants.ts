export const FILTER_USPS = [
  "+30.000 voertuigen",
  "Binnen een dag geregeld",
  "Zonder jaarcijfers",
] as const;

export const PRIMARY_FILTERS = [
  {
    label: "Merk",
    placeholder: "Voeg een merk toe",
    selected: "Ford",
    type: "select",
    options: ["Ford", "Volkswagen", "Mercedes-Benz", "Toyota", "Peugeot"],
  },
  {
    label: "Model",
    placeholder: "Kies de modellen",
    type: "select",
    options: ["Transit", "Custom", "Ranger", "Fiesta", "Focus"],
  },
  {
    label: "Budget tot",
    placeholder: "tot...",
    type: "select",
    options: ["€ 250", "€ 500", "€ 750", "€ 1.000", "€ 1.500"],
  },
  {
    label: "Trefwoord",
    placeholder: "Trefwoord... bijv. GTI of L2H2",
    type: "text",
  },
] as const;

export const EXTRA_FILTERS = [
  {
    label: "Brandstof",
    placeholder: "Kies brandstof",
    type: "select",
    options: ["Benzine", "Diesel", "Elektrisch", "Hybride", "LPG"],
  },
  {
    label: "Transmissie",
    placeholder: "Kies transmissie",
    type: "select",
    options: ["Automaat", "Handgeschakeld", "Semi-automaat"],
  },
  {
    label: "Carrosserie",
    placeholder: "Kies carrosserie",
    type: "select",
    options: ["Bestelbus", "Bestelauto", "SUV", "Stationwagon", "Bakwagen"],
  },
  {
    label: "Maximale kilometerstand",
    placeholder: "bijv. 50.000 km",
    type: "text",
  },
] as const;
