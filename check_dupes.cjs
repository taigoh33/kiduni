const fs = require('fs');
const content = fs.readFileSync('src/constants/content.ts', 'utf8');
const categoriesMatch = content.match(/export const CATEGORIES: Category\[\] = \[([\s\S]*?)\];/);
const categoriesText = categoriesMatch[1];
const ids = [...categoriesText.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
const counts = {};
ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
const dupes = Object.keys(counts).filter(id => counts[id] > 1);
console.log('Duplicates:', dupes);
if (dupes.length > 0) {
    dupes.forEach(id => console.log(`${id}: ${counts[id]}`));
}
