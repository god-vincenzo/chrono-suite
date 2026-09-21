import React from 'react';
import { UserProfile } from '../../types';
import { Compass, Heart, Globe, Bell, Timer, Layers, ShieldCheck } from 'lucide-react';

interface FooterProps {
  profile: UserProfile;
  onNavigate: (sectionId: string) => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onNavigate, onOpenSettings }) => {
  return (
    <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-900">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-neutral-800"
            />
            <div>
              <div className="font-bold text-sm text-white font-display">{profile.name}</div>
              <div className="text-[11px] font-mono-code text-neutral-500">{profile.role}</div>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono-code">
            <button onClick={() => onNavigate('hero')} className="hover:text-white transition-colors">
              3D Core
            </button>
            <button onClick={() => onNavigate('projects')} className="hover:text-white transition-colors">
              Works & 3D Models
            </button>
            <button onClick={() => onNavigate('chrono-suite')} className="hover:text-white transition-colors">
              World Clock & Stopwatch
            </button>
            <button onClick={() => onNavigate('experience')} className="hover:text-white transition-colors">
              Experience
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Contact
            </button>
            <button onClick={onOpenSettings} className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Personalized Settings
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hardware Accelerated • 5-Harmonic Synth • UTC Synchronized</span>
          </div>

          <div>
            <span>Aura3D Spatial Suite • All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
