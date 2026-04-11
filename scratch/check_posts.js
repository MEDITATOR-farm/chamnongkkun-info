const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '../src/content/posts');

if (!fs.existsSync(postsDirectory)) {
    console.log('Posts directory not found:', postsDirectory);
    process.exit(1);
}

const fileNames = fs.readdirSync(postsDirectory);
let errorCount = 0;

fileNames.filter(f => f.endsWith('.md')).forEach(fileName => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    try {
        matter(fileContents);
    } catch (e) {
        console.error(`Error in file: ${fileName}`);
        console.error(e.message);
        errorCount++;
    }
});

if (errorCount === 0) {
    console.log('All files are valid!');
} else {
    console.log(`Found ${errorCount} invalid files.`);
}
