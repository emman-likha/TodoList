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
  external: ['electron'],
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

// Build database files
await build({
  entryPoints: [
    join(__dirname, '../database/db.ts'),
    join(__dirname, '../database/todoService.ts'),
  ],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outdir: join(__dirname, '../dist-electron/database'),
  external: ['electron', 'better-sqlite3'],
  sourcemap: !isProduction,
  minify: isProduction,
});

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

