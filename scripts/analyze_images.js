const fs = require('fs');
const path = require('path');

const dbProducts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'db_products.json'), 'utf8')
);

const publicFiles = fs.readdirSync(path.join(__dirname, '..', 'public', 'jerseys'));

console.log(`Analyzing ${dbProducts.length} DB products and ${publicFiles.length} public jersey files...`);

for (const p of dbProducts) {
  const isBase64 = p.image && p.image.startsWith('data:');
  console.log({
    name: p.name,
    slug: p.slug,
    isBase64,
    imageLength: p.image?.length,
  });
}
