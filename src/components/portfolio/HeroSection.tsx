import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Hero3DBackgroundCanvas, HeroGeometryType } from '../three/Hero3DBackgroundCanvas';
import { motion } from 'motion/react';
import {
  ArrowDown,
  Layers,
  Clock,
  Sparkles,
  ChevronRight,
  Box,
  Eye,
} from 'lucide-react';

interface HeroSectionProps {
  profile: UserProfile;
  onExploreWorks: () => void;
  onOpenChrono: () => void;
}

const SHAPE_OPTIONS: { id: HeroGeometryType; label: string }[] = [
  { id: 'torusKnot', label: 'Torus Knot' },
  { id: 'cyberSphere', label: 'Cyber Sphere' },
  { id: 'icosahedron', label: 'Icosahedron' },
  { id: 'dodecahedron', label: 'Dodecahedron' },
  { id: 'octahedron', label: 'Octahedron' },
  { id: 'ringMatrix', label: 'Ring Matrix' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onExploreWorks, onOpenChrono }) => {
  const [activeShape, setActiveShape] = useState<HeroGeometryType>('torusKnot');
  const [wireframe, setWireframe] = useState<boolean>(false);

  return (
    <section id="hero" className="relative w-full min-h-screen pt-28 pb-20 flex flex-col justify-center items-center overflow-hidden">
      {/* 3D Interactive Background Canvas */}
      <Hero3DBackgroundCanvas
        accentColor={profile.accentColor}
        activeShape={activeShape}
        wireframe={wireframe}
      />

      {/* Atmospheric Radial Gradients for Contrast & Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-transparent to-neutral-950 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Centered Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center relative z-10 space-y-7">
        {/* Big Centered 3D Display Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-white leading-[1.02] drop-shadow-2xl">
            SCULPTING SPACE
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-400 drop-shadow-[0_12px_45px_rgba(99,102,241,0.5)]">
              SYNCHRONIZING TIME
            </span>
          </h1>
        </motion.div>

        {/* Interactive 3D Shape Switcher Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl shadow-xl max-w-xl"
        >
          <span className="px-3 py-1 text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 border-r border-neutral-800">
            <Box className="w-3.5 h-3.5 text-indigo-400" />
            <span>3D Mesh:</span>
          </span>

          <div className="flex flex-wrap items-center gap-1">
            {SHAPE_OPTIONS.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setActiveShape(shape.id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono-code font-medium transition-all ${
                  activeShape === shape.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {shape.label}
              </button>
            ))}

            <button
              onClick={() => setWireframe(!wireframe)}
              title="Toggle 3D Wireframe Cage"
              className={`px-2.5 py-1 rounded-xl text-xs font-mono-code transition-all flex items-center gap-1 ml-1 ${
                wireframe
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{wireframe ? 'Wireframe On' : 'Solid'}</span>
            </button>
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
        >
          <button
            onClick={onExploreWorks}
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-mono-code text-sm font-semibold transition-all shadow-xl shadow-indigo-600/35 flex items-center gap-2.5 group"
          >
            <Layers className="w-4 h-4" />
            <span>Explore 3D Works</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenChrono}
            className="px-7 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-mono-code text-sm font-semibold transition-all backdrop-blur-md flex items-center gap-2.5 shadow-lg"
          >
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Launch Chrono Suite</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="w-full flex justify-center mt-12 relative z-10">
        <button
          onClick={onExploreWorks}
          className="flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <span className="text-[11px] font-mono-code tracking-wider">SCROLL TO DISCOVER</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
