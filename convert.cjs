const fs = require('fs');

function convertToJsx(inputFile, outputFile) {
    let content = fs.readFileSync(inputFile, 'utf8');

    // Remove layout tags
    content = content.replace(/@extends\('.*?'\)/g, '');
    content = content.replace(/@php.*?@endphp/gs, '');
    content = content.replace(/@section\('.*?'(.*?)\)/g, '');
    content = content.replace(/@endsection/g, '');

    // Convert class to className
    content = content.replace(/class="/g, 'className="');
    
    // Fix styles: style="color:red; margin: 10px;" -> style={{color: 'red', margin: '10px'}}
    // This is hard to do perfectly with regex, so we'll just do a very basic one or leave it for manual fixing.
    // Actually, it's safer to just let me fix the styles manually if they error out, or use a package.
    // A quick hack for inline styles (not perfect, but covers some basics):
    content = content.replace(/style="([^"]*)"/g, (match, p1) => {
        const styles = p1.split(';').filter(s => s.trim() !== '');
        const objStr = styles.map(s => {
            let [key, val] = s.split(':');
            if(!val) return '';
            key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return `${key}: '${val.trim().replace(/'/g, "\\'")}'`;
        }).filter(s => s).join(', ');
        return `style={{${objStr}}}`;
    });

    // Convert Blade variables to JSX
    content = content.replace(/\{\{\s*(.*?)\s*\}\}/g, '{$1}');

    // Convert asset() helper
    content = content.replace(/\{asset\('(.*?)'\)\}/g, '"/$1"');

    // Convert route() helper
    content = content.replace(/\{route\((.*?)\)\}/g, '{route($1)}');

    // Basic @if
    content = content.replace(/@if\((.*?)\)/g, '{($1) ? ( <React.Fragment>');
    content = content.replace(/@else/g, '</React.Fragment> ) : ( <React.Fragment>');
    content = content.replace(/@endif/g, '</React.Fragment> )}');

    // Basic @foreach
    content = content.replace(/@foreach\((.*?) as (.*?)\)/g, '{$1.map($2 => ( <React.Fragment key={Math.random()}>');
    content = content.replace(/@endforeach/g, '</React.Fragment> ))}');

    // Remove comments
    content = content.replace(/<!--(.*?)-->/gs, '{/* $1 */}');

    fs.writeFileSync(outputFile, content);
    console.log(`Converted ${inputFile} to ${outputFile}`);
}

convertToJsx('resources/views/home.blade.php', 'temp_home.jsx');
convertToJsx('resources/views/venues/index.blade.php', 'temp_index.jsx');
convertToJsx('resources/views/venues/show.blade.php', 'temp_show.jsx');

