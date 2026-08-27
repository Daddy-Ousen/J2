export interface JerseyProduct {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  price: number;
  edition: string;
  colorway: string;
  dominantColor: string;
  accentColor: string;
  image: string;
  fallbackGradient: string;
  weightGsm: number;
  fabric: string;
  badgeType: string;
  story: string;
  specs: {
    label: string;
    value: string;
  }[];
  availableSizes: string[];
}

export interface ActSection {
  id: string;
  actNumber: string;
  title: string;
  subtitle: string;
}
