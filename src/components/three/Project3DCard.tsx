import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Project } from '../../types';
import { ExternalLink, Layers, Sparkles, Box, BookOpen, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface Project3DCardProps {
  project: Project;
  onOpenDemo?: (project: Project) => void;
  onStudyObject?: (project: Project) => void;
}

export const Project3DCard: React.FC<Project3DCardProps> = ({ project, onOpenDemo, onStudyObject }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const wireframeRef = useRef(wireframe);

  useEffect(() => {
    wireframeRef.current = wireframe;
  }, [wireframe]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);

    const point = new THREE.PointLight(project.color, 4, 15);
    point.position.set(3, 3, 3);
    scene.add(point);

    const point2 = new THREE.PointLight(0x38bdf8, 2, 15);
    point2.position.set(-3, -3, 3);
    scene.add(point2);

    // Geometry based on project.geometryType
    let geo: THREE.BufferGeometry;
    switch (project.geometryType) {
      case 'torusKnot':
        geo = new THREE.TorusKnotGeometry(0.8, 0.28, 100, 24);
        break;
      case 'icosahedron':
        geo = new THREE.IcosahedronGeometry(1.2, 0);
        break;
      case 'cyberSphere':
        geo = new THREE.SphereGeometry(1.1, 24, 24);
        break;
      case 'octahedron':
        geo = new THREE.OctahedronGeometry(1.2, 0);
        break;
      case 'dodecahedron':
        geo = new THREE.DodecahedronGeometry(1.1, 0);
        break;
      case 'ringMatrix':
        geo = new THREE.TorusGeometry(1.1, 0.2, 16, 50);
        break;
      default:
        geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: project.color,
      emissive: project.color,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.25,
      wireframe: wireframeRef.current,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Subtle outer wireframe ring
    const ringGeo = new THREE.TorusGeometry(1.7, 0.015, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      mat.wireframe = wireframeRef.current;

      const rotSpeed = isHovered ? 1.6 : 0.6;
      mesh.rotation.x += delta * 0.4 * rotSpeed;
      mesh.rotation.y += delta * 0.7 * rotSpeed;
      ring.rotation.z += delta * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [project.geometryType, project.color, isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl"
    >
      {/* 3D Scene Viewport */}
      <div className="relative w-full h-56 bg-neutral-950/70 overflow-hidden border-b border-neutral-800/60 flex items-center justify-center">
        <div
          ref={mountRef}
          onClick={() => (onOpenDemo ? onOpenDemo(project) : null)}
          className="w-full h-full cursor-pointer"
          title="Click to launch interactive 3D Inspector"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-code font-medium bg-neutral-900/80 backdrop-blur-md text-neutral-300 border border-neutral-800">
            {project.category}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-code text-neutral-400 bg-neutral-900/60 backdrop-blur-md border border-neutral-800/60">
            {project.year}
          </span>
        </div>

        {/* Top Right Quick Actions: Study & Wireframe */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {onStudyObject && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStudyObject(project);
              }}
              title="Study Mathematical Geometry & Web Resources"
              className="p-1.5 rounded-lg bg-neutral-900/80 backdrop-blur-md text-indigo-400 hover:text-white border border-neutral-800 hover:border-indigo-500/50 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setWireframe(!wireframe);
            }}
            title="Toggle 3D Wireframe"
            className="p-1.5 rounded-lg bg-neutral-900/80 backdrop-blur-md text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating interactive indicator */}
        <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-mono-code text-neutral-400 pointer-events-none">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Real-time Mesh</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold font-display text-white group-hover:text-indigo-300 transition-colors">
              {project.title}
            </h3>
          </div>

          {/* Quick study highlight badge if available */}
          {project.studyData && (
            <button
              onClick={() => (onStudyObject ? onStudyObject(project) : null)}
              className="inline-flex items-center gap-1 text-[11px] font-mono-code text-indigo-400 hover:text-indigo-300 transition-colors mt-0.5 mb-1 text-left"
            >
              <Compass className="w-3 h-3 shrink-0" />
              <span className="truncate underline decoration-indigo-500/40 hover:decoration-indigo-400">
                {project.studyData.geometricName}
              </span>
            </button>
          )}

          <p className="text-xs font-mono-code text-neutral-400 mt-1 mb-2.5">{project.subtitle}</p>
          <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed mb-4">{project.description}</p>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-neutral-950/60 border border-neutral-800/70 mb-4">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="text-center">
                <div className="text-[11px] font-mono-code text-neutral-400">{m.label}</div>
                <div className="text-xs font-bold font-mono-code text-white mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono-code px-2 py-0.5 rounded-md bg-neutral-800/60 text-neutral-300 border border-neutral-700/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 gap-2">
          {onStudyObject && project.studyData && (
            <button
              onClick={() => onStudyObject(project)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/70 text-xs font-medium transition-all group/study"
              title="Study mathematical topology, properties & read authoritative research"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400 group-hover/study:scale-110 transition-transform" />
              <span>Study Object</span>
            </button>
          )}

          <button
            onClick={() => (onOpenDemo ? onOpenDemo(project) : null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all ml-auto"
          >
            <span>Inspect 3D</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
