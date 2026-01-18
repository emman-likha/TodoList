import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

// Build main process
await build({
  entryPoints: [join(__dirname, '../electron/main.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: join(__dirname, '../dist-electron/main.js'),
  external: [
    'electron',
    'better-sqlite3',
    'fs',
    'path',
    'url',
    'os',
    'crypto',
    'util',
    'stream',
    'events',
    'buffer',
    'process',
  ],
  sourcemap: !isProduction,
  minify: isProduction,
});

// Build preload script
await build({
  entryPoints: [join(__dirname, '../electron/preload.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: join(__dirname, '../dist-electron/preload.js'),
  external: ['electron'],
  sourcemap: !isProduction,
  minify: isProduction,
});

// Note: Database files are bundled into main.js, no need to build separately

// Copy schema.sql to dist-electron
const distElectronDir = join(__dirname, '../dist-electron');
if (!existsSync(distElectronDir)) {
  mkdirSync(distElectronDir, { recursive: true });
}

const databaseDistDir = join(distElectronDir, 'database');
if (!existsSync(databaseDistDir)) {
  mkdirSync(databaseDistDir, { recursive: true });
}

copyFileSync(
  join(__dirname, '../database/schema.sql'),
  join(databaseDistDir, 'schema.sql')
);

console.log('✅ Electron build complete!');

