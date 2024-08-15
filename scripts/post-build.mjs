import fs from 'node:fs/promises';

await fs.writeFile('dist/esm/package.json', JSON.stringify({ type: 'module' }));
await fs.writeFile('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }));
