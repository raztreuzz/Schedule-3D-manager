import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { animateTodoMeshes } from './todoMeshes';

let sceneInstance = null;

export const createEngine = (canvas) => {
  if (sceneInstance) return sceneInstance;

  console.log('Creando engine 3D...');
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x020204, 5, 300);
  scene.background = new THREE.Color(0x020204);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.05,
    3000
  );
  camera.position.set(0, 30, 50);
  camera.lookAt(0, 5, 0);
  console.log('Cámara posicionada en:', camera.position);

  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  console.log('Renderer creado');

  // Controles de cámara
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = true;
  controls.enableZoom = true;
  controls.minDistance = 5;
  controls.maxDistance = 250;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0, 5, 0);
  controls.update();
  console.log('Controles configurados - target:', controls.target);

  // Luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pLight1 = new THREE.PointLight(0x00f2ff, 6, 150);
  pLight1.position.set(40, 35, 30);
  scene.add(pLight1);

  const pLight2 = new THREE.PointLight(0xff007a, 5, 150);
  pLight2.position.set(-40, 35, -30);
  scene.add(pLight2);

  const pLight3 = new THREE.PointLight(0xffffff, 4, 100);
  pLight3.position.set(0, 40, 0);
  scene.add(pLight3);

  // Rejilla
  const grid = new THREE.GridHelper(200, 50, 0x22d3ee, 0x111111);
  grid.position.y = 0;
  scene.add(grid);

  // Grupo de cubos (se reconstruye, no la escena)
  const subjectsGroup = new THREE.Group();
  scene.add(subjectsGroup);
  console.log('Grupo de cubos creado');

  // Partículas «universo»: varias capas + cristalería
  const cosmos = { stars: [], shards: null };

  const makeStarLayer = ({ count, size, color, spread, opacity, speed }) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size,
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    points.userData = { speed, twinklePhase: Math.random() * Math.PI * 2 };
    scene.add(points);
    cosmos.stars.push(points);
    return points;
  };

  // Capas de estrellas
  makeStarLayer({ count: 1500, size: 0.08, color: 0x00f2ff, spread: 220, opacity: 0.35, speed: 0.0006 });
  makeStarLayer({ count: 1200, size: 0.06, color: 0x88ccff, spread: 400, opacity: 0.25, speed: 0.0003 });
  makeStarLayer({ count: 600,  size: 0.12, color: 0xff007a, spread: 240, opacity: 0.30, speed: 0.0008 });

  // Cristalería (fragmentos de vidrio translúcido)
  const shardGeo = new THREE.TetrahedronGeometry(0.6);
  const shardMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    transmission: 1.0, // efecto vidrio
    thickness: 0.3,
    ior: 1.45,
    transparent: true,
    opacity: 0.8,
  });
  const shardCount = 160;
  const shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
  const shardDummy = new THREE.Object3D();
  const shardData = [];
  for (let i = 0; i < shardCount; i++) {
    const radius = 70 + Math.random() * 40;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const s = 0.6 + Math.random() * 0.6;

    const pos = new THREE.Vector3(x, y, z);
    const rot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    shardDummy.position.copy(pos);
    shardDummy.rotation.copy(rot);
    shardDummy.scale.set(s, s, s);
    shardDummy.updateMatrix();
    shards.setMatrixAt(i, shardDummy.matrix);
    shardData.push({
      pos,
      rot,
      spin: new THREE.Vector3((Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01),
      drift: new THREE.Vector3((Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02),
      scale: s,
    });
  }
  shards.instanceMatrix.needsUpdate = true;
  scene.add(shards);
  cosmos.shards = { mesh: shards, dummy: shardDummy, data: shardData };

  // Estado de interacción
  const raycaster = new THREE.Raycaster();
  let animId = null;
  let onSubjectClick = null;
  let onTodoClick = null;

  const handleClick = (e) => {
    const v = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(v, camera);
    const intersects = raycaster.intersectObjects(subjectsGroup.children, true);
    
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      
      // Buscar si es una tarea
      while (obj.parent && !obj.userData.todoId && !obj.userData.id) {
        obj = obj.parent;
      }
      
      // Si es una tarea
      if (obj.userData.type === 'todo' && obj.userData.todoId && onTodoClick) {
        console.log('Click en tarea:', obj.userData.todoId);
        onTodoClick(obj.userData.todoId);
        e.preventDefault?.();
        return;
      }
      
      // Si es una asignatura
      if (obj.userData.id && onSubjectClick) {
        console.log('Click en asignatura:', obj.userData.id);
        onSubjectClick(obj.userData.id);
        e.preventDefault?.();
      }
    }
  };

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('click', handleClick);
  window.addEventListener('resize', handleResize);

  // Animación loop
  const clock = new THREE.Clock();
  let currentActiveId = null;

  const animate = () => {
    animId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const t = clock.getElapsedTime();

    controls.update();

    // Animación de capas de estrellas (rotación + twinkle)
    cosmos.stars.forEach((layer) => {
      const speed = layer.userData.speed;
      layer.rotation.y += speed;
      // twinkle con pequeña variación de opacidad
      const phase = layer.userData.twinklePhase;
      const base = 0.25; // nivel base de opacidad
      const amp = 0.12;  // amplitud de parpadeo
      const tw = base + amp * (0.5 + 0.5 * Math.sin(t * (2 + speed * 1000) + phase));
      layer.material.opacity = THREE.MathUtils.clamp(tw, 0.1, 0.6);
    });

    // Animación de cristalería (rotación + leve deriva)
    if (cosmos.shards) {
      const { mesh, dummy, data } = cosmos.shards;
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        // actualizar estado
        d.rot.x += d.spin.x;
        d.rot.y += d.spin.y;
        d.rot.z += d.spin.z;
        d.pos.add(d.drift);
        // reconstruir transform
        dummy.position.copy(d.pos);
        dummy.rotation.copy(d.rot);
        dummy.scale.set(d.scale, d.scale, d.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      // respiración sutil del material
      shardMat.opacity = 0.75 + 0.1 * Math.sin(t * 1.5);
    }

    // Animar tareas 3D
    animateTodoMeshes(scene, delta);

    subjectsGroup.children.forEach((block) => {
      // Solo animar si es un cubo de asignatura, no una tarea
      if (block.userData.type === 'todo') return;
      
      const isActive = currentActiveId === block.userData.id;
      block.scale.setScalar(
        THREE.MathUtils.lerp(block.scale.x, isActive ? 1.3 : 1, 0.1)
      );

      const baseY = block.userData.baseY ?? 0;
      const floatY = Math.sin(t * 2 + block.userData.id) * 0.5;
      block.position.y = THREE.MathUtils.lerp(
        block.position.y,
        baseY + (isActive ? 3 : 0) + floatY,
        0.1
      );

      if (block.children[0].material) {
        block.children[0].material.emissiveIntensity = isActive
          ? 2.5
          : 0.3 + Math.sin(t * 3) * 0.2;
      }
    });

    renderer.render(scene, camera);
  };

  animate();

  sceneInstance = {
    scene,
    camera,
    renderer,
    subjectsGroup,
    particles: cosmos.stars,
    setOnSubjectClick: (callback) => {
      onSubjectClick = callback;
    },
    setOnTodoClick: (callback) => {
      onTodoClick = callback;
    },
    setActiveSubject: (id) => {
      currentActiveId = id;
    },
    cleanup: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    },
  };

  console.log('Engine creado exitosamente');
  
  return sceneInstance;
};

export const getEngine = () => sceneInstance;
export const resetEngine = () => {
  sceneInstance = null;
};

