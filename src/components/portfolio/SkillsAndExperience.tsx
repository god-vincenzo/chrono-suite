import React, { useState } from 'react';
import { SKILLS_LIST, CAREER_MILESTONES } from '../../data/portfolioData';
import { motion } from 'motion/react';
import { Sparkles, Briefcase, Award, CheckCircle2, Box, Cpu, Code2 } from 'lucide-react';

export const SkillsAndExperience: React.FC = () => {
  const [skillCategory, setSkillCategory] = useState<string>('All');

  const categories = ['All', '3D & Graphics', 'Core', 'Tools & Chrono', 'Eng & Architecture'];

  const filteredSkills = skillCategory === 'All'
    ? SKILLS_LIST
    : SKILLS_LIST.filter((s) => s.category === skillCategory);

  return (
    <section id="experience" className="w-full py-20 border-t border-neutral-900 bg-neutral-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Mastery & Engineering Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Skills & Career Trajectory
          </h2>
          <p className="text-sm text-neutral-400">
            Specialized in spatial pipelines, 3D mathematical simulations, and high-precision temporal computing architectures.
          </p>
        </div>

        {/* Skills Constellation Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Technical Constellation</span>
            </h3>

            {/* Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSkillCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-colors ${
                    skillCategory === cat
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{skill.name}</span>
                  <span className="text-xs font-mono-code text-indigo-400 font-bold">{skill.level}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-700"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <div className="mt-2 text-[10px] font-mono-code text-neutral-500 flex items-center justify-between">
                  <span>{skill.category}</span>
                  <span className="text-emerald-400">Production Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Timeline */}
        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Experience & Milestones</span>
          </h3>

          <div className="space-y-4">
            {CAREER_MILESTONES.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-1 md:max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {milestone.year}
                    </span>
                    <span className="text-sm font-bold font-mono-code text-neutral-300">
                      {milestone.company}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-display text-white">{milestone.role}</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed pt-1">{milestone.desc}</p>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-xs font-mono-code text-neutral-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Impact</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
