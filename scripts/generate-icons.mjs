#!/usr/bin/env node
// packages/theme/icon.svg から 2 サイト分の favicon / apple-touch-icon /
// maskable / OGP を生成する。生成物はコミットするので、CI では走らせない。
//
//   npm run icons
//
// rsvg-convert (brew install librsvg) が要る。マスターを直したらこれを流し、
// 出てきた public/ の画像も一緒にコミットすること。

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const master = join(root, 'packages/theme/icon.svg');

// theme.css のライト側トークン。背景を敷く用途（apple-touch / maskable）で使う。
// 透過のままだと iOS も Android も黒地に置いてしまう
const SURFACE = '#fafaee';

const SITES = ['apps/blog', 'apps/profile'];

// size: 出力ピクセル / scale: 100x100 の viewBox に対する縮尺 / bg: null なら透過
const TARGETS = [
  { file: 'favicon-16x16.png', size: 16, scale: 1, bg: null },
  { file: 'favicon-32x32.png', size: 32, scale: 1, bg: null },
  { file: 'apple-touch-icon.png', size: 180, scale: 0.78, bg: SURFACE },
  { file: 'icon-192.png', size: 192, scale: 0.82, bg: SURFACE },
  { file: 'icon-512.png', size: 512, scale: 0.82, bg: SURFACE },
  // maskable は中央 80% の円に全部収める必要がある。ヒラメは横長なので
  // 他より一段小さくしないと、円や雫に切られたとき尾と光線が欠ける
  { file: 'icon-maskable-512.png', size: 512, scale: 0.578, bg: SURFACE },
];

const ICO_SIZES = [16, 32, 48];

function requireRsvg() {
  try {
    execFileSync('rsvg-convert', ['--version'], { stdio: 'ignore' });
  } catch {
    console.error('rsvg-convert が見つからない。`brew install librsvg` を先に。');
    process.exit(1);
  }
}

// マスターの中身（<style> ごと）を取り出して、背景と縮尺だけ変えた SVG に包み直す
function wrap(inner, { scale, bg }) {
  const off = (100 - 100 * scale) / 2;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
    bg ? `<rect width="100" height="100" fill="${bg}"/>` : '',
    `<g transform="translate(${off} ${off}) scale(${scale})">`,
    inner,
    '</g></svg>',
  ].join('\n');
}

function render(svgPath, outPath, size) {
  execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size), svgPath, '-o', outPath]);
}

// PNG をそのまま格納する ICO。Vista 以降のブラウザはこれを読める
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

requireRsvg();

const source = readFileSync(master, 'utf8');
const inner = source.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];
const work = mkdtempSync(join(tmpdir(), 'icons-'));

try {
  for (const site of SITES) {
    const pub = join(root, site, 'public');

    // SVG favicon はマスターをそのまま置く（ダークのタブで色が反転する）
    copyFileSync(master, join(pub, 'icon.svg'));

    for (const t of TARGETS) {
      const tmp = join(work, `${t.file}.svg`);
      writeFileSync(tmp, wrap(inner, t));
      render(tmp, join(pub, t.file), t.size);
      console.log(`${site}/public/${t.file}`);
    }

    const icoSrc = join(work, 'ico.svg');
    writeFileSync(icoSrc, wrap(inner, { scale: 1, bg: null }));
    const pngs = ICO_SIZES.map((size) => {
      const out = join(work, `ico-${size}.png`);
      render(icoSrc, out, size);
      return { size, buf: readFileSync(out) };
    });
    const ico = join(root, site, 'src/app/favicon.ico');
    writeFileSync(ico, buildIco(pngs));
    console.log(`${site}/src/app/favicon.ico`);
  }

  // OGP はテキストを含むので、字形が環境のフォントに依存する。
  // 生成し直したら見た目を確認すること
  const og = join(root, 'apps/blog/assets/og-default.svg');
  const ogOut = join(root, 'apps/blog/public/og-default.png');
  execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', og, '-o', ogOut]);
  console.log('apps/blog/public/og-default.png');
} finally {
  rmSync(work, { recursive: true, force: true });
}
