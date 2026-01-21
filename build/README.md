# Íconos de la Aplicación

Coloca aquí los íconos de la aplicación:

- **icon.ico** - Ícono de Windows (256x256 px)
- **icon.png** - Ícono de Linux (512x512 px)
- **icon.icns** - Ícono de macOS (opcional)

## Generar íconos

Puedes usar herramientas online como:
- https://www.icoconverter.com/ (para .ico)
- https://cloudconvert.com/png-to-icns (para .icns)

O usar herramientas CLI:
```bash
# Con ImageMagick
convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico

# Con electron-icon-builder
npm install -g electron-icon-builder
electron-icon-builder --input=./icon.png --output=./build
```

## Dimensiones recomendadas

- PNG original: 1024x1024 px
- Windows ICO: 256x256 px (contiene múltiples tamaños)
- Linux PNG: 512x512 px
- macOS ICNS: múltiples tamaños (16, 32, 64, 128, 256, 512, 1024)
