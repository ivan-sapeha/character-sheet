import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const brokenFilePath = path.resolve(
    __dirname,
    '../',
    'node_modules/react-indexed-db-hook/src/indexed-hooks.ts',
);
const brokenFile = fs.readFileSync(brokenFilePath, 'utf-8');
// fixes wrong type resolution for package
fs.writeFileSync(
    brokenFilePath,
    brokenFile.replace(
        `const indexeddbConfiguration: { version: number; name: string } = {
  version: null,
  name: null,
};`,
        `const indexeddbConfiguration: { version: number; name: string } = {
  version: 0,
  name: '',
};`,
    ),
);
