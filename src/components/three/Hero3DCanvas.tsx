import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AccentColor } from '../../types';
import { Eye, RotateCw, Sparkles, Box, Compass } from 'lucide-react';

interface Hero3DCanvasProps {
  accentColor: AccentColor;
  className?: string;
}

type GeometryType = 'torusKnot' | 'icosahedron' | 'dodecahedron' | 'octahedron';

const ACCENT_HEX_MAP: Record<AccentColor, number> = {
  indigo: 0x818cf8,
  cyan: 0x38bdf8,
  emerald: 0x34d399,
  rose: 0xf43f5e,
  amber: 0xfbbf24,
};

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ accentColor, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentShape, setCurrentShape] = useState<GeometryType>('torusKnot');
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [particleSpeed, setParticleSpeed] = useState(1);
  const [fps, setFps] = useState(60);

  // References for live updates without recreating renderer
  const shapeRef = useRef<GeometryType>(currentShape);
  const wireframeRef = useRef<boolean>(wireframeMode);
  const autoRotateRef = useRef<boolean>(autoRotate);
  const particleSpeedRef = useRef<number>(particleSpeed);
  const accentHexRef = useRef<number>(ACCENT_HEX_MAP[accentColor]);

  useEffect(() => {
    shapeRef.current = currentShape;
  }, [currentShape]);

  useEffect(() => {
    wireframeRef.current = wireframeMode;
  }, [wireframeMode]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    particleSpeedRef.current = particleSpeed;
  }, [particleSpeed]);

  useEffect(() => {
    accentHexRef.current = ACCENT_HEX_MAP[accentColor] || 0x818cf8;
  }, [accentColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const initialWidth = container.clientWidth || 600;
    const initialHeight = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    // 3. WebGL Renderer with graceful fallbacks
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Bright, multi-directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-5, -4, 4);
    scene.add(dirLight2);

    const pointLight1 = new THREE.PointLight(accentHexRef.current, 4.0, 30);
    pointLight1.position.set(4, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 3.0, 30);
    pointLight2.position.set(-4, -3, 4);
    scene.add(pointLight2);

    // 5. Star Particle Field (Reliable high-contrast points)
    const particleCount = 900;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc7d2fe,
      size: 0.07,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Central Spatial Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const getGeometry = (type: GeometryType): THREE.BufferGeometry => {
      switch (type) {
        case 'torusKnot':
          return new THREE.TorusKnotGeometry(1.3, 0.42, 128, 32);
        case 'icosahedron':
          return new THREE.IcosahedronGeometry(1.6, 1);
        case 'dodecahedron':
          return new THREE.DodecahedronGeometry(1.5, 0);
        case 'octahedron':
          return new THREE.OctahedronGeometry(1.7, 1);
        default:
          return new THREE.TorusKnotGeometry(1.3, 0.42, 128, 32);
      }
    };

    // Primary Luminous Mesh
    let activeGeo = getGeometry(shapeRef.current);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: accentHexRef.current,
      emissive: accentHexRef.current,
      emissiveIntensity: 0.35,
      metalness: 0.7,
      roughness: 0.2,
      wireframe: wireframeRef.current,
    });
    const coreMesh = new THREE.Mesh(activeGeo, coreMaterial);
    coreGroup.add(coreMesh);

    // Outer Geometric Wireframe Cage
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireMesh = new THREE.Mesh(activeGeo, wireMaterial);
    wireMesh.scale.set(1.035, 1.035, 1.035);
    coreGroup.add(wireMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: accentHexRef.current,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Orbital Ring 1
    const ringGeo1 = new THREE.TorusGeometry(2.5, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: accentHexRef.current,
      emissive: accentHexRef.current,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 0.3,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Orbital Ring 2
    const ringGeo2 = new THREE.TorusGeometry(3.1, 0.03, 16, 120);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.3,
      metalness: 0.5,
      roughness: 0.3,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 7. Interactive Pointer Dragging & Hover Parallax
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let hoverX = 0;
    let hoverY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      hoverX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      hoverY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    // 8. Main Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastTime = performance.now();
    let frameCount = 0;
    let activeShapeId = shapeRef.current;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // FPS calculation
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Shape switch check
      if (shapeRef.current !== activeShapeId) {
        activeShapeId = shapeRef.current;
        const newGeo = getGeometry(activeShapeId);
        coreMesh.geometry.dispose();
        wireMesh.geometry.dispose();
        coreMesh.geometry = newGeo;
        wireMesh.geometry = newGeo;
      }

      // Live accent color update
      const currentAccent = accentHexRef.current;
      pointLight1.color.setHex(currentAccent);
      coreMaterial.color.setHex(currentAccent);
      coreMaterial.emissive.setHex(currentAccent);
      innerMat.emissive.setHex(currentAccent);
      ringMat1.color.setHex(currentAccent);
      ringMat1.emissive.setHex(currentAccent);
      coreMaterial.wireframe = wireframeRef.current;

      // Rotation & Physics
      if (autoRotateRef.current && !isDragging) {
        targetRotationY += delta * 0.45;
        targetRotationX += delta * 0.15;
      }

      // Smooth interpolation
      coreGroup.rotation.y += (targetRotationY + hoverX * 0.3 - coreGroup.rotation.y) * 0.08;
      coreGroup.rotation.x += (targetRotationX - hoverY * 0.3 - coreGroup.rotation.x) * 0.08;

      // Orbital rings animation
      ring1.rotation.z += delta * 0.35;
      ring2.rotation.z -= delta * 0.3;
      innerMesh.rotation.y -= delta * 0.5;

      // Orbit point lights
      pointLight1.position.x = Math.sin(elapsedTime * 0.9) * 5;
      pointLight1.position.z = Math.cos(elapsedTime * 0.9) * 5;
      pointLight2.position.x = Math.sin(-elapsedTime * 0.8) * 4.5;
      pointLight2.position.y = Math.cos(elapsedTime * 0.8) * 3.5;

      // Particles drift
      particles.rotation.y += delta * 0.03 * particleSpeedRef.current;
      particles.rotation.x += delta * 0.015 * particleSpeedRef.current;

      renderer.render(scene, camera);
    };

    animate();

    // 9. ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      resizeObserver.disconnect();
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      coreMesh.geometry.dispose();
      coreMaterial.dispose();
      wireMesh.geometry.dispose();
      wireMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[500px] md:h-[600px] select-none rounded-2xl overflow-hidden bg-neutral-950/40 border border-neutral-900/60 shadow-2xl ${className}`}>
      {/* Canvas mount point */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* 3D HUD Interactive Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto flex flex-wrap items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800/90 p-2.5 rounded-xl shadow-2xl text-xs z-10">
        <div className="flex items-center gap-1.5 px-2 py-1 text-neutral-400 border-r border-neutral-800">
          <Box className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono-code text-[11px] text-neutral-200 font-bold">3D Core</span>
        </div>

        {/* Geometry Switcher */}
        <div className="flex items-center gap-1">
          {(
            [
              { id: 'torusKnot', label: 'Torus' },
              { id: 'icosahedron', label: 'Icosa' },
              { id: 'dodecahedron', label: 'Dodeca' },
              { id: 'octahedron', label: 'Octa' },
            ] as const
          ).map((shape) => (
            <button
              key={shape.id}
              onClick={() => setCurrentShape(shape.id)}
              className={`px-2.5 py-1 rounded-md transition-all font-mono-code text-[11px] font-medium ${
                currentShape === shape.id
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {shape.label}
            </button>
          ))}
        </div>

        {/* Controls: Wireframe, Auto-rotate, Particle Speed */}
        <div className="flex items-center gap-1 pl-1 border-l border-neutral-800">
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            title="Toggle Wireframe"
            className={`p-1.5 rounded-md transition-colors ${
              wireframeMode
                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto-Rotation"
            className={`p-1.5 rounded-md transition-colors ${
              autoRotate
                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setParticleSpeed((prev) => (prev === 1 ? 2.5 : prev === 2.5 ? 0.2 : 1))}
            title="Cycle Particle Speed"
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Telemetry Pill */}
        <div className="hidden sm:flex items-center gap-2 pl-2 text-[11px] font-mono-code text-neutral-400 border-l border-neutral-800">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {fps} FPS
          </span>
          <span className="text-neutral-500">Live 3D</span>
        </div>
      </div>

      {/* Interaction Hint Pill */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800/80 text-[11px] font-mono-code text-neutral-300 pointer-events-none shadow-lg">
        <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Drag / Rotate Core</span>
      </div>
    </div>
  );
};
