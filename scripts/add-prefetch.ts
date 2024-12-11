import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imagesPath = path.resolve(__dirname, '../', 'dist', 'assets');

const htmlPath = path.resolve(__dirname, '../', 'dist', 'index.html');

const images = fs
    .readdirSync(imagesPath)
    .filter((image) => image.endsWith('.png') || image.endsWith('.jpg'));
const html = fs.readFileSync(htmlPath).toString();
const searchString = '<meta charset="UTF-8"/>';
const index = html.indexOf(searchString) + searchString.length;

const start = html.substring(0, index);
const end = html.substring(index);

const generatedString = images
    .map((image) => `<link rel="preload" href="assets/${image}" as="image">`)
    .join('\n    ');
fs.writeFileSync(htmlPath, `${start}\n    ${generatedString}\n${end}`);
// `<link rel="prefetch" href="https://ivan-sapeha.github.io/character-sheet/assets/concrete-wall-hd-BsgfGPzW.jpg" as="image">`;
