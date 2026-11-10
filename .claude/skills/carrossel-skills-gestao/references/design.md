# Sistema de design — medidas do original

Todas as medidas em px num canvas **1080 × 1350 (4:5)**. Cores amostradas por pixel nos prints em `../referencia/`. Os valores já estão como tokens CSS em `../templates/carrossel.html`.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F8F3F0` | Fundo de todos os slides internos (creme rosado, quente) |
| `--ink` | `#17100D` | Títulos (quase preto, quente — nunca #000) |
| `--body` | `#615853` | Parágrafos (cinza-marrom) |
| `--muted` | `#8A807A` | Subtítulos de card ("Instruções") |
| `--line` | `#D4CDC7` | Divisória do rodapé, bordas de card |
| `--card` | `#F8F1EB` | Card neutro (um tom mais quente que o fundo) |
| `--card-white` | `#FEFDFB` | Card "certo"/destaque |
| `--tile` | `#EFE6DE` | Quadradinho do ícone no header do card |
| `--accent` | `#DE9D68` | **Única cor de destaque**: box da capa, palavra do CTA |
| `--accent-ink` | `#BA7532` | Bullets laranja |
| `--cream-box` | `#F6F0EA` | Boxes claros da capa |
| `--pink` | `#F4DBD7` | Balão de resposta genérica/ruim |
| `--red` / `--green` | `#D9342B` / `#2E9E4A` | ✕ e ✓ (com fundos claros `#FBE4E1` / `#E6F4E4`) |
| `--verified` | `#4BA3F0` | Selo de verificado |
| `--logo` | `#D9D3CE` | Logo no rodapé (bem apagado) |

Princípio: paleta **quase monocromática quente** + **uma** cor de acento (terracota, conversa com a marca Claude). Vermelho/verde só como sinal semântico dentro das mini-UIs.

## Tipografia

| Papel | Fonte (substituta fiel) | Peso | Tamanho / entrelinha | Tracking | Cor |
|---|---|---|---|---|---|
| Título dos slides | **Instrument Sans** | 500 | 51 / 1.15 | -0.012em | `--ink` |
| Corpo | **Inter** | 400 | 32 / 1.25 (fechamento 31 / 1.38) | 0 | `--body` |
| Destaque no corpo | Inter | 700 | idem | — | `#5A4E48` |
| Linhas da capa | **Plus Jakarta Sans** | 800 | 66 / 1 | -0.015em | `#111` |
| Selo da capa | Inter | 700 (nome) + 400 (posicionamento) | 20 | — | branco |
| Rodapé — nome | Inter | 500 | 30 | -0.01em | `#544F4C` |
| Rodapé — posicionamento | Inter | 400 | 20 | — | `#6B625E` |
| Mini-UI: título do card | Inter | 700 | 17–22 | — | `#1D1714` |
| Mini-UI: texto | Inter | 400 | 13–19 | — | `#2A2421` |
| Nome de arquivo | JetBrains Mono (ou Inter 600 no pill "sans") | 400–500 | 11–15 | — | `#2A2421` |

Hierarquia: **título (51, preto) → corpo (32, cinza) → mini-UI (15–19, preto)**. O corpo é grande (32px) para ler no celular; o contraste título/corpo vem de **cor e fonte**, não só de tamanho.

## Grid e espaçamento — slides internos

```
y=0 ┌───────────────────────────────────────┐
    │   (área de conteúdo, centralizada     │
    │    verticalmente entre 0 e 1187)      │
    │                                       │
    │        TÍTULO  (máx ~700 px larg.)    │
    │            ↕ 44 px                    │
    │        CORPO   (máx ~700 px larg.)    │
    │        parágrafos separados por 1     │
    │        linha em branco (40 px)        │
    │            ↕ 60–90 px                 │
    │   ┌── PROVA VISUAL (≈870 px larg.) ─┐ │
    │   └─────────────────────────────────┘ │
y=1187 ├─────── divisória 1.5px #D4CDC7 ─────┤  margens laterais 56 px
    │ (●) Nome ✓                      [logo]│  avatar Ø92 em x≈54, y≈1215
    │     Posicionamento                    │
y=1350 └───────────────────────────────────────┘
```

- Tudo **centralizado** horizontalmente; texto `text-align:center`.
- O bloco título+corpo+visual é **centralizado no espaço acima do rodapé** — por isso o topo do título varia de slide pra slide (130–210 px) conforme o volume. Slides sem visual (7, 8) ficam visivelmente no meio.
- Rodapé **idêntico em todos os slides internos** (assinatura de marca), inclusive no CTA.

## Capa

- Foto **full-bleed** do autor (selfie, olhar na câmera), fundo escuro com contexto (estante, laptop com a ferramenta).
- **Selo** no topo-esquerda: pílula `rgba(40,24,18,.82)`, altura 45, raio total, em x=76 / y=86. "**Nome** | Posicionamento ✓".
- **Logo** topo-direita, branco ~55% opacidade, ~52 px.
- **Headline em boxes empilhados**, centralizados, cada linha num box próprio que "abraça" o texto:
  - altura ≈ 95 px, padding ≈ 13/32 px, raio 7 px, gap 11 px;
  - linhas 1–2: box creme `#F6F0EA`; **última linha: box laranja `#DE9D68`** (o payoff);
  - base do último box ≈ 245 px acima do fim do slide (≈ y 1105) — fica no terço inferior, sobre o corpo/peito, sem cobrir o rosto.
- **Sticker** (pasta 3D com papel escrito o tema) girado ≈ -14°, com sombra, sobrepondo o canto superior-esquerdo do 1º box.

## Componentes da prova visual

- **Card**: fundo `--card`, borda 1.5 px `--line`, raio 12, sombra mínima `0 2 6 rgba(80,50,30,.06)`.
  - `.branco` = certo/destaque; `.ruim` = borda **tracejada**.
- **Header do card**: quadrado de ícone 40×40 raio 9 em `--tile` · (separador vertical opcional) · título bold + subtítulo cinza · badge ✕/✓ à direita (34×34, fundo claro vermelho/verde). Linha divisória embaixo, recuada 6 px das bordas.
- **Balão de chat**: avatar 28×28 + balão raio 8. Resposta ruim = `--pink` com trecho **sublinhado em vermelho**.
- **Pílula de arquivo**: fundo `#FFFDF9`, borda `#E6DED7`, raio 8, ícone de documento + nome `.md`.
- **Bullets** laranja (`--accent-ink`) Ø7 px; lista "neutra" usa bullets pretos Ø5.
- **Fluxograma**: grid 3 colunas com setas finas (→ ← ↓) entre caixas 01–06; caixa final com **borda preta 2 px**.
- **Setas** entre cards: caractere "→" fino, cinza-escuro, centralizado verticalmente.

## O que chama atenção (e por quê)

1. **Capa ≠ resto**: capa escura com foto vs. slides internos claros e limpos — o contraste "puxa" o swipe.
2. **Um único acento laranja** — usado só onde importa (payoff da capa e palavra do CTA). O olho é treinado a procurar laranja.
3. **Boxes por linha na capa** — estética de legenda de Reels/TikTok; leitura linha a linha, cada box é uma "batida".
4. **Mini-interfaces** em vez de ícones genéricos — parecem prints reais, dão prova e credibilidade técnica.
5. **Errado × Certo** com ✕/✓ — comparação instantânea, entendida sem ler.
6. **Muito respiro** — margens enormes, texto curto; nada compete com o título.
7. **Rodapé fixo com rosto** — cada slide compartilhado isoladamente ainda carrega a autoria.
