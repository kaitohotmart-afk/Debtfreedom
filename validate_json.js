const fs = require('fs');

const files = [
    'public/locales/en/common.json',
    'public/locales/pt/common.json',
    'public/locales/af/common.json'
];

files.forEach(f => {
    try {
        const content = fs.readFileSync(f, 'utf8');
        JSON.parse(content);
        console.log(`✅ ${f} is valid JSON`);
    } catch (e) {
        console.error(`❌ ${f} is INVALID JSON: ${e.message}`);
        // Find approximate location
        const lines = fs.readFileSync(f, 'utf8').split('\n');
        console.error(`Error around line: ${e.message.match(/position (\d+)/)?.[1] || 'unknown'}`);
    }
});
