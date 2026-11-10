---
name: carrossel-skills-gestao
description: Cria carrosséis de Instagram (1080x1350, 4:5) no estilo "capa com foto + boxes empilhados, slides internos creme com título, corpo curto e mini-interface de prova, fechamento de visão e CTA de comentário" — réplica do formato do post de referência sobre Skills. Use quando o usuário pedir um carrossel nesse estilo, "réplica daquele carrossel", "carrossel tipo lista numerada com prova visual", ou quiser transformar um tema em post de Instagram educativo para gestores/profissionais. Gera a copy (slides + legenda) e renderiza os PNGs.
---

# Carrossel "Lista com prova visual" (réplica)

Formato decodificado de um carrossel real (8 slides). Prints originais em `referencia/slide01.jpg … slide08.jpg` — **olhe-os antes de começar** se precisar de referência visual.

Leia conforme a necessidade:
- `references/copy.md` — fórmulas de cada slide, padrões de título/corpo, legenda, voz e tom.
- `references/design.md` — paleta, tipografia, grid, medidas da capa e dos componentes.
- `templates/carrossel.html` — template renderizável (tokens + componentes).
- `exemplo/conteudo.json` — gabarito completo (a réplica 1:1 da estrutura original). **Copie-o como ponto de partida.**

## Estrutura obrigatória

1. **Capa** — foto do autor (full-bleed) + selo "Nome | Posicionamento ✓" + 3 linhas em boxes; a última linha (o payoff) em box laranja; sticker do tema.
   Fórmula: `Eu quero te mostrar / um jeito bem mais [adj.] / de [fazer X]`.
2. **Slides 2…N-2 — itens numerados (padrão: 5)** — título `N. [Verbo imperativo] + objeto + contraste/ordem`, corpo em 3 blocos curtos (cenário → exemplo concreto → "Assim, …"), e uma **prova visual** (mini-UI: errado×certo, fluxo em etapas, fluxograma numerado, print real ou antes×depois).
3. **Ampliação** — `Agora imagine isso na [escala maior].` + 2 parágrafos; sem visual.
4. **CTA** — `Comenta "[palavra]" que te envio [isca] para [público]`; palavra em laranja.

Rodapé fixo (divisória + avatar + nome ✓ + posicionamento + logo) em todos os slides menos a capa.

## Fluxo de trabalho

1. **Briefing** (pergunte só o que faltar): tema, público, quantos itens (padrão 5), palavra do CTA e isca, nome/posicionamento do autor, foto de capa, avatar e logo. Se não houver foto, use o placeholder e avise.
2. **Escreva a copy primeiro** seguindo `references/copy.md`:
   - títulos com 8–10 palavras, verbo imperativo concreto, palavra-tema repetida em todos;
   - corpo 35–60 palavras por slide, linguagem falada ("pra", "você"), **um único negrito no carrossel inteiro**;
   - para cada item, decida a prova visual (tabela em `copy.md`) e os nomes de arquivo/exemplos concretos;
   - escreva a legenda na estrutura de 11 passos.
   Mostre a copy ao usuário em texto antes de renderizar se ele quiser revisar.
3. **Monte o JSON**: copie `exemplo/conteudo.json` para uma pasta de trabalho, troque `autor`, `slides` e assets. Strings aceitam HTML (`<b>`, `<em>`, `<br>`). A prova visual vai em `visual_html` (use as classes de componente do template — veja os exemplos no gabarito) ou `visual_img` (print real).
   Ajustes finos por slide: `tw` (largura máx. do título), `bw` (largura máx. do corpo); na capa `destaque` (índices das linhas laranja), `base` (distância do último box à borda inferior), `foco` (object-position da foto), `sticker` (`img` ou `emoji`, `x`, `y`, `w`).
   Para um sticker com outro texto: `sed 's/{{TEXTO}}/SEU-TEXTO/' templates/assets/sticker-pasta.svg > sticker.svg`.
4. **Renderize**:
   ```bash
   node <skill>/scripts/render.js caminho/conteudo.json caminho/saida
   ```
   Gera `slide-01.png …` em 1080×1350. Precisa de Playwright/Chromium e acesso ao Google Fonts (Instrument Sans, Inter, Plus Jakarta Sans, JetBrains Mono).
5. **Confira cada PNG** (abra as imagens) contra este checklist e corrija:
   - [ ] Título em no máx. 2–3 linhas, sem viúva de uma palavra (ajuste `tw`).
   - [ ] Corpo não encosta na prova visual; nada passa da divisória do rodapé (y=1187). Se passar, corte texto antes de diminuir fonte.
   - [ ] Capa: boxes não cobrem o rosto; última linha laranja; sticker sobrepondo o canto do 1º box.
   - [ ] Laranja aparece só no payoff da capa, nos bullets e na palavra do CTA.
   - [ ] Mini-UI legível no celular (texto ≥ 13 px no canvas).
6. **Entregue** os PNGs + a legenda pronta para colar.

## Temas visuais

- **`carrossel` (padrão)** — réplica fiel da referência: público de tecnologia/IA, mini-interfaces (chat, arquivos `.md`, cards ✕/✓), acento laranja.
- **`editorial`** — mesma estrutura (capa com foto → slides título/texto/visual → rodapé), linguagem de revista de negócios para **líderes, diretores, mentoria e coaching**. Ative com `"template": "editorial"` no JSON. Gabarito: `exemplo/conteudo-editorial.json`.
  - Fraunces (serifa, palavras-chave em *itálico verde-petróleo*) + Inter; papel `#F3EEE6`, tinta `#1D1A17`, acento `#2E5E5B`, terracota `#B5523B` só para o "errado".
  - Texto alinhado à esquerda; faixa superior com rótulo (`kicker`) e contador `02 / 08`; números grandes (`numero`) nas técnicas.
  - Componentes: `.caderno` + `.check` + `.desfecho` (página de caderno), `.riscado` + `.citacao` (frase errada riscada → frase certa), `.perguntas` (lista 01–04 em 2 colunas), `.tri` (framework de 3 colunas com letras grandes), `.duo` (comparação "Fala com você / Fala de você"), `.venn` (SVG de círculos; dê halo `stroke` + `paint-order` aos rótulos), `mark` (marca-texto).
  - Capa: foto escura, título serifado grande à esquerda com trecho em itálico sublinhado, nome/posicionamento em caixa alta no topo, "Deslize →".
  - Evite o clichê preto + dourado; a marca do autor entra pelo logo e pela foto.
- Qualquer tema aceita `"cores": {"accent": "#..."}` para trocar o acento.

## Regras de fidelidade

- Não troque a paleta, as fontes ou o grid sem o usuário pedir — a força do formato é a consistência.
- Fundo creme `#F8F3F0`, título `#17100D`, corpo `#615853`, acento único `#DE9D68`.
- Sem emojis, hashtags ou exclamações nos slides.
- Use sempre o nome, foto e logo **do usuário** — o formato é replicável, a identidade do autor original (nome, rosto, logo) não.
