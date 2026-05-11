export type Suggestion = {
  value: string;
  displayName?: string;
};

export type RangeValue = {
  min: number;
  max: number;
};

export type HomeApiSuggestions = {
  bodyStyle: Suggestion[];
  brandName: Suggestion[];
  fuel: Suggestion[];
  mileage: RangeValue;
  modelName: Suggestion[];
  priceLease: RangeValue;
  transmission: Suggestion[];
};

export type HomeApiResponse = {
  url: string;
  total: number;
  suggestions: HomeApiSuggestions;
};

export type FieldOption = { label: string; value: string };

export type FilterParams = {
  brand?: string;
  model?: string;
  maxPrice?: string;
  fuel?: string;
  transmission?: string;
  bodyStyle?: string;
  maxMileage?: string;
  text?: string;
};

