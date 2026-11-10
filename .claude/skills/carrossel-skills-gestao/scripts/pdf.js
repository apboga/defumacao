#!/usr/bin/env node
/*
  Gera o PDF do material rico (1080x1350 por página) + um PNG por página.
  Uso:
    node scripts/pdf.js caminho/arquivo.html [pasta-de-saida] [nome.pdf]
    node scripts/pdf.js pasta/            (usa pasta/roteiro.html)
  As imagens do HTML são resolvidas a partir da pasta do próprio HTML
  (o modelo templates/material-pdf.html usa ../marca/...).
*/
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  let src = path.resolve(process.argv[2] || '.');
  if (fs.statSync(src).isDirectory()) src = path.join(src, 'roteiro.html');
  const out = path.resolve(process.argv[3] || path.dirname(src));
  const nome = process.argv[4] || 'Roteiro-Conversa-de-Carreira-Alexandre-Bogaciovas.pdf';
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + src, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.pdf({ path: path.join(out, nome), width: '1080px', height: '1350px', printBackground: true });
  const ss = await p.$$('section.p');
  for (let i = 0; i < ss.length; i++) await ss[i].screenshot({ path: path.join(out, `pg-${String(i + 1).padStart(2, '0')}.png`) });
  console.log(`✔ ${path.join(out, nome)} (${ss.length} páginas)`);
  await b.close();
})();
