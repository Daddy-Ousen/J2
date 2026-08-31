export interface JerseyProduct {
  id: string;
  code: string;
  name: string;
  slug?: string;
  subtitle: string;
  price: number;
  originalPrice?: number | null;
  edition?: string;
  league?: string;
  club?: string;
  colorway?: string;
  dominantColor: string;
  accentColor: string;
  image: string;
  fallbackGradient?: string;
  weightGsm: number;
  fabric: string;
  badgeType: string;
  sleeve?: "Full sleeve" | "Half sleeve" | string;
  kitType?: "Home" | "Away" | "Third" | "Retro" | string;
  story: string;
  specs?: {
    label: string;
    value: string;
  }[];
  availableSizes?: string[];
  stockS?: number;
  stockM?: number;
  stockL?: number;
  stockXL?: number;
  stockXXL?: number;
  isFeatured?: boolean;
  inStock?: boolean;
}

export interface ActSection {
  id: string;
  actNumber: string;
  title: string;
  subtitle: string;
}

export type ConfiguratorView = "front" | "back" | "macro" | "orbit";

export interface CustomKitConfig {
  colorwayId: string;
  colorwayName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  hexCode: string;
  finish: "satin" | "matte" | "metallic";
  playerName: string;
  jerseyNumber: string;
  fontFamily: "modern" | "editorial" | "tech";
  crestFinish: "gold" | "stealth" | "prismatic";
  weaveId: string;
  weaveName: string;
  weaveGsm: number;
  weavePattern: "pique" | "jacquard" | "carbon" | "honeycomb";
}
