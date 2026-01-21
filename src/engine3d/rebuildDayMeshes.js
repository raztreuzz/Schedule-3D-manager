import * as THREE from 'three';
import { rebuildTodoMeshes } from './todoMeshes';
import { loadTodos, getTodosBySubject } from '../core/todos';

export const rebuildDayMeshes = (subjectsGroup, subjects, showAllDays = false) => {
  console.log('🔄 ============ RECONSTRUYENDO MESHES ============');
  console.log('📦 subjectsGroup:', subjectsGroup);
  console.log('📚 subjects.length:', subjects.length);
  console.log('🌍 showAllDays:', showAllDays);
  console.log('📋 Asignaturas a renderizar:', subjects.map(s => `${s.name} (día ${s.day})`));
  
  // Limpiar meshes anteriores
  console.log('- Limpiando', subjectsGroup.children.length, 'meshes anteriores');
  while (subjectsGroup.children.length > 0) {
    const child = subjectsGroup.children[0];
    subjectsGroup.remove(child);
  }

  if (!subjects.length) {
    console.log('Sin asignaturas para este día');
    return;
  }

  // Agrupar por día para calcular offset en X
  const subjectsByDay = {};
  subjects.forEach((subject) => {
    if (!subjectsByDay[subject.day]) {
      subjectsByDay[subject.day] = [];
    }
    subjectsByDay[subject.day].push(subject);
  });

  subjects.forEach((subject, idx) => {
    console.log(`\n🎨 Creando cubo ${idx + 1}/${subjects.length}`);
    console.log(`   📌 Nombre: ${subject.name}`);
    console.log(`   🎨 Color: ${subject.color}`);
    console.log(`   📅 Día: ${subject.day}, Hora: ${subject.start} - ${subject.end}`);
    
    
    const blockGroup = new THREE.Group();
    const height = (subject.end - subject.start) * 5;

    try {
      // Geometría del cubo
      const geo = new THREE.BoxGeometry(15, height, 12);
      
      const mat = new THREE.MeshStandardMaterial({
        color: subject.color,
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
        emissive: subject.color,
        emissiveIntensity: 0.8,
      });
      
      const mesh = new THREE.Mesh(geo, mat);

      // Bordes
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: subject.color, linewidth: 2 })
      );

      blockGroup.add(mesh, edges);

      // POSICIONAMIENTO
      let xPos, zPos;
      if (showAllDays) {
        // Modo VER TODO: posicionar por DÍA en X, por HORA en Z
        const dayBase = (subject.day - 2) * 50;
        // Calcular índice dentro del día para evitar superposiciones
        const daySubjects = subjectsByDay[subject.day];
        const indexInDay = daySubjects.findIndex(s => s.id === subject.id);
        const lateralOffset = indexInDay * 18 - (daySubjects.length - 1) * 9;
        xPos = dayBase + lateralOffset;
        zPos = (subject.start - 16.5) * 8;  
      } else {
        // Modo día: distribuir horizontalmente por índice
        xPos = idx * 22 - (subjects.length - 1) * 11;
        zPos = (subject.start - 16.5) * 5;  
      }
      
      blockGroup.position.set(xPos, 5 + height / 2, zPos);
      blockGroup.userData = { id: subject.id, baseY: height / 2 };

      subjectsGroup.add(blockGroup);
      console.log(`   ✅ Cubo agregado en posición (x:${xPos.toFixed(1)}, y:${(5 + height/2).toFixed(1)}, z:${zPos.toFixed(1)})`);
      console.log(`   📏 Altura: ${height.toFixed(1)} unidades`);
      
      // Agregar tareas 3D para esta asignatura
      const allTodos = loadTodos();
      const subjectTodos = getTodosBySubject(allTodos, subject.id);
      if (subjectTodos.length > 0) {
        console.log(`Agregando ${subjectTodos.length} tareas 3D a ${subject.name}`);
        rebuildTodoMeshes(blockGroup, subjectTodos);
      }
    } catch (err) {
      console.error(`Error creando cubo ${idx + 1}:`, err);
    }
  });
  
  console.log(`\n✨ ============ COMPLETADO ============`);
  console.log(`📊 Total cubos creados: ${subjectsGroup.children.length}`);
  console.log(`🎯 Cubos en escena:`, subjectsGroup.children.map(c => c.userData.id));
  console.log(`📍 Posiciones de cubos:`);
  subjectsGroup.children.forEach((child, i) => {
    console.log(`   Cubo ${i + 1}: pos(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`);
  });
  console.log(`=====================================\n`);
};;

// Helper para calcular posición en tiempo
export const getTimePosition = (hour) => {
  return (hour - 12.5) * 8;
};

// Helper para obtener hora desde posición Z
export const getTimeFromPosition = (zPos) => {
  return Math.round(zPos / 8 + 12.5);
};

