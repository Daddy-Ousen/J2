const fs = require('fs');
const path = require('path');

// Read .env manually to ensure DATABASE_URL is set
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function main() {
  console.log('Fetching all products from database for image optimization...');
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Processing ${products.length} products...`);
  const updatedProducts = [];

  for (const p of products) {
    let imageUrl = p.image;

    if (p.image && p.image.startsWith('data:image/')) {
      const matches = p.image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const filename = `${p.slug || p.id}.${ext}`;
        const filePath = path.join(uploadsDir, filename);

        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/${filename}`;
        console.log(`Saved image for ${p.name} -> ${imageUrl} (${Math.round(buffer.length / 1024)} KB)`);

        // Update in DB
        await prisma.product.update({
          where: { id: p.id },
          data: { image: imageUrl },
        });
      }
    }

    updatedProducts.push({
      ...p,
      image: imageUrl,
    });
  }

  console.log('All DB products updated with lightweight image URLs!');

  // Now generate clean lightweight src/data/jerseys.ts
  const formattedJerseys = updatedProducts.map((p) => {
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
  console.log('Successfully wrote lightweight src/data/jerseys.ts (<50 KB)!');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Optimization error:', err);
  process.exit(1);
});
