const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(r => {
        content = content.replace(r.search, r.replace);
    });

    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${filePath}`);
    }
}

replaceInFile('resources/js/Layouts/AuthenticatedLayout.jsx', [
    { search: />\{flash\.success\}<\/div>/g, replace: ">{flash.success}</div>" }, // no need, already handled by backend
]);

console.log('Skipped replacing flash.success since backend translates it natively now.');
