import * as THREE from 'three';

// Crear visualización 3D según tipo de item
export const createTodoMesh = (todo, index, totalTodos) => {
  const group = new THREE.Group();
  
  // Tipo: task (tarea orbital)
  if (todo.type === 'task' || !todo.type) {
    return createTaskMesh(todo, index, totalTodos);
  }
  
  // Tipo: todolist (recordatorio - cubo pequeño conectado)
  if (todo.type === 'todolist') {
    return createTodoListMesh(todo, index, totalTodos);
  }
  
  // Tipo: project (proyecto con fases)
  if (todo.type === 'project') {
    return createProjectMesh(todo, index, totalTodos);
  }
  
  return group;
};

// Tarea orbital (comportamiento actual)
const createTaskMesh = (todo, index, totalTodos) => {
  const group = new THREE.Group();
  
  // Tamaño base según prioridad
  const sizes = {
    alta: 1.5,
    media: 1.2,
    baja: 0.9
  };
  const size = sizes[todo.priority] || 1.2;

  // Colores según prioridad
  const colors = {
    alta: 0xff0000,    // Rojo
    media: 0xffaa00,   // Naranja
    baja: 0x00aaff     // Azul
  };
  const color = colors[todo.priority] || 0xffaa00;

  // Geometría según estado
  let geometry;
  if (todo.completed) {
    geometry = new THREE.SphereGeometry(size * 0.5, 16, 16);
  } else {
    if (todo.priority === 'alta') {
      geometry = new THREE.OctahedronGeometry(size * 0.6);
    } else if (todo.priority === 'media') {
      geometry = new THREE.BoxGeometry(size, size, size);
    } else {
      geometry = new THREE.TetrahedronGeometry(size * 0.6);
    }
  }

  const material = new THREE.MeshStandardMaterial({
    color: todo.completed ? 0x00ff00 : color,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: todo.completed ? 0.4 : 0.9,
    emissive: todo.completed ? 0x00ff00 : color,
    emissiveIntensity: todo.completed ? 0.2 : 0.6,
  });

  const mesh = new THREE.Mesh(geometry, material);

  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ 
      color: todo.completed ? 0x00ff00 : color,
      transparent: true,
      opacity: 0.8
    })
  );

  group.add(mesh, wireframe);

  const radius = 8;
  const angle = (index / totalTodos) * Math.PI * 2;
  const xOffset = Math.cos(angle) * radius;
  const zOffset = Math.sin(angle) * radius;
  const yOffset = (index % 3 - 1) * 2;

  group.position.set(xOffset, yOffset, zOffset);
  
  group.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );

  group.userData = {
    type: 'todo',
    itemType: 'task',
    todoId: todo.id,
    completed: todo.completed
  };

  return group;
};

// TODO LIST - Recordatorio simple (cubo pequeño conectado)
const createTodoListMesh = (todo, index, totalTodos) => {
  const group = new THREE.Group();
  
  const size = 0.8;
  const color = todo.completed ? 0x00ff00 : 0xffffff;
  
  // Cubo pequeño
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: todo.completed ? 0.3 : 0.8,
    emissive: color,
    emissiveIntensity: todo.completed ? 0.1 : 0.4,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 })
  );
  
  group.add(mesh, wireframe);
  
  // Posición: fuera del círculo orbital
  const radius = 15; // Más lejos que las tareas
  const angle = (index / totalTodos) * Math.PI * 2;
  const xOffset = Math.cos(angle) * radius;
  const zOffset = Math.sin(angle) * radius;
  const yOffset = Math.sin(angle * 3) * 3; // Altura variable
  
  group.position.set(xOffset, yOffset, zOffset);
  
  // Crear línea de conexión al centro
  const points = [
    new THREE.Vector3(0, 0, 0), // Centro del cubo principal
    new THREE.Vector3(xOffset, yOffset, zOffset) // Posición del todo
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: todo.completed ? 0.2 : 0.4,
    linewidth: 1
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  line.userData.isConnectionLine = true;
  group.add(line);
  
  group.userData = {
    type: 'todo',
    itemType: 'todolist',
    todoId: todo.id,
    completed: todo.completed
  };
  
  return group;
};

// PROYECTO - Con fases y sub-tareas
const createProjectMesh = (todo, index, totalTodos) => {
  const group = new THREE.Group();
  
  const baseSize = 1.8;
  const color = 0xff00ff; // Magenta para proyectos
  
  // Cubo principal del proyecto
  const geometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.7,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
    emissive: color,
    emissiveIntensity: 0.7,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: color, linewidth: 2 })
  );
  
  group.add(mesh, wireframe);
  
  // Crear sub-cubos para cada fase
  if (todo.projectData && todo.projectData.phases) {
    todo.projectData.phases.forEach((phase, phaseIndex) => {
      const phaseGroup = createPhaseMesh(phase, phaseIndex, todo.projectData.phases.length);
      group.add(phaseGroup);
    });
  }
  
  // Posición: más alejado que todolist
  const radius = 20;
  const angle = (index / totalTodos) * Math.PI * 2;
  const xOffset = Math.cos(angle) * radius;
  const zOffset = Math.sin(angle) * radius;
  const yOffset = 5; // Elevado
  
  group.position.set(xOffset, yOffset, zOffset);
  
  // Línea de conexión al centro
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(xOffset, yOffset, zOffset)
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.5,
    linewidth: 2
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  line.userData.isConnectionLine = true;
  group.add(line);
  
  group.userData = {
    type: 'todo',
    itemType: 'project',
    todoId: todo.id,
    completed: todo.completed
  };
  
  return group;
};

// Crear cubo de fase
const createPhaseMesh = (phase, index, totalPhases) => {
  const group = new THREE.Group();
  
  const size = 0.6;
  const color = phase.completed ? 0x00ff00 : 0xffff00;
  
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: phase.completed ? 0.4 : 0.8,
    emissive: color,
    emissiveIntensity: 0.5,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: color })
  );
  
  group.add(mesh, wireframe);
  
  // Posición en cadena alrededor del cubo principal
  const distance = 3;
  const angle = (index / totalPhases) * Math.PI * 2;
  const x = Math.cos(angle) * distance;
  const z = Math.sin(angle) * distance;
  
  group.position.set(x, 0, z);
  
  // Línea conectando fase al cubo principal del proyecto
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(x, 0, z)
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.4
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);
  
  group.userData = {
    phaseId: phase.id,
    completed: phase.completed
  };
  
  return group;
};

// Actualizar todas las tareas 3D de una asignatura
export const rebuildTodoMeshes = (subjectGroup, todos) => {
  // Remover tareas anteriores
  const todoMeshes = subjectGroup.children.filter(
    child => child.userData.type === 'todo'
  );
  todoMeshes.forEach(mesh => {
    subjectGroup.remove(mesh);
    mesh.children.forEach(child => {
      child.geometry?.dispose();
      child.material?.dispose();
    });
  });

  // Crear nuevas tareas
  if (!todos || todos.length === 0) return;

  todos.forEach((todo, index) => {
    const todoMesh = createTodoMesh(todo, index, todos.length);
    subjectGroup.add(todoMesh);
  });

  console.log(`✅ ${todos.length} tareas 3D actualizadas`);
};

// Animar tareas 3D (llamar en el loop de animación)
export const animateTodoMeshes = (scene, delta) => {
  const time = Date.now() * 0.001;
  
  scene.traverse((object) => {
    if (object.userData.type === 'todo') {
      const itemType = object.userData.itemType;
      
      // TAREAS ORBITALES
      if (itemType === 'task' || !itemType) {
        object.rotation.y += delta * 0.5;
        object.rotation.x += delta * 0.3;
        
        if (object.userData.completed) {
          if (!object.userData.fadeStartTime) {
            object.userData.fadeStartTime = time;
          }
          
          const fadeProgress = (time - object.userData.fadeStartTime) * 0.5;
          
          const currentRadius = Math.sqrt(
            object.position.x * object.position.x + 
            object.position.z * object.position.z
          );
          const targetRadius = currentRadius + fadeProgress * 2;
          const angle = Math.atan2(object.position.z, object.position.x);
          object.position.x = Math.cos(angle) * targetRadius;
          object.position.z = Math.sin(angle) * targetRadius;
          object.position.y += fadeProgress * 0.5;
          
          const opacity = Math.max(0, 1 - fadeProgress);
          object.traverse((child) => {
            if (child.material) {
              child.material.opacity = opacity * 0.4;
            }
          });
          
          const scale = Math.max(0.1, 1 - fadeProgress * 0.5);
          object.scale.set(scale, scale, scale);
        } else {
          if (!object.userData.orbitSpeed) {
            object.userData.orbitSpeed = 0.3 + Math.random() * 0.4;
            object.userData.orbitPhase = Math.random() * Math.PI * 2;
          }
          
          const radius = 8;
          const angle = object.userData.orbitPhase + time * object.userData.orbitSpeed;
          
          object.position.x = Math.cos(angle) * radius;
          object.position.z = Math.sin(angle) * radius;
          
          const verticalOffset = Math.sin(time * 0.8 + object.userData.orbitPhase) * 1.5;
          object.position.y = verticalOffset;
          
          const scale = 1 + Math.sin(time * 2 + object.userData.orbitPhase) * 0.15;
          object.scale.set(scale, scale, scale);
        }
      }
      
      // TODO LIST - Flotan y pulsan suavemente
      if (itemType === 'todolist') {
        object.rotation.y += delta * 0.3;
        
        if (!object.userData.floatPhase) {
          object.userData.floatPhase = Math.random() * Math.PI * 2;
        }
        
        // Mantener posición base pero con flotación
        const baseRadius = 15;
        const floatAmount = Math.sin(time * 0.5 + object.userData.floatPhase) * 0.5;
        
        // Actualizar solo la posición Y para flotación
        const angle = object.userData.floatPhase;
        const yBase = Math.sin(angle * 3) * 3;
        object.position.y = yBase + floatAmount;
        
        // Pulsación sutil
        const scale = 1 + Math.sin(time * 1.5 + object.userData.floatPhase) * 0.1;
        object.scale.set(scale, scale, scale);
        
        // Actualizar línea de conexión
        object.children.forEach(child => {
          if (child.userData.isConnectionLine && child.geometry) {
            const positions = child.geometry.attributes.position.array;
            positions[4] = object.position.y; // Actualizar Y del punto final
            child.geometry.attributes.position.needsUpdate = true;
          }
        });
      }
      
      // PROYECTOS - Rotan con sus fases orbitando
      if (itemType === 'project') {
        object.rotation.y += delta * 0.2;
        
        // Flotación suave
        const floatY = Math.sin(time * 0.4) * 0.8;
        object.position.y = 5 + floatY;
        
        // Animar fases (sub-cubos)
        object.children.forEach((child) => {
          if (child.userData.phaseId) {
            // Rotar fase sobre sí misma
            child.rotation.y += delta * 0.8;
            child.rotation.x += delta * 0.5;
            
            // Pulsación si no está completada
            if (!child.userData.completed) {
              const scale = 1 + Math.sin(time * 3) * 0.12;
              child.scale.set(scale, scale, scale);
            }
          }
        });
        
        // Actualizar línea de conexión principal
        object.children.forEach(child => {
          if (child.userData.isConnectionLine && child.geometry) {
            const positions = child.geometry.attributes.position.array;
            positions[4] = object.position.y;
            child.geometry.attributes.position.needsUpdate = true;
          }
        });
      }
    }
  });
};
