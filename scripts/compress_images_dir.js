const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'public', 'images');

async function main() {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (!f.match(/\.(jpg|jpeg|png)$/i)) continue;
    const p = path.join(dir, f);
    const before = fs.statSync(p).size;
    const buf = fs.readFileSync(p);
    const opt = await sharp(buf)
      .resize({ width: 1400, withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toBuffer();
    fs.writeFileSync(p, opt);
    const after = fs.statSync(p).size;
    console.log(`${f}: ${Math.round(before/1024)}KB -> ${Math.round(after/1024)}KB`);
  }
}

main().catch(console.error);
