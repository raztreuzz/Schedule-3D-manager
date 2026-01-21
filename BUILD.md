# 🚀 Guía de Build - Horario 3D Portable

## 📦 Builds Portables Disponibles

### Windows Portable
```bash
npm run electron:build:win
```
Genera: `release/Horario 3D-1.0.0-Windows-Portable.exe`
- **No requiere instalación**
- Ejecutable único portable
- Compatible con Windows 10/11 x64

### Linux AppImage (Portable)
```bash
npm run electron:build:linux
```
Genera: `release/Horario 3D-1.0.0-Linux-Portable.AppImage`
- **No requiere instalación**
- Compatible con cualquier distribución Linux x64
- Incluye todas las dependencias

### Arch Linux (Pacman)
```bash
npm run electron:build:arch
```
Genera:
- `release/Horario 3D-1.0.0-Linux-x64.pacman` (paquete pacman)
- `release/Horario 3D-1.0.0-Linux-x64.tar.gz` (archivo comprimido)

Instalar en Arch:
```bash
sudo pacman -U "Horario 3D-1.0.0-Linux-x64.pacman"
```

### Build para todas las plataformas
```bash
npm run electron:build:all
```

## 🔧 Requisitos previos

### Para compilar:
```bash
npm install
```

### Estructura de archivos necesaria:
```
sisix-3d/
├── build/
│   ├── icon.ico       # Ícono Windows (256x256)
│   ├── icon.png       # Ícono Linux (512x512)
│   └── icon.icns      # Ícono macOS (opcional)
└── LICENSE            # Archivo de licencia
```

## 🤖 Configuración de IA Externa

La aplicación está configurada para consumir una API de IA externa en lugar de usar Gemini directamente.

### Configurar URL de la API:

**Opción 1: LocalStorage (en la app)**
```javascript
localStorage.setItem('ai_api_url', 'http://tu-servidor:3000/api/ai/insight');
```

**Opción 2: Variables de entorno**
Edita `src/App.jsx` y cambia la línea:
```javascript
const AI_API_URL = 'http://tu-servidor:3000/api/ai/insight';
```

### Formato esperado de la API:

**Request:**
```json
POST /api/ai/insight
Content-Type: application/json

{
  "subject": "Nombre de la materia",
  "professor": "Nombre del profesor",
  "prompt": "Consulta específica"
}
```

**Response:**
```json
{
  "insight": "Respuesta de la IA en texto...",
  // o alternativamente:
  "response": "...",
  // o:
  "data": {
    "text": "..."
  }
}
```

## 📝 Desarrollo

```bash
# Modo desarrollo web
npm run dev

# Modo desarrollo Electron
npm run electron:dev
```

## 🎯 Tips para distribución portable

### Windows:
- El `.exe` portable guarda su configuración en `%APPDATA%\sisix-3d`
- Puede ejecutarse desde USB sin instalación
- No requiere permisos de administrador

### Linux AppImage:
```bash
chmod +x "Horario 3D-1.0.0-Linux-Portable.AppImage"
./Horario\ 3D-1.0.0-Linux-Portable.AppImage
```

### Arch Linux:
El paquete `.pacman` se integra con el sistema de paquetes de Arch y puede desinstalarse con:
```bash
sudo pacman -R sisix-3d
```

## 🔍 Troubleshooting

### Error: "Icon not found"
Asegúrate de tener los íconos en la carpeta `build/`

### Error en build de Linux en Windows:
Necesitas WSL2 o una VM Linux para compilar paquetes Linux desde Windows.

### La API de IA no responde:
1. Verifica que tu servidor de IA esté corriendo
2. Revisa la URL configurada en localStorage
3. Chequea la consola del navegador (F12) para ver errores de red

## 📊 Tamaños aproximados

- **Windows Portable**: ~150-200 MB
- **Linux AppImage**: ~180-220 MB  
- **Arch pacman**: ~80-100 MB (comprimido)

## 🌟 Características portables

✅ No requiere instalación  
✅ Datos guardados localmente (localStorage)  
✅ Configuración persistente  
✅ Compatible con USB/external drives  
✅ Sin dependencias externas  
✅ Listo para usar
