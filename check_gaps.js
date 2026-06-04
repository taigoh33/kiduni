const fs = require('fs');
const content = fs.readFileSync('src/constants/content.ts', 'utf8');
const regex = /id: 'dia-(\d+)'/g;
let match;
const ids = [];
while ((match = regex.exec(content)) !== null) {
  ids.push(parseInt(match[1]));
}
ids.sort((a, b) => a - b);
const gaps = [];
for (let i = 0; i < ids.length - 1; i++) {
  if (ids[i+1] !== ids[i] + 1) {
    gaps.push({ from: ids[i], to: ids[i+1] });
  }
}
console.log('Total IDs found:', ids.length);
console.log('Min ID:', Math.min(...ids));
console.log('Max ID:', Math.max(...ids));
console.log('Gaps:', gaps);
