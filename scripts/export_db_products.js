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

async function main() {
  console.log('Connecting to database...');
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  console.log(`Successfully fetched ${products.length} products from database.`);
  fs.writeFileSync(
    path.join(__dirname, '..', 'db_products.json'),
    JSON.stringify(products, null, 2)
  );
  console.log('Saved to db_products.json');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error fetching database products:', err);
  process.exit(1);
});
