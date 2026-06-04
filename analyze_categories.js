
import fs from 'fs';

const content = fs.readFileSync('src/constants/content.ts', 'utf8');
const categoriesMatch = content.match(/export const CATEGORIES: Category\[\] = \[([\s\S]*?)\];/);

if (categoriesMatch) {
    const categoriesStr = categoriesMatch[1];
    const categoryBlocks = categoriesStr.split('},').filter(b => b.trim() !== '');
    
    let dialogueCount = 0;
    let sentencesCount = 0;
    let vocabularyCount = 0;
    
    categoryBlocks.forEach(block => {
        const idMatch = block.match(/id: '([^']*)'/);
        const groupMatch = block.match(/group: '([^']*)'/);
        const labelMatch = block.match(/label: { zh: '([^']*)'/);
        
        if (idMatch && groupMatch) {
            const id = idMatch[1];
            const group = groupMatch[1];
            const label = labelMatch ? labelMatch[1] : 'No Label';
            
            if (group === 'dialogue') {
                dialogueCount++;
                console.log(`DIALOGUE [${dialogueCount}]: ID=${id}, Label=${label}`);
            } else if (group === 'sentences') {
                sentencesCount++;
                console.log(`SENTENCE [${sentencesCount}]: ID=${id}, Label=${label}`);
            } else if (group === 'vocabulary') {
                vocabularyCount++;
            }
        }
    });
    
    console.log(`\nTotals: Dialogue=${dialogueCount}, Sentences=${sentencesCount}, Vocabulary=${vocabularyCount}`);
} else {
    console.log('CATEGORIES array not found');
}
