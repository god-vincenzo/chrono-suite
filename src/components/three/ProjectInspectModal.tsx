import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Project } from '../../types';
import { X, RotateCcw, Maximize2, Layers, Sliders, BookOpen, ExternalLink, Globe, Compass } from 'lucide-react';

interface ProjectInspectModalProps {
  project: Project | null;
  onClose: () => void;
  onStudyObject?: (project: Project) => void;
}

export const ProjectInspectModal: React.FC<ProjectInspectModalProps> = ({
  project,
  onClose,
  onStudyObject,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [metalness, setMetalness] = useState(0.4);
  const [roughness, setRoughness] = useState(0.2);

  const speedRef = useRef(speed);
  const wireframeRef = useRef(wireframe);
  const metalnessRef = useRef(metalness);
  const roughnessRef = useRef(roughness);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    wireframeRef.current = wireframe;
  }, [wireframe]);
  useEffect(() => {
    metalnessRef.current = metalness;
  }, [metalness]);
  useEffect(() => {
    roughnessRef.current = roughness;
  }, [roughness]);

  useEffect(() => {
    if (!project) return;
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(4, 5, 5);
    scene.add(dirLight);

    const pLight1 = new THREE.PointLight(project.color, 4, 20);
    pLight1.position.set(3, 3, 3);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x38bdf8, 2.5, 20);
    pLight2.position.set(-3, -3, 3);
    scene.add(pLight2);

    // Particle dust field in modal
    const pGeo = new THREE.BufferGeometry();
    const pCount = 300;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    scene.add(pMesh);

    let geo: THREE.BufferGeometry;
    switch (project.geometryType) {
      case 'torusKnot':
        geo = new THREE.TorusKnotGeometry(1.1, 0.35, 128, 32);
        break;
      case 'icosahedron':
        geo = new THREE.IcosahedronGeometry(1.6, 1);
        break;
      case 'cyberSphere':
        geo = new THREE.SphereGeometry(1.5, 32, 32);
        break;
      case 'octahedron':
        geo = new THREE.OctahedronGeometry(1.6, 1);
        break;
      case 'dodecahedron':
        geo = new THREE.DodecahedronGeometry(1.5, 0);
        break;
      case 'ringMatrix':
        geo = new THREE.TorusGeometry(1.5, 0.25, 24, 70);
        break;
      default:
        geo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: project.color,
      emissive: project.color,
      emissiveIntensity: 0.3,
      metalness: metalnessRef.current,
      roughness: roughnessRef.current,
      wireframe: wireframeRef.current,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Orbital ring
    const ringGeo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Drag-to-rotate interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0;
    let rotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      rotY += dx * 0.01;
      rotX += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      mat.wireframe = wireframeRef.current;
      mat.roughness = roughnessRef.current;
      mat.metalness = metalnessRef.current;

      if (!isDragging) {
        mesh.rotation.y += delta * 0.5 * speedRef.current;
        mesh.rotation.x += delta * 0.2 * speedRef.current;
      } else {
        mesh.rotation.y = rotY;
        mesh.rotation.x = rotX;
      }

      ring.rotation.z += delta * 0.15;
      pMesh.rotation.y += delta * 0.05;

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
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: 3D Viewport */}
        <div className="relative w-full md:w-3/5 h-72 md:h-auto min-h-[340px] bg-neutral-950 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          <div className="absolute bottom-3 left-3 text-[11px] font-mono-code text-neutral-400 bg-neutral-900/70 backdrop-blur px-2.5 py-1 rounded-lg border border-neutral-800/80 pointer-events-none flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-indigo-400" />
            <span>Click & Drag to Rotate</span>
          </div>
        </div>

        {/* Right: Technical Inspector & Study Controls */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono-code font-bold uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {project.category}
                </span>
                <span className="text-xs text-neutral-400 font-mono-code">{project.year}</span>
              </div>
              <h2 className="text-xl font-bold font-display text-white">{project.title}</h2>
              <p className="text-xs font-mono-code text-neutral-400 mt-0.5">{project.subtitle}</p>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">{project.description}</p>

            {/* Study Topology Callout Button */}
            {project.studyData && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 via-neutral-900/60 to-neutral-900/80 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-code font-bold text-indigo-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    {project.studyData.geometricName}
                  </span>
                  <span className="text-[10px] font-mono-code text-neutral-400">
                    {project.studyData.facesCount} Faces
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 line-clamp-2">
                  {project.studyData.overview}
                </p>
                {onStudyObject && (
                  <button
                    onClick={() => {
                      onClose();
                      onStudyObject(project);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Study Mathematics & Scientific Articles</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                  </button>
                )}
              </div>
            )}

            {/* Interactive Shader Controls */}
            <div className="space-y-3 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-mono-code text-neutral-300 font-bold border-b border-neutral-800/80 pb-2">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>3D Shader Parameters</span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono-code text-neutral-400 mb-1">
                  <span>Rotation Speed</span>
                  <span>{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.2"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono-code text-neutral-400 mb-1">
                  <span>Roughness</span>
                  <span>{roughness}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code transition-colors ${
                    wireframe ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Wireframe: {wireframe ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => {
                    setSpeed(1);
                    setWireframe(false);
                    setRoughness(0.2);
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                  title="Reset 3D Shader"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition-colors shadow-lg shadow-indigo-600/25"
            >
              Close 3D Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
