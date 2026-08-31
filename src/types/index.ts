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
  sleeve?: "Full sleeve" | "Half sleeve" | string;
  kitType?: "Home" | "Away" | "Third" | "Retro" | string;
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
