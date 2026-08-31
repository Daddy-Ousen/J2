const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const jerseysDir = path.join(__dirname, '..', 'public', 'jerseys');

async function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  console.log(`Compressing ${files.length} images in ${dirPath}...`);

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
    const filePath = path.join(dirPath, file);
    const statBefore = fs.statSync(filePath);

    // Only process if larger than 200KB or unoptimized
    try {
      const buffer = fs.readFileSync(filePath);
      const optimized = await sharp(buffer)
        .resize({ width: 900, withoutEnlargement: true, fit: 'inside' })
        .jpeg({ quality: 80, mozjpeg: true, progressive: true })
        .toBuffer();

      fs.writeFileSync(filePath, optimized);
      const statAfter = fs.statSync(filePath);
      console.log(`✓ ${file}: ${Math.round(statBefore.size / 1024)} KB -> ${Math.round(statAfter.size / 1024)} KB (${Math.round((1 - statAfter.size / statBefore.size) * 100)}% reduction)`);
    } catch (err) {
      console.error(`Failed to compress ${file}:`, err.message);
    }
  }
}

async function main() {
  await processDirectory(uploadsDir);
  console.log('Finished image compression!');
}

main().catch(console.error);
