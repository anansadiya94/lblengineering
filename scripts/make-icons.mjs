// Generates the favicons and the social-sharing image in public/ from the logo.
// Run again after changing the logo:  node scripts/make-icons.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const LOGO = 'content/images/brand/logo.jpg';
const OUT = 'public';
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// The teal "X" mark on the left of the logo (pixel box in the 450×210 original).
const mark = () => sharp(LOGO).extract({ left: 14, top: 4, width: 112, height: 130 });

async function icon(size, file, padding = 0.08) {
  const inner = Math.round(size * (1 - padding * 2));
  const buf = await mark().resize(inner, inner, { fit: 'contain', background: WHITE }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: buf, gravity: 'center' }])
    .png()
    .toFile(`${OUT}/${file}`);
}

await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');
await icon(180, 'apple-touch-icon.png', 0.12);

// favicon.ico: a single 32×32 PNG wrapped in an ICO container.
const inner32 = await mark().resize(30, 30, { fit: 'contain', background: WHITE }).toBuffer();
const png32 = await sharp({ create: { width: 32, height: 32, channels: 4, background: WHITE } })
  .composite([{ input: inner32, gravity: 'center' }])
  .png()
  .toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14); // data size
header.writeUInt32LE(22, 18); // data offset
await writeFile(`${OUT}/favicon.ico`, Buffer.concat([header, png32]));

// Social sharing image, 1200×630: the logo on white above a teal band.
const logo = await sharp(LOGO).resize({ width: 720 }).toBuffer();
const band = await sharp({ create: { width: 1200, height: 36, channels: 3, background: '#55b1be' } }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
  .composite([
    { input: logo, top: 147, left: 240 },
    { input: band, top: 594, left: 0 },
  ])
  .jpeg({ quality: 88 })
  .toFile(`${OUT}/og-image.jpg`);

console.log('Icons and og-image.jpg written to public/');
