# ⚡ QUICK START - Horario 3D

## 🎯 Quiero construir el ejecutable portable AHORA

### Windows (3 comandos):
```powershell
npm install
.\build.ps1 windows
# Espera 5-10 minutos ☕
```

**Resultado:** `release/Horario 3D-1.0.0-Windows-Portable.exe`

---

### Linux/Arch (3 comandos):
```bash
npm install
./build.sh linux
# Espera 5-10 minutos ☕
```

**Resultado:** `release/Horario 3D-1.0.0-Linux-Portable.AppImage`

Para usar:
```bash
chmod +x "Horario 3D-1.0.0-Linux-Portable.AppImage"
./"Horario 3D-1.0.0-Linux-Portable.AppImage"
```

---

## 🤖 Quiero conectar con mi API de IA

### 1. Abre la app

### 2. Presiona F12 (DevTools)

### 3. En la consola, escribe:
```javascript
localStorage.setItem('ai_api_url', 'http://localhost:3000/api/ai/insight');
```
(Cambia la URL por la de tu servidor)

### 4. Recarga la página (F5)

### 5. ¡Listo! Ahora el botón "Consultar IA" usa tu API

---

## 📝 Formato que debe devolver tu API:

```javascript
// POST http://tu-servidor:3000/api/ai/insight
// Body:
{
  "subject": "Nombre materia",
  "professor": "Nombre profesor",
  "prompt": "Consulta del usuario"
}

// Tu API debe responder:
{
  "insight": "Aquí va el texto de respuesta de tu IA..."
}
```

---

## 🎨 Ejemplo super simple de API (Node.js):

Crea un archivo `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/ai/insight', (req, res) => {
  const { subject, professor, prompt } = req.body;
  
  // Aquí conectas con tu IA real
  const respuesta = `📚 ${subject}
  
  Conceptos clave y recomendación para esta materia...
  (Aquí pondría la respuesta de tu IA)`;
  
  res.json({ insight: respuesta });
});

app.listen(3000, () => {
  console.log('🤖 API corriendo en http://localhost:3000');
});
```

Instala y corre:
```bash
npm install express cors
node server.js
```

---

## 🔥 Atajos útiles

### Ver en modo desarrollo:
```bash
npm run dev
# Abre http://localhost:5173
```

### Modo Electron desarrollo:
```bash
npm run electron:dev
```

### Build para TODO (Windows + Linux):
```powershell
# Windows
.\build.ps1 all

# Linux
./build.sh all
```

---

## ❓ Troubleshooting rápido

### "No se encuentra npm"
```bash
# Instala Node.js desde https://nodejs.org
```

### "Permission denied" en Linux
```bash
chmod +x build.sh
./build.sh linux
```

### "Icon not found"
```bash
# Coloca un PNG en build/icon.png (512x512)
# Opcional: icon.ico para Windows
```

### La API de IA no responde
1. Verifica que tu servidor esté corriendo
2. Chequea la URL en localStorage
3. Abre F12 > Network para ver el error

---

## 🎉 ¡Eso es todo!

Con estos comandos tienes:
✅ Ejecutable portable para Windows  
✅ Ejecutable portable para Linux (incluye Arch)  
✅ Conexión flexible a tu API de IA  
✅ Sin instalación necesaria  
✅ Listo para distribuir
