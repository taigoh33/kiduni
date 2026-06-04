const fs = require('fs');
const content = fs.readFileSync('src/constants/content.ts', 'utf8');

const categoriesMatch = content.match(/export const CATEGORIES: Category\[\] = \[([\s\S]*?)\];/);
const categoriesText = categoriesMatch[1];

const dialogueCats = [];
const catRegex = /\{[\s\S]*?id: '([^']+)'[\s\S]*?group: 'dialogue'[\s\S]*?\}/g;
let m;
while ((m = catRegex.exec(categoriesText)) !== null) {
    dialogueCats.push(m[1]);
}

console.log(`Expected ${dialogueCats.length} dialogue categories.`);

const itemCatsMatch = content.match(/export const LEARNING_ITEMS: LearningItem\[\] = \[([\s\S]*?)\];/);
const itemsText = itemCatsMatch[1];
const itemCats = new Set();
const itemCatRegex = /category: '([^']+)'/g;
while ((m = itemCatRegex.exec(itemsText)) !== null) {
    itemCats.add(m[1]);
}

const emptyCats = dialogueCats.filter(id => !itemCats.has(id));
console.log(`Empty dialogue categories: ${emptyCats.length}`);
if (emptyCats.length > 0) {
    console.log(emptyCats);
}

const filledCats = dialogueCats.filter(id => itemCats.has(id));
console.log(`Filled dialogue categories: ${filledCats.length}`);
console.log(filledCats);
