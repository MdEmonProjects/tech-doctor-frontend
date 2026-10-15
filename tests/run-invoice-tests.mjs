import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const directory = await mkdtemp(join(tmpdir(), 'tech-doctor-invoice-'));
try {
  const outfile = join(directory, 'invoice.mjs');
  await build({ entryPoints: ['tests/invoice.ts'], outfile, bundle: true, platform: 'node', format: 'esm', banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" } });
  await import(pathToFileURL(outfile).href);
} finally {
  await rm(directory, { recursive: true, force: true });
}
