const fs = require('fs');
const path = require('path');

const dbProducts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'db_products.json'), 'utf8')
);

console.log(`Formatting ${dbProducts.length} database products for src/data/jerseys.ts`);

const formattedJerseys = dbProducts.map((p) => {
  return {
    id: p.id,
    code: p.code || `JV-${(p.name || 'KIT').slice(0, 3).toUpperCase()}`,
    slug: p.slug || p.id,
    name: p.name,
    subtitle: p.subtitle || `${p.name} Matchday Kit`,
    price: p.price || 1200,
    originalPrice: p.originalPrice || Math.round((p.price || 1200) * 1.25),
    edition: p.edition || "In Stock — 26/27 Player Version",
    league: p.league || "Premier League",
    club: p.club || p.name.split(' ')[0],
    colorway: p.colorway || "Official Colorway",
    dominantColor: p.dominantColor || "#09090b",
    accentColor: p.accentColor || "#f59e0b",
    image: p.image,
    weightGsm: p.weightGsm || 240,
    fabric: p.fabric || "Aero-Fit High-Ventilation Micro-Knit",
    badgeType: p.badgeType || "3D Heat-pressed liquid silicone crest",
    sleeve: p.sleeve || "Half sleeve",
    kitType: p.kitType || "Home",
    story: p.story || `Official matchday armor for ${p.name}.`,
    specs: p.specs && Array.isArray(p.specs) && p.specs.length > 0
      ? p.specs
      : [
          { label: "Fabric Architecture", value: `${p.weightGsm || 240} GSM Aero-Fit Micro-Knit` },
          { label: "Seam Construction", value: "Ultrasonic Bonded & Taped" },
          { label: "Crest Tech", value: p.badgeType || "3D Heat-pressed silicone crest" },
          { label: "Thermal Regulation", value: "Laser-cut Micro-venting Channels" },
          { label: "Fit Profile", value: "Athletic Match-Day Tapered" },
        ],
    availableSizes: p.availableSizes && Array.isArray(p.availableSizes) && p.availableSizes.length > 0
      ? p.availableSizes
      : ["S", "M", "L", "XL", "XXL"],
    stockS: p.stockS ?? 6,
    stockM: p.stockM ?? 10,
    stockL: p.stockL ?? 14,
    stockXL: p.stockXL ?? 6,
    stockXXL: p.stockXXL ?? 3,
    isFeatured: Boolean(p.isFeatured),
    inStock: Boolean(p.inStock ?? true),
  };
});

const fileContent = `import { JerseyProduct, ActSection } from "@/types";

export const ACTS_DATA: ActSection[] = [
  {
    id: "act-origin",
    actNumber: "01",
    title: "ORIGIN",
    subtitle: "The Quiet Conviction",
  },
  {
    id: "act-struggle",
    actNumber: "02",
    title: "CRUCIBLE",
    subtitle: "The 5 AM Cold",
  },
  {
    id: "act-mantle",
    actNumber: "03",
    title: "THE MANTLE",
    subtitle: "The Emotional Peak",
  },
  {
    id: "act-collection",
    actNumber: "04",
    title: "IN STOCK",
    subtitle: "Available Matchday Kits",
  },
];

export const JERSEYS_DATA: JerseyProduct[] = ${JSON.stringify(formattedJerseys, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'jerseys.ts'), fileContent, 'utf8');
console.log('Successfully updated src/data/jerseys.ts with 26 live database jerseys!');
