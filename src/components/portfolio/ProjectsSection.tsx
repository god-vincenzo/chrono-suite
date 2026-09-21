import React, { useState } from 'react';
import { Project } from '../../types';
import { PORTFOLIO_PROJECTS } from '../../data/portfolioData';
import { Project3DCard } from '../three/Project3DCard';
import { StudyGeometryModal } from '../three/StudyGeometryModal';
import { Layers, Sparkles, BookOpen } from 'lucide-react';

interface ProjectsSectionProps {
  onOpenProjectDemo: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenProjectDemo }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [studyingProject, setStudyingProject] = useState<Project | null>(null);

  const categories = ['All', 'Spatial & 3D', 'Systems', 'Full-Stack', 'Creative'];

  const filtered = selectedCategory === 'All'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="w-full py-20 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Interactive Portfolio Artifacts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Featured 3D Works & Systems
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Each card renders an interactive 3D viewport in real time. Inspect topologies, toggle wireframes, or select <span className="text-indigo-300 font-semibold inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 inline" /> Study Object</span> to explore mathematical formulas, real-world science applications, and curated research websites.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-code transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Project3DCard
              key={project.id}
              project={project}
              onOpenDemo={onOpenProjectDemo}
              onStudyObject={setStudyingProject}
            />
          ))}
        </div>
      </div>

      {/* Interactive Study & Research Modal */}
      <StudyGeometryModal
        project={studyingProject}
        isOpen={!!studyingProject}
        onClose={() => setStudyingProject(null)}
        onOpenInspector={onOpenProjectDemo}
      />
    </section>
  );
};
