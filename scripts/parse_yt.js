const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/rhasa/.gemini/antigravity/brain/d120ae9d-92db-4148-9e6e-151ba8eeb3df/.system_generated/steps/3689/content.md';
if (fs.existsSync(filePath)) {
  const text = fs.readFileSync(filePath, 'utf8');
  
  // Extract title
  const titleMatch = text.match(/<title>([^<]+)<\/title>/i) || text.match(/"title":"([^"]+)"/);
  console.log('Title:', titleMatch ? titleMatch[1] : 'Not found');

  // Extract keywords or tags
  const keywordsMatch = text.match(/"keywords":(\[[^\]]+\])/);
  if (keywordsMatch) console.log('Keywords:', keywordsMatch[1]);

  // Extract description
  const descMatch = text.match(/"shortDescription":"([^"]+)"/) || text.match(/name="description" content="([^"]+)"/);
  if (descMatch) console.log('Description:', descMatch[1].slice(0, 300));
}
