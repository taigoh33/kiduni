const fs = require('fs');
const path = 'src/constants/content.ts';
const content = fs.readFileSync(path, 'utf8');

// Extract category IDs
const categoriesMatch = content.match(/export const CATEGORIES: Category\[\] = \[([\s\S]*?)\];/);
const categoriesStr = categoriesMatch[1];
const categoryIds = [...categoriesStr.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
const dialogueCategoryIds = categoryIds.filter(id => {
    // Check if it belongs to dialogue group
    const entryMatch = categoriesStr.match(new RegExp(`id: '${id}',[\\s\\S]*?group: 'dialogue'`));
    return !!entryMatch;
});

console.log(`Found ${dialogueCategoryIds.length} dialogue categories in CATEGORIES.`);

// Extract items categories
const itemCategories = [...content.matchAll(/category: '([^']+)'/g)].map(m => m[1]);
const uniqueItemCategories = [...new Set(itemCategories)];

const missingInItems = dialogueCategoryIds.filter(id => !uniqueItemCategories.includes(id));

console.log(`Dialogue categories missing in LEARNING_ITEMS: ${missingInItems.length}`);
if (missingInItems.length > 0) {
    console.log('Missing IDs:', missingInItems);
}
