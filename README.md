# Horario 3D - Sistema de Gestión de Horarios y Tareas

Sistema interactivo de visualización 3D para gestión de horarios académicos con sistema completo de tareas, recordatorios y proyectos.

## 🚀 Características

- 📅 Visualización 3D de horarios semanales interactivos
- 🎯 Sistema de Tareas orbitales (órbitan alrededor de las clases)
- 📝 Sistema de Recordatorios (TODO LIST - cubos conectados)
- 🚀 Sistema de Proyectos con fases y sub-tareas
- 🎨 Animaciones 3D diferenciadas por tipo
- 🔗 Vinculación con asignaturas
- 📊 Dashboard individual por asignatura con métricas
- 💾 Persistencia local (localStorage)
- 🤖 Integración con API de IA personalizable
- 🎮 Interacción 3D completa con OrbitControls
- ✨ Efectos visuales: partículas, cristalería, luces dinámicas

## 📦 Instalación Rápida

```bash
npm install
npm run dev
```

## 🔨 Builds Portables

### Scripts Disponibles

**Windows Portable:**
```bash
npm run electron:build:win
# o
.\build.ps1 windows
```

**Linux AppImage (Universal):**
```bash
npm run electron:build:linux
# o
./build.sh linux
```

**Arch Linux (Pacman):**
```bash
npm run electron:build:arch
# o
./build.sh arch
```

**Todas las plataformas:**
```bash
npm run electron:build:all
# o
.\build.ps1 all
# o
./build.sh all
```

### Outputs Generados

- **Windows:** `Horario 3D-1.0.0-Windows-Portable.exe` (~150-200 MB)
- **Linux:** `Horario 3D-1.0.0-Linux-Portable.AppImage` (~180-220 MB)
- **Arch:** `Horario 3D-1.0.0-Linux-x64.pacman` (~80-100 MB)
- **Linux:** `Horario 3D-1.0.0-Linux.AppImage`, `.deb` y `.rpm`


## 📱 Uso

### Navegación
1. Selecciona un día o activa "VER TODO" para la semana completa
2. Click en un cubo para ver detalles de la clase
3. Arrastra para rotar la cámara, scroll para zoom

### Tipos de Items

#### 🎯 Tareas (Orbitales)
- Orbitan alrededor del cubo de la clase
- Formas según prioridad:
  - 🔴 Alta = Diamante rojo
  - 🟡 Media = Cubo naranja
  - 🔵 Baja = Pirámide azul
- Al completar: se alejan y desvanecen

#### 📝 Recordatorios (TODO LIST)
- Cubos blancos pequeños conectados con líneas
- Posicionados fuera del círculo orbital
- Ideal para recordatorios simples

#### 🚀 Proyectos
- Cubos magenta con sub-cubos (fases)
- Cada fase orbita alrededor del proyecto
- Permite gestionar tareas por fase
- Crea un circuito interconectado

## 🤖 Configuración de IA Externa

La app consume una API de IA externa (no incluye API key de Gemini).

### Configurar URL de tu API:

**En la consola del navegador (F12):**
```javascript
localStorage.setItem('ai_api_url', 'http://localhost:3000/api/ai/insight');
```

### Ejemplo de implementación:
Ver archivo `AI_API_EXAMPLE.js` para ejemplos en:
- Node.js + Express
- Python + FastAPI
- LM Studio (local)

### Formato de Request/Response:
```javascript
// POST /api/ai/insight
{
  "subject": "Materia",
  "professor": "Profesor",
  "prompt": "Consulta"
}

// Response
{
  "insight": "Respuesta de la IA...",
  "status": "success"
}
```

## 📚 Documentación Adicional

- **BUILD.md** - Guía completa de compilación y distribución
- **AI_API_EXAMPLE.js** - Ejemplos de implementación de API de IA
- **build/** - Directorio para íconos de la aplicación

## 🛠️ Tecnologías

- **Frontend:** React + Vite + TailwindCSS
- **3D Engine:** Three.js + OrbitControls
- **Desktop:** Electron
- **Storage:** LocalStorage (navegador)
   - ✅ Completada = Esfera verde

## 🛠️ Tecnologías

- React + Vite
- Three.js
- TailwindCSS
- Electron
- Electron Builder

## 📄 Licencia

MIT License - Ver archivo LICENSE
