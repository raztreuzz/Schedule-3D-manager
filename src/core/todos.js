// Sistema de gestión de tareas (Todo List)

const STORAGE_KEY = 'sisix_todos';

// Generar ID único
export function generateTodoId() {
  return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Cargar todos desde localStorage
export function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const todos = JSON.parse(stored);
    console.log(`✅ ${todos.length} tareas cargadas desde localStorage`);
    return todos;
  } catch (error) {
    console.error('Error cargando tareas:', error);
    return [];
  }
}

// Guardar todos en localStorage
export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    console.log(`💾 ${todos.length} tareas guardadas`);
  } catch (error) {
    console.error('Error guardando tareas:', error);
  }
}

// Crear nueva tarea
export function createTodo({
  title,
  description = '',
  priority = 'media',
  dueDate = null,
  tags = [],
  subjectId = null,
  type = 'task', // 'task', 'todolist', 'project'
  projectData = null // Para proyectos: { phases: [], tasks: [] }
}) {
  const base = {
    id: generateTodoId(),
    title,
    description,
    completed: false,
    priority, // 'alta', 'media', 'baja'
    dueDate, // timestamp o null
    tags,
    subjectId, // vinculación con asignatura
    type, // tipo de item
    createdAt: Date.now(),
    completedAt: null
  };

  // Si es proyecto, agregar datos adicionales
  if (type === 'project') {
    base.projectData = projectData || {
      phases: [], // [{ id, name, completed, tasks: [] }]
      progress: 0 // 0-100
    };
  }

  return base;
}

// Actualizar tarea existente
export function updateTodo(todos, todoId, updates) {
  return todos.map(todo => {
    if (todo.id === todoId) {
      const updated = { ...todo, ...updates };
      // Si se marca como completada, guardar timestamp
      if (updates.completed === true && !todo.completed) {
        updated.completedAt = Date.now();
      }
      // Si se desmarca, limpiar timestamp
      if (updates.completed === false && todo.completed) {
        updated.completedAt = null;
      }
      return updated;
    }
    return todo;
  });
}

// Eliminar tarea
export function deleteTodo(todos, todoId) {
  return todos.filter(todo => todo.id !== todoId);
}

// Obtener tareas por asignatura
export function getTodosBySubject(todos, subjectId) {
  return todos.filter(todo => todo.subjectId === subjectId);
}

// Obtener tareas pendientes
export function getPendingTodos(todos) {
  return todos.filter(todo => !todo.completed);
}

// Obtener tareas completadas
export function getCompletedTodos(todos) {
  return todos.filter(todo => todo.completed);
}

// Filtrar tareas por prioridad
export function getTodosByPriority(todos, priority) {
  return todos.filter(todo => todo.priority === priority);
}

// Obtener items por tipo
export function getItemsByType(todos, type) {
  return todos.filter(todo => todo.type === type);
}

// Agregar fase a proyecto
export function addPhaseToProject(todos, projectId, phaseName) {
  return todos.map(todo => {
    if (todo.id === projectId && todo.type === 'project') {
      const newPhase = {
        id: `phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: phaseName,
        completed: false,
        tasks: []
      };
      return {
        ...todo,
        projectData: {
          ...todo.projectData,
          phases: [...todo.projectData.phases, newPhase]
        }
      };
    }
    return todo;
  });
}

// Agregar tarea a fase de proyecto
export function addTaskToPhase(todos, projectId, phaseId, taskTitle) {
  return todos.map(todo => {
    if (todo.id === projectId && todo.type === 'project') {
      const updatedPhases = todo.projectData.phases.map(phase => {
        if (phase.id === phaseId) {
          const newTask = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: taskTitle,
            completed: false
          };
          return {
            ...phase,
            tasks: [...phase.tasks, newTask]
          };
        }
        return phase;
      });
      return {
        ...todo,
        projectData: {
          ...todo.projectData,
          phases: updatedPhases
        }
      };
    }
    return todo;
  });
}

// Calcular progreso del proyecto
export function calculateProjectProgress(project) {
  if (!project.projectData || !project.projectData.phases.length) return 0;
  
  const totalTasks = project.projectData.phases.reduce((sum, phase) => {
    return sum + phase.tasks.length;
  }, 0);
  
  if (totalTasks === 0) return 0;
  
  const completedTasks = project.projectData.phases.reduce((sum, phase) => {
    return sum + phase.tasks.filter(t => t.completed).length;
  }, 0);
  
  return Math.round((completedTasks / totalTasks) * 100);
}

// Filtrar tareas por etiqueta
export function getTodosByTag(todos, tag) {
  return todos.filter(todo => todo.tags.includes(tag));
}

// Buscar tareas
export function searchTodos(todos, query) {
  const lowerQuery = query.toLowerCase();
  return todos.filter(todo =>
    todo.title.toLowerCase().includes(lowerQuery) ||
    todo.description.toLowerCase().includes(lowerQuery) ||
    todo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Obtener estadísticas
export function getTodoStats(todos) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter(t => t.priority === 'alta' && !t.completed).length;
  const overdue = todos.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return t.dueDate < Date.now();
  }).length;

  return {
    total,
    completed,
    pending,
    highPriority,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

// Obtener todas las etiquetas únicas
export function getAllTags(todos) {
  const tagSet = new Set();
  todos.forEach(todo => {
    todo.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
