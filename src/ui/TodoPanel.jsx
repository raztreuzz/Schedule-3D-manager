import React, { useState, useEffect } from 'react';
import { 
  HiPlus, HiSearch, HiX, HiCheck, HiTrash, HiPencil, HiChevronDown, 
  HiChevronUp, HiCalendar, HiTag, HiExclamation, HiClock
} from 'react-icons/hi';
import {
  loadTodos, saveTodos, createTodo, updateTodo, deleteTodo,
  searchTodos, getTodoStats, getAllTags, getPendingTodos, getCompletedTodos
} from '../core/todos';

export default function TodoPanel({ subjects, activeSubject, onClose }) {
  const [todos, setTodos] = useState(() => loadTodos());
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [expandedTodo, setExpandedTodo] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'media',
    dueDate: '',
    tags: '',
    subjectId: activeSubject?.id || null
  });

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const stats = getTodoStats(todos);

  // Filtrar tareas
  const getFilteredTodos = () => {
    let filtered = todos;

    // Filtro por estado
    if (filter === 'pending') filtered = getPendingTodos(filtered);
    if (filter === 'completed') filtered = getCompletedTodos(filtered);

    // Filtro por prioridad
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Búsqueda
    if (searchQuery) {
      filtered = searchTodos(filtered, searchQuery);
    }

    // Ordenar: pendientes primero, por prioridad, luego por fecha
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { alta: 0, media: 1, baja: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.createdAt - a.createdAt;
    });
  };

  const handleAddTodo = () => {
    if (!formData.title.trim()) return;

    const newTodo = createTodo({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      subjectId: formData.subjectId
    });

    setTodos([...todos, newTodo]);
    setFormData({
      title: '',
      description: '',
      priority: 'media',
      dueDate: '',
      tags: '',
      subjectId: activeSubject?.id || null
    });
    setShowNewTodo(false);
  };

  const handleUpdateTodo = (todoId, updates) => {
    setTodos(updateTodo(todos, todoId, updates));
  };

  const handleDeleteTodo = (todoId) => {
    setTodos(deleteTodo(todos, todoId));
    if (expandedTodo === todoId) setExpandedTodo(null);
    if (editingTodo === todoId) setEditingTodo(null);
  };

  const handleToggleComplete = (todoId) => {
    const todo = todos.find(t => t.id === todoId);
    handleUpdateTodo(todoId, { completed: !todo.completed });
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
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const isOverdue = (todo) => {
    return !todo.completed && todo.dueDate && todo.dueDate < Date.now();
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="fixed top-4 right-4 w-[420px] max-h-[calc(100vh-2rem)] bg-black/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.3)] overflow-hidden flex flex-col z-50 pointer-events-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              📝 Tareas
            </h2>
            <p className="text-[9px] text-cyan-400/70 tracking-wider uppercase mt-1">
              Task Management System
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <HiX className="text-white" size={20} />
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
            <div className="text-xl font-black text-white">{stats.total}</div>
            <div className="text-[8px] text-gray-400 uppercase">Total</div>
          </div>
          <div className="bg-cyan-500/10 rounded-xl p-2 text-center border border-cyan-500/30">
            <div className="text-xl font-black text-cyan-400">{stats.pending}</div>
            <div className="text-[8px] text-cyan-400/70 uppercase">Activas</div>
          </div>
          <div className="bg-green-500/10 rounded-xl p-2 text-center border border-green-500/30">
            <div className="text-xl font-black text-green-400">{stats.completionRate}%</div>
            <div className="text-[8px] text-green-400/70 uppercase">Progreso</div>
          </div>
          <div className="bg-red-500/10 rounded-xl p-2 text-center border border-red-500/30">
            <div className="text-xl font-black text-red-400">{stats.overdue}</div>
            <div className="text-[8px] text-red-400/70 uppercase">Vencidas</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-3 bg-white/5 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="p-4 border-b border-white/10 space-y-2">
        {/* Búsqueda */}
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              filter === 'all' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Completadas
          </button>
        </div>

        {/* Filtro de prioridad */}
        <div className="flex gap-2">
          <button
            onClick={() => setPriorityFilter('all')}
            className={`flex-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
              priorityFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setPriorityFilter('alta')}
            className={`flex-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
              priorityFilter === 'alta' ? 'bg-red-500/30 text-red-400' : 'bg-white/5 text-gray-500'
            }`}
          >
            Alta
          </button>
          <button
            onClick={() => setPriorityFilter('media')}
            className={`flex-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
              priorityFilter === 'media' ? 'bg-yellow-500/30 text-yellow-400' : 'bg-white/5 text-gray-500'
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setPriorityFilter('baja')}
            className={`flex-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
              priorityFilter === 'baja' ? 'bg-blue-500/30 text-blue-400' : 'bg-white/5 text-gray-500'
            }`}
          >
            Baja
          </button>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500 text-sm">No hay tareas</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`bg-white/5 backdrop-blur-sm rounded-xl border transition-all ${
                todo.completed 
                  ? 'border-green-500/30 opacity-60' 
                  : isOverdue(todo)
                  ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="p-3">
                {/* Header de la tarea */}
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(todo.id)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/30 hover:border-cyan-500'
                    }`}
                  >
                    {todo.completed && <HiCheck size={14} className="text-white" />}
                  </button>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold ${
                      todo.completed ? 'line-through text-gray-500' : 'text-white'
                    }`}>
                      {todo.title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                      {todo.dueDate && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                          isOverdue(todo) 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                            : 'bg-white/10 text-gray-400 border border-white/10'
                        }`}>
                          <HiCalendar size={10} />
                          {formatDate(todo.dueDate)}
                        </span>
                      )}
                      {todo.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Descripción expandible */}
                    {todo.description && expandedTodo === todo.id && (
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        {todo.description}
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-1">
                    {todo.description && (
                      <button
                        onClick={() => setExpandedTodo(expandedTodo === todo.id ? null : todo.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {expandedTodo === todo.id ? (
                          <HiChevronUp size={14} className="text-gray-400" />
                        ) : (
                          <HiChevronDown size={14} className="text-gray-400" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <HiTrash size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con botón agregar */}
      <div className="p-4 border-t border-white/10">
        {showNewTodo ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Título de la tarea..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
            <textarea
              placeholder="Descripción (opcional)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="baja">🟦 Baja</option>
                <option value="media">🟨 Media</option>
                <option value="alta">🟥 Alta</option>
              </select>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={formData.subjectId || ''}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">🎯 Sin asignar a materia</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Etiquetas (separadas por comas)..."
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTodo}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowNewTodo(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-bold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewTodo(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-3 rounded-xl font-bold uppercase text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <HiPlus size={18} />
            Nueva Tarea
          </button>
        )}
      </div>
    </div>
  );
}
