const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + path.join(dir, 'roteiro.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.pdf({ path: path.join(dir, 'Roteiro-Conversa-de-Carreira-Alexandre-Bogaciovas.pdf'), width: '1080px', height: '1350px', printBackground: true });
  const ss = await p.$$('section.p');
  for (let i = 0; i < ss.length; i++) await ss[i].screenshot({ path: path.join(dir, `pg-${String(i + 1).padStart(2, '0')}.png`) });
  console.log(ss.length);
  await b.close();
})();
