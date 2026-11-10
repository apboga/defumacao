#!/usr/bin/env python3
"""
Sobrepõe as zonas que o Instagram cobre num post 4:5 (1080x1350) e gera
uma folha de conferência.

Uso: python3 -I safezone.py pasta/out  [saida.jpg]

Zonas (em px do canvas 1080x1350; app iOS/Android, feed e carrossel):
  - Contador "1/8" do carrossel: canto superior direito  -> x 900-1080, y 0-120
  - Ícone de pessoas marcadas: canto inferior esquerdo   -> x 0-120,   y 1230-1350
  - Ícone de som (se houver música/vídeo): inferior dir. -> x 960-1080, y 1230-1350
  - Grade do perfil (capa recortada em 3:4)              -> 34 px de cada lateral
Regra da skill: nada importante acima de y=130, abaixo de y=1250
nem a menos de 60 px das laterais.
"""
import sys, glob, os
from PIL import Image, ImageDraw

ZONAS = [
    ((900, 0, 1080, 120), "contador 1/8"),
    ((0, 1230, 120, 1350), "marcação"),
    ((960, 1230, 1080, 1350), "som"),
]
SEGURO = (60, 130, 1020, 1250)

def marcar(img, capa=False):
    im = img.convert("RGBA"); ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    for box, _ in ZONAS:
        d.rectangle(box, fill=(255, 0, 60, 90), outline=(255, 0, 60, 255), width=3)
    d.rectangle(SEGURO, outline=(0, 200, 120, 255), width=3)
    if capa:
        d.rectangle((0, 0, 34, 1350), fill=(255, 160, 0, 90)); d.rectangle((1046, 0, 1080, 1350), fill=(255, 160, 0, 90))
    return Image.alpha_composite(im, ov).convert("RGB")

pasta = sys.argv[1]
saida = sys.argv[2] if len(sys.argv) > 2 else os.path.join(pasta, "safezone.jpg")
fs = sorted(glob.glob(os.path.join(pasta, "slide-*.png")))
W, H, g = 540, 675, 10
cols = 4; rows = (len(fs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W + (cols + 1) * g, rows * H + (rows + 1) * g), "#222")
for i, f in enumerate(fs):
    t = marcar(Image.open(f), capa=(i == 0)).resize((W, H))
    sheet.paste(t, (g + (i % cols) * (W + g), g + (i // cols) * (H + g)))
sheet.save(saida, quality=85); print(saida)
