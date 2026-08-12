const fs = require('fs');

function htmlToJsx(html) {
    // Basic structural replacements
    let jsx = html
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        .replace(/<!--(.*?)-->/gs, '{/* $1 */}');
        
    // Fix unclosed tags
    jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
    jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
    jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br />');

    // Convert style="color: red; margin-top: 10px;" to style={{color: 'red', marginTop: '10px'}}
    jsx = jsx.replace(/style="([^"]*)"/g, (match, stylesString) => {
        const styles = stylesString.split(';').filter(s => s.trim() !== '');
        if (styles.length === 0) return 'style={{}}';
        
        const styleObjStr = styles.map(s => {
            const parts = s.split(':');
            if (parts.length < 2) return '';
            let key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            let value = parts.slice(1).join(':').trim();
            // escape single quotes in value
            value = value.replace(/'/g, "\\'");
            return `${key}: '${value}'`;
        }).filter(s => s).join(', ');
        
        return `style={{${styleObjStr}}}`;
    });

    return jsx;
}

const file = fs.readFileSync('resources/views/home.blade.php', 'utf8');
const bodyMatch = file.match(/@section\('content'\)([\s\S]*?)@endsection/);
let body = bodyMatch ? bodyMatch[1] : file;

// Fix blade variables
body = body.replace(/\{\{\s*route\('venues.index'\)\s*\}\}/g, "{route('venues.index')}");
body = body.replace(/\{\{\s*route\('venues.index',\s*\[.*?\]\)\s*\}\}/g, "{route('venues.index')}"); // simplifying
body = body.replace(/\{\{\s*\$venue->(.*?)\s*\}\}/g, "{venue.$1}");
body = body.replace(/\{\{\s*asset\('(.*?)'\)\s*\}\}/g, "'/$1'");
body = body.replace(/@foreach.*?@endforeach/gs, '{/* TODO FOREACH */}');
body = body.replace(/@if.*?@endif/gs, '{/* TODO IF */}');
body = body.replace(/\{\{\s*(.*?)\s*\}\}/g, "{$1}"); // catch all other blade

const finalJsx = `import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Home({ auth }) {
    return (
        <PublicLayout auth={auth}>
            <Head title="Celebra Cameroon - Trouver & Réserver des Salles" />
            ${htmlToJsx(body)}
        </PublicLayout>
    );
}
`;

fs.writeFileSync('resources/js/Pages/Home.jsx', finalJsx);
console.log('Home.jsx restored.');
