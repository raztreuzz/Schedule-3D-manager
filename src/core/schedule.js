// Datos por defecto - Completo según horario compartido
const DEFAULT_SUBJECTS = [
  // Lunes (Day 0)
  { id: 1, name: "Práctica Final", professor: "Ing. Samy Eunice Pinto", room: "K-4", day: 0, start: 14.5, end: 16.3, color: "#ffbd00" },
  { id: 2, name: "Modelación y Simulación 1", professor: "Ing. Indira Marizela Valdés Ávila", room: "K-4", day: 0, start: 17.2, end: 18.1, color: "#7000ff" },
  { id: 4, name: "Análisis y Diseño de Sistemas 2", professor: "Ing. Hendrick Rolando Calderón Aguirre", room: "K-5", day: 0, start: 19.0, end: 19.5, color: "#ff007a" },

  // Martes (Day 1)
  { id: 5, name: "Inteligencia Artificial 1", professor: "Ing. René Estuardo Alvarado González", room: "K-5", day: 1, start: 14.5, end: 16.3, color: "#00f2ff" },
  { id: 6, name: "Modelación y Simulación 1", professor: "Ing. Indira Marizela Valdés Ávila", room: "K-4", day: 1, start: 17.2, end: 18.1, color: "#7000ff" },
  { id: 7, name: "Modelación y Simulación 1", professor: "Ing. Indira Marizela Valdés Ávila", room: "K-4", day: 1, start: 18.1, end: 19.0, color: "#7000ff" },
  { id: 8, name: "Análisis y Diseño de Sistemas 2", professor: "Ing. Hendrick Rolando Calderón Aguirre", room: "K-5", day: 1, start: 19.0, end: 19.5, color: "#ff007a" },

  // Miércoles (Day 2)
  { id: 9, name: "Seminario de Sistemas", professor: "Ing. Samy Eunice Pinto", room: "K-5", day: 2, start: 13.1, end: 16.3, color: "#00ff8c" },
  { id: 10, name: "Sistemas Organizacionales Gerenciales 1", professor: "Ing. Indira Marizela Valdés Ávila", room: "K-4", day: 2, start: 17.2, end: 18.1, color: "#ff5e00" },
  { id: 12, name: "Ética Profesional", professor: "Lic. Alcira Noemí Samayoa Monroy", room: "J-7", day: 2, start: 19.5, end: 20.4, color: "#ffffff" },

  // Jueves (Day 3)
  { id: 13, name: "Análisis y Diseño de Sistemas 2", professor: "Ing. Hendrick Rolando Calderón Aguirre", room: "K-4", day: 3, start: 18.1, end: 19.0, color: "#ff007a" },

  // Viernes (Day 4)
  { id: 14, name: "Ética Profesional", professor: "Lic. Alcira Noemí Samayoa Monroy", room: "J-8", day: 4, start: 16.3, end: 17.2, color: "#ffffff" },
  { id: 15, name: "Sistemas Organizacionales Gerenciales 1", professor: "Ing. Indira Marizela Valdés Ávila", room: "K-4", day: 4, start: 17.2, end: 18.1, color: "#ff5e00" },
  { id: 17, name: "Laboratorio de Análisis y Diseño de Sistemas 2", professor: "Ing. Hendrick Rolando Calderón Aguirre", room: "K-5", day: 4, start: 19.0, end: 19.5, color: "#ff007a" },
];

const HOURS_START = 7;
const HOURS_END = 18;

// Obtener asignaturas de un día específico
export const getSubjectsForDay = (subjects, day) => {
  return subjects.filter(s => s.day === day).sort((a, b) => a.start - b.start);
};

// Agregar asignatura
export const addSubject = (subjects, newSubject) => {
  return [...subjects, { ...newSubject, id: Math.max(...subjects.map(s => s.id), 0) + 1 }];
};

// Editar asignatura
export const editSubject = (subjects, id, updates) => {
  return subjects.map(s => s.id === id ? { ...s, ...updates } : s);
};

// Eliminar asignatura
export const removeSubject = (subjects, id) => {
  return subjects.filter(s => s.id !== id);
};

// Cargar datos (localStorage o por defecto)
export const loadSchedule = () => {
  try {
    const stored = localStorage.getItem('sisix_schedule');
    return stored ? JSON.parse(stored) : DEFAULT_SUBJECTS;
  } catch {
    return DEFAULT_SUBJECTS;
  }
};

// Guardar datos
export const saveSchedule = (subjects) => {
  localStorage.setItem('sisix_schedule', JSON.stringify(subjects));
};

export { DEFAULT_SUBJECTS, HOURS_START, HOURS_END };

