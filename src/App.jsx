import React, { useState, useRef, useEffect } from 'react';
import { createEngine } from './engine3d/createEngine';
import { rebuildDayMeshes } from './engine3d/rebuildDayMeshes';
import { loadSchedule, saveSchedule, getSubjectsForDay, DEFAULT_SUBJECTS } from './core/schedule';
import TopBar from './ui/TopBar';
import SubjectPanel from './ui/SubjectPanel';
import InsightPanel from './ui/InsightPanel';
import TodoPanel from './ui/TodoPanel';
import SubjectDashboard from './ui/SubjectDashboard';
import { loadTodos } from './core/todos';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export default function App() {
  const [subjects, setSubjects] = useState(() => {
    const loaded = loadSchedule();
    console.log('Asignaturas cargadas:', loaded.length);
    return loaded;
  });
  const [selectedDay, setSelectedDay] = useState(() => {
    const d = new Date().getDay() - 1;
    return d >= 0 && d <= 4 ? d : 0;
  });
  const [showAllDays, setShowAllDays] = useState(false);  // Nuevo: vista de todos los días
  const [activeSubject, setActiveSubject] = useState(null);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTodoPanel, setShowTodoPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardSubject, setDashboardSubject] = useState(null);
  const [todoUpdateTrigger, setTodoUpdateTrigger] = useState(0);

  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const subjectsRef = useRef(subjects);

  const resetSchedule = () => {
    localStorage.removeItem('sisix_schedule');
    setSubjects(DEFAULT_SUBJECTS);
    saveSchedule(DEFAULT_SUBJECTS);
    console.log('Horario reseteado a valores por defecto');
  };

  // Actualizar ref de subjects
  useEffect(() => {
    subjectsRef.current = subjects;
  }, [subjects]);

  // Inicializar engine 3D UNA SOLA VEZ
  useEffect(() => {
    if (!canvasRef.current || engineRef.current) {
      return;
    }

    console.log('Inicializando engine 3D...');
    const engine = createEngine(canvasRef.current);
    engineRef.current = engine;

    // Registrar callback para clicks en cubos
    engine.setOnSubjectClick((id) => {
      const subject = subjectsRef.current.find(s => s.id === id);
      setActiveSubject(subject || null);
    });

    // Registrar callback para clicks en tareas 3D
    engine.setOnTodoClick((todoId) => {
      console.log('Click en tarea 3D:', todoId);
      const allTodos = loadTodos();
      const todo = allTodos.find(t => t.id === todoId);
      if (todo) {
        // Encontrar la asignatura de esta tarea
        const subject = subjectsRef.current.find(s => s.id === todo.subjectId);
        if (subject) {
          setDashboardSubject(subject);
          setShowDashboard(true);
        }
      }
    });
  }, []);

  // Reconstruir meshes SOLO cuando cambian subjects, selectedDay, showAllDays o todoUpdateTrigger
  useEffect(() => {
    if (!engineRef.current) {
      console.warn('Engine aún no inicializado');
      return;
    }

    let dailySubjects;
    if (showAllDays) {
      dailySubjects = subjects;  // Todos los cubos
      console.log(`Vista completa: ${dailySubjects.length} asignaturas de toda la semana`);
    } else {
      dailySubjects = getSubjectsForDay(subjects, selectedDay);
      console.log(`Día ${selectedDay} (${DAYS[selectedDay]}): ${dailySubjects.length} asignaturas`);
    }
    console.log('Asignaturas:', dailySubjects.map(s => s.name));
    
    rebuildDayMeshes(
      engineRef.current.subjectsGroup,
      dailySubjects,
      showAllDays
    );
  }, [subjects, selectedDay, showAllDays, todoUpdateTrigger]);

  // Actualizar animación cuando cambia activeSubject (NO reconstruir meshes)
  useEffect(() => {
    if (!engineRef.current) return;
    
    if (activeSubject) {
      console.log('Activando asignatura:', activeSubject.name);
      engineRef.current.setActiveSubject(activeSubject.id);
    } else {
      console.log('Deactivando asignatura');
      engineRef.current.setActiveSubject(null);
    }
  }, [activeSubject?.id]);

  // Guardar cambios de subjects en localStorage
  useEffect(() => {
    saveSchedule(subjects);
  }, [subjects]);

  const handleFetchInsight = async (subject) => {
    if (!subject) return;
    setLoading(true);
    setInsight('');

    // URL de tu API externa que maneja la IA
    // Configura esta URL apuntando a tu otra aplicación
    const AI_API_URL = localStorage.getItem('ai_api_url') || 'http://localhost:3000/api/ai/insight';
    
    const requestData = {
      subject: subject.name,
      professor: subject.professor,
      prompt: `Dime 3 conceptos clave y una recomendación para la materia: ${subject.name} dictada por ${subject.professor}.`
    };

    try {
      let retries = 0;
      const maxRetries = 3;
      let response;

      while (retries < maxRetries) {
        try {
          response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              // Agregar token si tu API lo requiere
              // 'Authorization': `Bearer ${localStorage.getItem('ai_api_token')}`
            },
            body: JSON.stringify(requestData),
          });
          
          if (response.ok) {
            const result = await response.json();
            // Adaptar según la respuesta de tu API
            setInsight(
              result.insight || 
              result.response || 
              result.data?.text ||
              'Respuesta recibida del servidor de IA.'
            );
            break;
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (e) {
          console.error(`Intento ${retries + 1} fallido:`, e);
          retries++;
          if (retries < maxRetries) {
            await new Promise((r) => setTimeout(r, 1000));
          } else {
            // Fallback: mensaje informativo
            setInsight(
              `⚠️ No se pudo conectar con el servidor de IA.\n\n` +
              `Asegúrate de que tu aplicación de IA esté corriendo en: ${AI_API_URL}\n\n` +
              `Puedes configurar la URL en: localStorage.setItem('ai_api_url', 'tu-url')`
            );
          }
        }
      }
    } catch (e) {
      console.error('Error en consulta de IA:', e);
      setInsight(
        '❌ Error de conexión con el núcleo de IA.\n\n' +
        'Verifica que el servidor de IA esté activo y accesible.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020204] text-slate-200 font-mono overflow-hidden relative">
      {/* UI OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col p-6 md:p-12">
        <TopBar
          days={DAYS}
          selectedDay={selectedDay}
          showAllDays={showAllDays}
          showTodoPanel={showTodoPanel}
          onDayChange={(day) => {
            setSelectedDay(day);
            setActiveSubject(null);
          }}
          onToggleAllDays={(value) => {
            setShowAllDays(value !== undefined ? value : !showAllDays);
            setActiveSubject(null);
          }}
          onToggleTodoPanel={() => setShowTodoPanel(!showTodoPanel)}
          onReset={resetSchedule}
        />

        <div className="mt-auto max-w-lg pointer-events-auto">
          <SubjectPanel
            subject={activeSubject}
            onConsultAI={handleFetchInsight}
            loading={loading}
            onOpenTodos={() => setShowTodoPanel(true)}
            onOpenDashboard={() => {
              if (activeSubject) {
                setDashboardSubject(activeSubject);
                setShowDashboard(true);
              }
            }}
          />
        </div>
      </div>

      {/* IA PANEL */}
      <InsightPanel
        insight={insight}
        visible={!!insight}
        onClose={() => setInsight('')}
      />

      {/* TODO PANEL */}
      {showTodoPanel && (
        <TodoPanel
          subjects={subjects}
          activeSubject={activeSubject}
          onClose={() => setShowTodoPanel(false)}
        />
      )}

      {/* SUBJECT DASHBOARD */}
      {showDashboard && dashboardSubject && (
        <SubjectDashboard
          subject={dashboardSubject}
          onClose={() => {
            setShowDashboard(false);
            setDashboardSubject(null);
          }}
          onTodosUpdate={() => {
            // Trigger para reconstruir vista 3D
            setTodoUpdateTrigger(prev => prev + 1);
          }}
        />
      )}

      {/* CANVAS 3D */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0" 
        style={{ pointerEvents: 'auto', touchAction: 'none' }}
      />

      <style>{`
        @keyframes entry {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: entry 0.5s ease-out forwards;
        }
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          color: white;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #06b6d4;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

