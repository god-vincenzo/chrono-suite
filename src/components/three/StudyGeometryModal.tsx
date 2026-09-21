import React, { useState } from 'react';
import { Project } from '../../types';
import { X, BookOpen, ExternalLink, Compass, Atom, Layers, Sparkles, Check, Copy, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudyGeometryModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInspector?: (project: Project) => void;
}

export const StudyGeometryModal: React.FC<StudyGeometryModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenInspector,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen || !project || !project.studyData) return null;

  const { studyData } = project;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const eulerCharacteristic = studyData.verticesCount - studyData.edgesCount + studyData.facesCount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800/90 rounded-2xl shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative px-6 py-5 border-b border-neutral-800/80 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-950 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-inner shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${project.color}15`,
                  borderColor: `${project.color}40`,
                }}
              >
                <BookOpen className="w-5 h-5" style={{ color: project.color }} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 text-[10px] font-mono-code font-bold uppercase tracking-wider rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Geometric Topology & Science
                  </span>
                  <span className="text-xs text-neutral-400 font-mono-code">
                    {studyData.classification}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{studyData.geometricName}</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Featured in <span className="text-neutral-200 font-medium">{project.title}</span> • {project.year} Edition
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-neutral-300">
            {/* Topological Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-neutral-900/80 border border-neutral-800/80 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider block mb-1">
                  Faces (F)
                </span>
                <span className="text-lg font-bold font-mono-code text-white">
                  {studyData.facesCount}
                </span>
              </div>
              <div className="bg-neutral-900/80 border border-neutral-800/80 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider block mb-1">
                  Vertices (V)
                </span>
                <span className="text-lg font-bold font-mono-code text-white">
                  {studyData.verticesCount}
                </span>
              </div>
              <div className="bg-neutral-900/80 border border-neutral-800/80 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider block mb-1">
                  Edges (E)
                </span>
                <span className="text-lg font-bold font-mono-code text-white">
                  {studyData.edgesCount}
                </span>
              </div>
              <div className="bg-neutral-900/80 border border-neutral-800/80 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider block mb-1">
                  Euler Char (χ)
                </span>
                <span className="text-lg font-bold font-mono-code text-indigo-400">
                  {eulerCharacteristic === 0 ? '0 (Torus)' : `${eulerCharacteristic} (Sphere)`}
                </span>
              </div>
            </div>

            {/* Symmetry & Formula */}
            <div className="bg-neutral-900/60 border border-neutral-800/70 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider block">
                  Symmetry Group
                </span>
                <span className="text-sm font-semibold text-neutral-200 mt-0.5 block font-mono-code">
                  {studyData.symmetryGroup}
                </span>
              </div>
              {studyData.topologyFormula && (
                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-neutral-800 sm:pl-4 pt-2 sm:pt-0">
                  <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider block">
                    Parametric Formulation
                  </span>
                  <code className="text-xs font-mono-code text-amber-300/90 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20 mt-1 inline-block">
                    {studyData.topologyFormula}
                  </code>
                </div>
              )}
            </div>

            {/* Scientific Overview */}
            <div>
              <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                Mathematical & Topological Overview
              </h3>
              <div className="bg-neutral-900/40 border border-neutral-800/60 p-4 rounded-xl text-sm leading-relaxed text-neutral-200">
                {studyData.overview}
              </div>
            </div>

            {/* Key Properties & Real-World Science Applications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Key Properties */}
              <div className="bg-neutral-900/50 border border-neutral-800/70 p-4 rounded-xl space-y-2.5">
                <h4 className="text-xs font-mono-code uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 font-bold">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Key Geometric Properties
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {studyData.keyProperties.map((prop, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real World Applications */}
              <div className="bg-neutral-900/50 border border-neutral-800/70 p-4 rounded-xl space-y-2.5">
                <h4 className="text-xs font-mono-code uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 font-bold">
                  <Atom className="w-3.5 h-3.5 text-emerald-400" />
                  Real-World & Scientific Applications
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {studyData.realWorldApplications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verified Curated Websites & Learning Resources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 font-bold">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Study More: Verified Reference Websites & Articles
                </h3>
                <span className="text-[11px] font-mono-code text-neutral-500">
                  {studyData.studyResources.length} Reference Sources
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {studyData.studyResources.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800/90 hover:border-neutral-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {res.title}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono-code rounded bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                          {res.source}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {res.description}
                      </p>
                      <span className="text-[11px] font-mono-code text-neutral-500 truncate block">
                        {res.url}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleCopyLink(res.url)}
                        title="Copy study URL"
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs transition-colors"
                      >
                        {copiedLink === res.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all"
                      >
                        <span>Read Online</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/80 backdrop-blur flex items-center justify-between gap-3">
            {onOpenInspector ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenInspector(project);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono-code transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Launch Interactive 3D Inspector</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md"
            >
              Done Studying
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
