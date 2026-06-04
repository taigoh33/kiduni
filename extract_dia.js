const fs = require('fs');
const content = fs.readFileSync('/src/constants/content.ts', 'utf8');
const categories = content.match(/category:\s*'dia_[^']*'/g) || [];
const uniqueCategories = [...new Set(categories.map(c => c.match(/'([^']*)'/)[1]))];
console.log(uniqueCategories.sort().join('\n'));
