const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'resources/js');
let results = [];

// Accents or common French words. This regex tries to find text that contains typical french characters or words.
const frenchRegex = /[éèêàçôûî]|(\b(le|la|les|votre|vous|réservation|disponible|avec|pour|dans|sur|espace)\b)/i;

// Very basic parsing to avoid t('...') or import statements
// We'll read line by line.
function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        // skip comments
        if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) return;
        
        // skip import/export
        if (line.trim().startsWith('import ') || line.trim().startsWith('export ')) return;
        
        // ignore if line contains t(
        // this is a naive check, but useful for a quick diagnostic
        if (line.includes('t(')) {
            // we should still check if there is OTHER text on the line, but for simplicity let's skip
            // actually let's just replace t('...') with empty string and check the rest
            line = line.replace(/t\(['"].*?['"]\)/g, '');
        }

        // check if it has French
        if (frenchRegex.test(line)) {
            // exclude some common coding words that might match
            if (!line.includes('let ') && !line.includes('const ') && !line.includes('var ') && !line.includes('className=')) {
                // To avoid CSS and HTML tags, let's extract what looks like text content or string literals
                // We'll just output the line for manual review
                results.push({
                    file: filePath.replace(__dirname, ''),
                    line: index + 1,
                    content: line.trim()
                });
            }
        }
    });
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            scanFile(fullPath);
        }
    }
}

walkDir(jsDir);

console.log(`Found ${results.length} potential hardcoded French strings:`);
results.forEach(res => {
    console.log(`[${res.file}:${res.line}] ${res.content}`);
});

fs.writeFileSync('diagnostic_results.json', JSON.stringify(results, null, 2));
