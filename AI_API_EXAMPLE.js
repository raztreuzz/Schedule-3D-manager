/**
 * Ejemplo de endpoint de API de IA para Horario 3D
 * 
 * Este es un ejemplo de cómo implementar el endpoint que consumirá
 * la aplicación Horario 3D para obtener insights de IA.
 * 
 * Puedes implementar esto en Node.js, Python Flask/FastAPI, etc.
 */

// ============================================
// EJEMPLO 1: Node.js + Express
// ============================================

/*
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/ai/insight', async (req, res) => {
  try {
    const { subject, professor, prompt } = req.body;
    
    // Aquí conectas con tu servicio de IA (OpenAI, Claude, Gemini, etc.)
    // Ejemplo con OpenAI:
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "Eres un mentor académico experto en Ingeniería de Sistemas."
    //     },
    //     {
    //       role: "user",
    //       content: prompt
    //     }
    //   ]
    // });
    
    // Por ahora, respuesta de ejemplo:
    const insight = `📚 **${subject}** (Prof. ${professor})
    
**Conceptos Clave:**

1. **Fundamentos Teóricos**: Comprende los principios básicos y la teoría subyacente de la materia.

2. **Aplicación Práctica**: Conecta la teoría con casos de uso reales y proyectos prácticos.

3. **Metodología de Trabajo**: Aprende las mejores prácticas y metodologías específicas del área.

**Recomendación:**
Mantén una práctica constante, realiza proyectos personales y participa activamente en clase. La consistencia es clave para dominar esta materia.

¡Éxito en tus estudios! 🚀`;

    res.json({
      insight: insight,
      timestamp: Date.now(),
      subject: subject,
      status: 'success'
    });
    
  } catch (error) {
    console.error('Error en API de IA:', error);
    res.status(500).json({
      error: 'Error procesando consulta',
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('🤖 Servidor de IA corriendo en http://localhost:3000');
});
*/

// ============================================
// EJEMPLO 2: Python + FastAPI
// ============================================

/*
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InsightRequest(BaseModel):
    subject: str
    professor: str
    prompt: str

class InsightResponse(BaseModel):
    insight: str
    timestamp: int
    subject: str
    status: str

@app.post("/api/ai/insight", response_model=InsightResponse)
async def get_insight(request: InsightRequest):
    try:
        # Aquí conectas con tu servicio de IA
        # Ejemplo con OpenAI Python SDK:
        # from openai import OpenAI
        # client = OpenAI(api_key="tu-api-key")
        # 
        # response = client.chat.completions.create(
        #     model="gpt-4",
        #     messages=[
        #         {"role": "system", "content": "Eres un mentor académico experto."},
        #         {"role": "user", "content": request.prompt}
        #     ]
        # )
        # insight = response.choices[0].message.content
        
        # Respuesta de ejemplo:
        insight = f"""📚 **{request.subject}** (Prof. {request.professor})

**Conceptos Clave:**

1. **Fundamentos Teóricos**: Comprende los principios básicos y la teoría subyacente.

2. **Aplicación Práctica**: Conecta la teoría con casos de uso reales.

3. **Metodología de Trabajo**: Aprende las mejores prácticas del área.

**Recomendación:**
Mantén práctica constante y participa activamente. ¡Éxito! 🚀"""

        return InsightResponse(
            insight=insight,
            timestamp=int(time.time() * 1000),
            subject=request.subject,
            status="success"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
*/

// ============================================
// EJEMPLO 3: Integración con LM Studio
// ============================================

/*
// LM Studio corre un servidor OpenAI-compatible en localhost
// Solo necesitas redirigir las peticiones

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const LM_STUDIO_URL = 'http://localhost:1234/v1/chat/completions';

app.post('/api/ai/insight', async (req, res) => {
  try {
    const { subject, professor, prompt } = req.body;
    
    const response = await axios.post(LM_STUDIO_URL, {
      messages: [
        {
          role: "system",
          content: "Eres un mentor académico experto en Ingeniería de Sistemas. Responde en español."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    res.json({
      insight: response.data.choices[0].message.content,
      timestamp: Date.now(),
      subject: subject,
      status: 'success'
    });
    
  } catch (error) {
    console.error('Error conectando con LM Studio:', error.message);
    res.status(500).json({
      error: 'Error en LM Studio',
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('🤖 Proxy LM Studio corriendo en http://localhost:3000');
});
*/

// ============================================
// CONFIGURACIÓN EN HORARIO 3D
// ============================================

/*
En la consola del navegador de Horario 3D, ejecuta:

localStorage.setItem('ai_api_url', 'http://localhost:3000/api/ai/insight');

O si tu servidor está en otra máquina:

localStorage.setItem('ai_api_url', 'http://192.168.1.100:3000/api/ai/insight');
*/

// ============================================
// ENDPOINTS ADICIONALES OPCIONALES
// ============================================

/*
// Endpoint para configurar/validar conexión
app.get('/api/ai/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: Date.now()
  });
});

// Endpoint para sugerencias de tareas
app.post('/api/ai/task-suggestion', async (req, res) => {
  const { subject, currentTasks } = req.body;
  
  // Generar sugerencias de tareas basadas en la materia
  // ...
  
  res.json({
    suggestions: [
      "Revisar capítulo 3 del libro",
      "Practicar ejercicios de programación",
      "Investigar sobre el tema X"
    ]
  });
});
*/
