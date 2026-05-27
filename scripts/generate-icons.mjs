/**
 * generate-icons.mjs
 * Converts src/app/fav.jpeg into all required favicon / icon sizes.
 *
 * Outputs:
 *   src/app/favicon.ico       — 16×16 + 32×32 multi-size ICO
 *   src/app/icon.png          — 32×32  (Next.js App Router favicon)
 *   src/app/apple-icon.png    — 180×180 (Apple touch icon)
 *   public/icon-192.png       — 192×192 (PWA manifest)
 *   public/icon-512.png       — 512×512 (PWA manifest)
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root      = join(__dirname, '..');
const src       = join(root, 'src/app/fav.jpeg');

// ── Minimal ICO encoder (PNG payload, supported by all modern browsers / OS) ──
function encodeIco(entries) {
  const HEADER_SIZE = 6;
  const DIR_SIZE    = 16;

  const header = Buffer.alloc(HEADER_SIZE);
  header.writeUInt16LE(0,               0); // Reserved
  header.writeUInt16LE(1,               2); // Type: ICO
  header.writeUInt16LE(entries.length,  4); // Image count

  let offset = HEADER_SIZE + DIR_SIZE * entries.length;

  const dirs = entries.map(({ buf, size }) => {
    const dir = Buffer.alloc(DIR_SIZE);
    // Width/Height: 0 means 256 px (use 0 only if size >= 256)
    dir.writeUInt8(size >= 256 ? 0 : size, 0);
    dir.writeUInt8(size >= 256 ? 0 : size, 1);
    dir.writeUInt8(0,  2); // Color count (0 = true color)
    dir.writeUInt8(0,  3); // Reserved
    dir.writeUInt16LE(1,  4); // Color planes
    dir.writeUInt16LE(32, 6); // Bits per pixel
    dir.writeUInt32LE(buf.length, 8);  // Data size
    dir.writeUInt32LE(offset,     12); // Data offset
    offset += buf.length;
    return dir;
  });

  return Buffer.concat([header, ...dirs, ...entries.map(e => e.buf)]);
}

// ── Resize helper ──────────────────────────────────────────────────────────────
async function resize(size) {
  return sharp(src)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();
}

// ── Ensure output directories exist ───────────────────────────────────────────
mkdirSync(join(root, 'public'), { recursive: true });

console.log('📐 Generating icons from fav.jpeg …\n');

// Sizes needed
const buf16  = await resize(16);
const buf32  = await resize(32);
const buf180 = await resize(180);
const buf192 = await resize(192);
const buf512 = await resize(512);

// ── Write files ────────────────────────────────────────────────────────────────
const writes = [
  { path: join(root, 'src/app/favicon.ico'),     data: encodeIco([{ buf: buf16, size: 16 }, { buf: buf32, size: 32 }]), label: 'favicon.ico (16×16 + 32×32 ICO)' },
  { path: join(root, 'src/app/icon.png'),         data: buf32,  label: 'icon.png (32×32)' },
  { path: join(root, 'src/app/apple-icon.png'),   data: buf180, label: 'apple-icon.png (180×180)' },
  { path: join(root, 'public/icon-192.png'),      data: buf192, label: 'public/icon-192.png (192×192)' },
  { path: join(root, 'public/icon-512.png'),      data: buf512, label: 'public/icon-512.png (512×512)' },
];

for (const { path, data, label } of writes) {
  writeFileSync(path, data);
  console.log(`  ✓  ${label}`);
}

console.log('\n✅  All icons generated successfully.');
