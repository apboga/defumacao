#!/usr/bin/env node
/*
  Renderiza um carrossel 1080x1350 a partir de um conteudo.json.

  Uso:
    node scripts/render.js caminho/conteudo.json [pasta-de-saida]

  - Caminhos de imagem relativos no JSON (foto, avatar, logo, visual_img,
    sticker.img) são resolvidos a partir da pasta do JSON.
  - Gera slide-01.png, slide-02.png ... na pasta de saída
    (padrão: <pasta do json>/out).
  - Requer Playwright + Chromium (require('playwright')).
*/
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const [, , jsonArg, outArg] = process.argv;
if (!jsonArg) { console.error('uso: node render.js conteudo.json [saida]'); process.exit(1); }

const jsonPath = path.resolve(jsonArg);
const baseDir = path.dirname(jsonPath);
const outDir = path.resolve(outArg || path.join(baseDir, 'out'));
const conteudo = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
// "template": "editorial" no JSON usa templates/editorial.html (padrão: carrossel.html)
const template = path.resolve(__dirname, '../templates/' + (conteudo.template || 'carrossel') + '.html');

// Converte caminhos locais em data URIs para não depender de file:// cross-origin
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
function asset(p) {
  if (!p || /^(https?:|data:)/.test(p)) return p;
  const abs = path.resolve(baseDir, p);
  if (!fs.existsSync(abs)) { console.warn('⚠ imagem não encontrada:', abs); return ''; }
  return `data:${MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream'};base64,${fs.readFileSync(abs).toString('base64')}`;
}
const a = conteudo.autor || {};
['avatar', 'logo', 'logo_claro'].forEach(k => a[k] = asset(a[k]));
for (const s of conteudo.slides) {
  if (s.foto) s.foto = asset(s.foto);
  if (s.visual_img) s.visual_img = asset(s.visual_img);
  if (s.sticker?.img) s.sticker.img = asset(s.sticker.img);
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1180, height: 1400 }, deviceScaleFactor: 1 });
  await page.addInitScript(c => { window.CONTEUDO = c; }, conteudo);
  await page.goto('file://' + template, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const slides = await page.$$('section.slide');
  for (let i = 0; i < slides.length; i++) {
    const f = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await slides[i].screenshot({ path: f });
    console.log('✔', f);
  }
  await browser.close();
})();
