import React from 'react';
import { 
  HiPlus, HiCheck, HiTrash, HiX, HiCalendar, HiExclamation,
  HiChevronDown, HiChevronUp
} from 'react-icons/hi';
import { 
  loadTodos, saveTodos, createTodo, updateTodo, deleteTodo,
  getTodosBySubject, getPendingTodos
} from '../core/todos';

export default function SubjectDashboard({ subject, onClose, onTodosUpdate }) {
  const [todos, setTodos] = React.useState(() => {
    const allTodos = loadTodos();
    return getTodosBySubject(allTodos, subject.id);
  });
  const [showNewTodo, setShowNewTodo] = React.useState(false);
  const [expandedTodo, setExpandedTodo] = React.useState(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    priority: 'media',
    dueDate: '',
    tags: '',
    type: 'task' // 'task', 'todolist', 'project'
  });

  const pendingTodos = getPendingTodos(todos);

  // Formatear horario de la materia
  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const scheduleInfo = `${days[subject.day]} ${formatTime(subject.start)} - ${formatTime(subject.end)}`;

  const handleAddTodo = () => {
    if (!formData.title.trim()) return;

    const newTodo = createTodo({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      subjectId: subject.id,
      type: formData.type,
      projectData: formData.type === 'project' ? { phases: [], progress: 0 } : null
    });

    // Actualizar localStorage
    const allTodos = loadTodos();
    const updatedTodos = [...allTodos, newTodo];
    saveTodos(updatedTodos);
    
    // Actualizar estado local
    setTodos([...todos, newTodo]);
    
    // Notificar cambios para actualizar 3D
    if (onTodosUpdate) onTodosUpdate();
    
    // Resetear form
    setFormData({
      title: '',
      description: '',
      priority: 'media',
      dueDate: '',
      tags: '',
      type: 'task'
    });
    setShowNewTodo(false);
  };

  const handleToggleComplete = (todoId) => {
    const todo = todos.find(t => t.id === todoId);
    const allTodos = loadTodos();
    const updatedAllTodos = updateTodo(allTodos, todoId, { completed: !todo.completed });
    saveTodos(updatedAllTodos);
    
    setTodos(getTodosBySubject(updatedAllTodos, subject.id));
    if (onTodosUpdate) onTodosUpdate();
  };

  const handleDeleteTodo = (todoId) => {
    const allTodos = loadTodos();
    const updatedAllTodos = deleteTodo(allTodos, todoId);
    saveTodos(updatedAllTodos);
    
    setTodos(getTodosBySubject(updatedAllTodos, subject.id));
    if (expandedTodo === todoId) setExpandedTodo(null);
    if (onTodosUpdate) onTodosUpdate();
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'alta': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'media': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'baja': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const isOverdue = (todo) => {
    return !todo.completed && todo.dueDate && todo.dueDate < Date.now();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-cyan-500/50 rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.4)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: subject.color }} />
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">
                  {subject.name}
                </h2>
              </div>
              <div className="flex gap-4 text-sm text-gray-400 mb-2">
                <span>👨‍🏫 {subject.professor}</span>
                <span>📍 {subject.room}</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1.5 inline-flex">
                <HiCalendar size={16} />
                <span className="text-sm font-semibold">{scheduleInfo}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-2">
                  <div className="text-xs text-cyan-400/70 uppercase">Tareas totales</div>
                  <div className="text-2xl font-black text-cyan-400">{todos.length}</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-2">
                  <div className="text-xs text-yellow-400/70 uppercase">Pendientes</div>
                  <div className="text-2xl font-black text-yellow-400">{pendingTodos.length}</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2">
                  <div className="text-xs text-green-400/70 uppercase">Completadas</div>
                  <div className="text-2xl font-black text-green-400">{todos.length - pendingTodos.length}</div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors"
            >
              <HiX className="text-white" size={24} />
            </button>
          </div>
        </div>

        {/* Lista de tareas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {todos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">No hay tareas para esta materia</p>
              <p className="text-gray-600 text-sm mt-2">Crea una nueva tarea para comenzar</p>
            </div>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl border transition-all ${
                  todo.completed 
                    ? 'border-green-500/30 opacity-60' 
                    : isOverdue(todo)
                    ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(todo.id)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-white/30 hover:border-cyan-500'
                      }`}
                    >
                      {todo.completed && <HiCheck size={16} className="text-white" />}
                    </button>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold mb-2 ${
                        todo.completed ? 'line-through text-gray-500' : 'text-white'
                      }`}>
                        {todo.title}
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                            isOverdue(todo) 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                              : 'bg-white/10 text-gray-400 border border-white/10'
                          }`}>
                            <HiCalendar size={12} />
                            {formatDate(todo.dueDate)}
                          </span>
                        )}
                        {todo.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Descripción expandible */}
                      {todo.description && (
                        <>
                          {expandedTodo === todo.id && (
                            <p className="text-sm text-gray-400 leading-relaxed mb-2 p-3 bg-white/5 rounded-xl">
                              {todo.description}
                            </p>
                          )}
                          <button
                            onClick={() => setExpandedTodo(expandedTodo === todo.id ? null : todo.id)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            {expandedTodo === todo.id ? (
                              <>Ocultar descripción <HiChevronUp size={14} /></>
                            ) : (
                              <>Ver descripción <HiChevronDown size={14} /></>
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                    >
                      <HiTrash size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Nueva tarea */}
        <div className="p-6 border-t border-white/10 bg-black/50">
          {showNewTodo ? (
            <div className="space-y-3">
              {/* Selector de tipo */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'task' })}
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    formData.type === 'task'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  🎯 Tarea
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'todolist' })}
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    formData.type === 'todolist'
                      ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  📝 Recordatorio
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'project' })}
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    formData.type === 'project'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  🚀 Proyecto
                </button>
              </div>
              
              <input
                type="text"
                placeholder={
                  formData.type === 'task' ? "Título de la tarea..." :
                  formData.type === 'todolist' ? "Recordatorio..." :
                  "Nombre del proyecto..."
                }
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
              <textarea
                placeholder={
                  formData.type === 'project' ? "Descripción del proyecto..." : "Descripción (opcional)..."
                }
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                rows={3}
              />
              
              {/* Campos adicionales solo para tareas y proyectos */}
              {formData.type !== 'todolist' && (
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="baja">🟦 Prioridad Baja</option>
                    <option value="media">🟨 Prioridad Media</option>
                    <option value="alta">🟥 Prioridad Alta</option>
                  </select>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}
              
              <input
                type="text"
                placeholder="Etiquetas (separadas por comas)..."
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddTodo}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all"
                >
                  {formData.type === 'task' ? 'Agregar Tarea' : 
                   formData.type === 'todolist' ? 'Agregar Recordatorio' : 
                   'Crear Proyecto'}
                </button>
                <button
                  onClick={() => setShowNewTodo(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold uppercase text-sm transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewTodo(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold uppercase hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all flex items-center justify-center gap-3"
            >
              <HiPlus size={20} />
              Agregar Item para {subject.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
