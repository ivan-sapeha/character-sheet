import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as images from 'react-icons/gi';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesPath = path.resolve(__dirname, '../', 'public');
const imagesPaths = {
    backgrounds: path.resolve(imagesPath, 'backgrounds', 'preprocessed'),
};

const writeImagesPaths = (folderPath: string, category: string) => {
    const imgUrls = fs
        .readdirSync(folderPath)
        .filter((file) => !file.startsWith('.') && !file.startsWith('test'))
        .map((img) => [category, 'preprocessed', img].join('/'));

    const outputPath = path.resolve(
        __dirname,
        '../',
        'public',
        `${category}.json`,
    );
    fs.writeFileSync(outputPath, JSON.stringify(imgUrls));
};
Object.entries(imagesPaths).forEach(([category, folderPath]) =>
    writeImagesPaths(folderPath, category),
);

const icons = {} as Record<string, string>;

Object.keys(images).map((key) => {
    const Component = images[key as keyof typeof images];
    const svgString = renderToStaticMarkup(createElement(Component));

    icons[key.replace('Gi', '')] = svgString
        .replace(
            '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">',
            '',
        )
        .replace('</svg>', '')
        .replaceAll('"', "'");
});
const iconsObject = {
    template:
        "<svg stroke='#000' fill='#000' stroke-width='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'>{path}</svg>",
    icons,
};
const outputPath = path.resolve(__dirname, '../', 'public', 'icons.json');
fs.writeFileSync(outputPath, JSON.stringify(iconsObject));
