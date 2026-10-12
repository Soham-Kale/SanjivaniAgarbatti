// Loads .env.local (then .env) into process.env for the command-line scripts, the way Next does.
import { existsSync, readFileSync } from 'node:fs';

for (const file of ['.env.local', '.env']) {
  const path = new URL(`../${file}`, import.meta.url);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || m[1] in process.env) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Add it to frontend/.env.local first.');
  process.exit(1);
}
