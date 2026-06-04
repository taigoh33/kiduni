const fs = require('fs');
const path = 'src/constants/content.ts';
let content = fs.readFileSync(path, 'utf8');

let counter = 1;
content = content.replace(/id: 'dia-\d+'/g, () => {
    return `id: 'dia-${counter++}'`;
});

fs.writeFileSync(path, content);
console.log(`Renumbered ${counter - 1} items.`);
