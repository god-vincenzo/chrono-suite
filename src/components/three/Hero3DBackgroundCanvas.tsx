import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AccentColor } from '../../types';

export type HeroGeometryType = 'torusKnot' | 'icosahedron' | 'cyberSphere' | 'octahedron' | 'dodecahedron' | 'ringMatrix';

interface Hero3DBackgroundCanvasProps {
  accentColor: AccentColor;
  activeShape: HeroGeometryType;
  wireframe: boolean;
  className?: string;
}

const ACCENT_HEX_MAP: Record<AccentColor, number> = {
  indigo: 0x818cf8,
  cyan: 0x38bdf8,
  emerald: 0x34d399,
  rose: 0xf43f5e,
  amber: 0xfbbf24,
};

export const Hero3DBackgroundCanvas: React.FC<Hero3DBackgroundCanvasProps> = ({
  accentColor,
  activeShape,
  wireframe,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const shapeRef = useRef<HeroGeometryType>(activeShape);
  const wireframeRef = useRef<boolean>(wireframe);
  const accentHexRef = useRef<number>(ACCENT_HEX_MAP[accentColor]);

  useEffect(() => {
    shapeRef.current = activeShape;
  }, [activeShape]);

  useEffect(() => {
    wireframeRef.current = wireframe;
  }, [wireframe]);

  useEffect(() => {
    accentHexRef.current = ACCENT_HEX_MAP[accentColor] || 0x818cf8;
  }, [accentColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.035);

    // 2. Camera setup
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 750;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-6, -5, 4);
    scene.add(dirLight2);

    const cursorPointLight = new THREE.PointLight(accentHexRef.current, 5.0, 30);
    cursorPointLight.position.set(0, 0, 5);
    scene.add(cursorPointLight);

    const secondaryPointLight = new THREE.PointLight(0x38bdf8, 3.5, 30);
    secondaryPointLight.position.set(-4, -3, 3);
    scene.add(secondaryPointLight);

    // 5. Star Particle Cosmic Field
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalY = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      originalY[i] = positions[i * 3 + 1];
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc7d2fe,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Floating Satellite Polyhedra in the Background Depth
    const satellitesGroup = new THREE.Group();
    scene.add(satellitesGroup);

    const satelliteGeos = [
      new THREE.IcosahedronGeometry(0.55, 0),
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TorusGeometry(0.6, 0.1, 16, 32),
      new THREE.DodecahedronGeometry(0.5, 0),
      new THREE.IcosahedronGeometry(0.6, 1),
    ];

    const satelliteMeshes: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number; z: number } }[] = [];
    const satelliteCoords = [
      { x: -5.5, y: 2.8, z: -3.5 },
      { x: 5.8, y: -2.2, z: -4.0 },
      { x: -6.2, y: -2.8, z: -2.5 },
      { x: 5.2, y: 3.2, z: -3.2 },
      { x: 0, y: -4.2, z: -2.0 },
    ];

    satelliteCoords.forEach((coord, i) => {
      const geo = satelliteGeos[i % satelliteGeos.length];
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? accentHexRef.current : 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        roughness: 0.3,
        metalness: 0.7,
      });
      const sMesh = new THREE.Mesh(geo, mat);
      sMesh.position.set(coord.x, coord.y, coord.z);
      satellitesGroup.add(sMesh);
      satelliteMeshes.push({
        mesh: sMesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.4,
          y: (Math.random() - 0.5) * 0.6,
          z: (Math.random() - 0.5) * 0.3,
        },
      });
    });

    // 7. Central Main Hero 3D Spatial Core
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    scene.add(coreGroup);

    const getGeometry = (type: HeroGeometryType): THREE.BufferGeometry => {
      switch (type) {
        case 'torusKnot':
          return new THREE.TorusKnotGeometry(1.6, 0.48, 128, 32);
        case 'icosahedron':
          return new THREE.IcosahedronGeometry(1.9, 1);
        case 'cyberSphere':
          return new THREE.SphereGeometry(1.8, 36, 36);
        case 'dodecahedron':
          return new THREE.DodecahedronGeometry(1.8, 0);
        case 'octahedron':
          return new THREE.OctahedronGeometry(2.0, 1);
        case 'ringMatrix':
          return new THREE.TorusGeometry(1.8, 0.32, 24, 80);
        default:
          return new THREE.TorusKnotGeometry(1.6, 0.48, 128, 32);
      }
    };

    let activeGeo = getGeometry(shapeRef.current);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: accentHexRef.current,
      emissive: accentHexRef.current,
      emissiveIntensity: 0.35,
      metalness: 0.75,
      roughness: 0.18,
      wireframe: wireframeRef.current,
    });
    const coreMesh = new THREE.Mesh(activeGeo, coreMaterial);
    coreGroup.add(coreMesh);

    // Outer Geometric Wireframe Cage
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(activeGeo, wireMaterial);
    wireMesh.scale.set(1.03, 1.03, 1.03);
    coreGroup.add(wireMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: accentHexRef.current,
      emissiveIntensity: 0.7,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Large Orbital Ring 1
    const ringGeo1 = new THREE.TorusGeometry(3.0, 0.035, 16, 120);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: accentHexRef.current,
      emissive: accentHexRef.current,
      emissiveIntensity: 0.4,
      metalness: 0.6,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Large Orbital Ring 2
    const ringGeo2 = new THREE.TorusGeometry(3.6, 0.025, 16, 140);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      metalness: 0.6,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 8. Cursor tracking & Parallax Lerping
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();
    let currentLoadedShape = shapeRef.current;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Check for shape geometry updates
      if (shapeRef.current !== currentLoadedShape) {
        currentLoadedShape = shapeRef.current;
        const newGeo = getGeometry(currentLoadedShape);
        coreMesh.geometry.dispose();
        wireMesh.geometry.dispose();
        coreMesh.geometry = newGeo;
        wireMesh.geometry = newGeo;
      }

      // Live material settings
      coreMaterial.wireframe = wireframeRef.current;
      coreMaterial.color.setHex(accentHexRef.current);
      coreMaterial.emissive.setHex(accentHexRef.current);
      innerMat.emissive.setHex(accentHexRef.current);
      ringMat1.color.setHex(accentHexRef.current);
      ringMat1.emissive.setHex(accentHexRef.current);
      cursorPointLight.color.setHex(accentHexRef.current);

      // Lerp mouse tracking
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Update cursor point light in 3D space
      cursorPointLight.position.x = currentX * 6;
      cursorPointLight.position.y = currentY * 5;

      // Core rotation with subtle cursor influence
      coreGroup.rotation.y += delta * 0.4 + currentX * 0.01;
      coreGroup.rotation.x += delta * 0.2 + currentY * 0.01;
      innerMesh.rotation.y -= delta * 0.6;
      ring1.rotation.z += delta * 0.25;
      ring2.rotation.z -= delta * 0.18;

      // Gentle camera parallax sway
      camera.position.x = currentX * 1.2;
      camera.position.y = currentY * 0.8;
      camera.lookAt(0, 0, 0);

      // Rotate satellites
      satelliteMeshes.forEach((item) => {
        item.mesh.rotation.x += delta * item.rotSpeed.x;
        item.mesh.rotation.y += delta * item.rotSpeed.y;
        item.mesh.rotation.z += delta * item.rotSpeed.z;
      });

      // Subtle starfield wave
      particles.rotation.y += delta * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      satelliteGeos.forEach((g) => g.dispose());
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
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
