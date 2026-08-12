const fs = require('fs');

['temp_home.jsx', 'temp_index.jsx', 'temp_show.jsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix missing outer braces for inline styles
  content = content.replace(/style=\{([a-zA-Z]+):\s*'(.*?)'\}/g, 'style={{$1: \'$2\'}}');
  content = content.replace(/style=\{([a-zA-Z]+):\s*'(.*?)',\s*([a-zA-Z]+):\s*'(.*?)'\}/g, 'style={{$1: \'$2\', $3: \'$4\'}}');
  content = content.replace(/style=\{([a-zA-Z]+):\s*'(.*?)',\s*([a-zA-Z]+):\s*'(.*?)',\s*([a-zA-Z]+):\s*'(.*?)'\}/g, 'style={{$1: \'$2\', $3: \'$4\', $5: \'$6\'}}');
  content = content.replace(/style=\{([a-zA-Z]+):\s*'(.*?)',\s*([a-zA-Z]+):\s*'(.*?)',\s*([a-zA-Z]+):\s*'(.*?)',\s*([a-zA-Z]+):\s*'(.*?)'\}/g, 'style={{$1: \'$2\', $3: \'$4\', $5: \'$6\', $7: \'$8\'}}');

  fs.writeFileSync(file, content);
  console.log('Fixed styles in', file);
});
