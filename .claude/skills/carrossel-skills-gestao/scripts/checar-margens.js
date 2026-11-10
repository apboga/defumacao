#!/usr/bin/env node
/*
  Verificação automática da zona segura do Instagram (post 4:5, 1080x1350).
  Mede a caixa de cada elemento visível com conteúdo (texto, logo, avatar,
  ícones, cards) e reprova o que invadir:
    - contador "1/8"      x 900-1080, y 0-120
    - ícone de marcação   x 0-120,    y 1230-1350
    - ícone de som        x 960-1080, y 1230-1350
    - margem geral: conteúdo deve ficar entre y 130 e 1250 e a >= 60px das laterais
  Fotos de fundo (.foto, .moldura>img de fundo) e a grade decorativa são ignoradas.
  Uso: node scripts/checar-margens.js conteudo.json [outro.json ...]
*/
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ZONAS = [[900, 0, 1080, 120, 'contador 1/8'], [0, 1230, 120, 1350, 'ícone marcação'], [960, 1230, 1080, 1350, 'ícone som']];
const SEG = { x0: 60, y0: 130, x1: 1020, y1: 1250 };
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

(async () => {
  const b = await chromium.launch();
  let falhas = 0;
  for (const arq of process.argv.slice(2)) {
    const jp = path.resolve(arq), base = path.dirname(jp);
    const c = JSON.parse(fs.readFileSync(jp, 'utf8'));
    const asset = p => (!p || /^(https?:|data:)/.test(p)) ? p : (fs.existsSync(path.resolve(base, p)) ? `data:${MIME[path.extname(p).toLowerCase()]};base64,${fs.readFileSync(path.resolve(base, p)).toString('base64')}` : '');
    ['avatar', 'logo', 'logo_claro'].forEach(k => c.autor[k] = asset(c.autor[k]));
    c.slides.forEach(s => { if (s.foto) s.foto = asset(s.foto); if (s.visual_img) s.visual_img = asset(s.visual_img); });
    const tpl = path.resolve(__dirname, '../templates/' + (c.template || 'carrossel') + '.html');
    const p = await b.newPage({ viewport: { width: 1180, height: 1400 } });
    await p.addInitScript(x => { window.CONTEUDO = x; }, c);
    await p.goto('file://' + tpl, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const res = await p.evaluate(({ ZONAS, SEG }) => {
      const out = [];
      document.querySelectorAll('section.slide').forEach((sl, i) => {
        const R = sl.getBoundingClientRect();
        sl.querySelectorAll('*').forEach(el => {
          if (el.matches('.foto, .shade, .moldura, .moldura .foto, script, style')) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
          const temTexto = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
          const ehMidia = el.tagName === 'IMG' || el.tagName === 'svg';
          const ehBarra = el.matches('.prog i');
          if (!temTexto && !ehMidia && !ehBarra) return;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          const x0 = r.left - R.left, y0 = r.top - R.top, x1 = x0 + r.width, y1 = y0 + r.height;
          const nome = (el.className && el.className.baseVal === undefined ? el.className : el.tagName) || el.tagName;
          const txt = (el.textContent || el.getAttribute('alt') || '').trim().slice(0, 40);
          for (const [a, b2, c2, d, z] of ZONAS) if (x0 < c2 && x1 > a && y0 < d && y1 > b2) out.push({ slide: i + 1, motivo: 'invade ' + z, el: nome, txt, box: [x0, y0, x1, y1].map(Math.round) });
          if (x0 < SEG.x0 - 0.5 || y0 < SEG.y0 - 0.5 || x1 > SEG.x1 + 0.5 || y1 > SEG.y1 + 0.5) out.push({ slide: i + 1, motivo: 'fora da margem segura', el: nome, txt, box: [x0, y0, x1, y1].map(Math.round) });
        });
      });
      return out;
    }, { ZONAS, SEG });
    const n = await p.$$eval('section.slide', s => s.length);
    // remove duplicatas do mesmo elemento/motivo
    const vistos = new Set(), uniq = res.filter(r => { const k = r.slide + r.motivo + r.box; if (vistos.has(k)) return false; vistos.add(k); return true; });
    console.log(`\n${path.basename(path.dirname(jp))}/${path.basename(jp)} — ${n} slides: ${uniq.length ? '✗ ' + uniq.length + ' problema(s)' : '✓ tudo dentro da zona segura'}`);
    uniq.forEach(r => console.log(`  slide ${r.slide}: ${r.motivo} — ${r.el} "${r.txt}" ${JSON.stringify(r.box)}`));
    falhas += uniq.length;
    await p.close();
  }
  await b.close();
  process.exit(falhas ? 1 : 0);
})();
