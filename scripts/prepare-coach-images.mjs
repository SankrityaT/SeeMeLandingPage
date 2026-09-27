import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../public/', import.meta.url);
const dir = new URL('coach-platform/', root);
const jobs = (await readdir(dir)).filter(name => name.endsWith('.png')).map(name => ({
  source: `coach-platform/${name}`,
  output: `coach-platform/${name.replace('.png', '.webp')}`,
  width: name.includes('mobile') ? 720 : name.includes('hero') && !name.startsWith('workspace') ? 800 : 1800,
}));
jobs.push(
  { source: 'coach-platform/workspace-hero.png', output: 'coach-platform/workspace-hero-small.webp', width: 900 },
  { source: 'coach-platform/coach-hero-background.jpg', output: 'coach-platform/coach-hero-background.webp', width: 1600 },
  ...['Marius.png', 'ken1.png', 'andrea.png'].map((source, i) => ({ source, output: `coach-platform/expert-${i}.webp`, width: 128 })),
  { source: 'SeeMeB2CIcon.png', output: 'coach-platform/brand-icon.webp', width: 64 },
  { source: '2ndLayerBackground_optimized.png', output: 'coach-platform/pilot-background.webp', width: 900 },
);
const records = [];
for (const job of jobs) {
  const result = await sharp(fileURLToPath(new URL(job.source, root))).resize({ width: job.width, withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toBuffer({ resolveWithObject: true });
  await writeFile(new URL(job.output, root), result.data);
  records.push({ ...job, width: result.info.width, height: result.info.height, bytes: result.data.length, sha256: createHash('sha256').update(result.data).digest('hex') });
}
await writeFile(new URL('optimized-images.json', dir), JSON.stringify({ description: 'Resized WebP derivatives of existing source captures; no content changes. Originals and capture provenance retained.', images: records }, null, 2) + '\n');
console.log(`Prepared ${records.length} images: ${records.reduce((sum, image) => sum + image.bytes, 0)} bytes total.`);
