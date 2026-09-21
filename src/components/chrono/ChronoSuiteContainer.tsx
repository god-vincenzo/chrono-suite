import React, { useState } from 'react';
import { UserProfile, TimeFormat } from '../../types';
import { WorldClockSection } from './WorldClockSection';
import { StopwatchSection } from './StopwatchSection';
import { AlarmSection } from './AlarmSection';
import { Globe, Timer, Bell, Sliders } from 'lucide-react';

interface ChronoSuiteContainerProps {
  profile: UserProfile;
  onOpenSettings: () => void;
}

export const ChronoSuiteContainer: React.FC<ChronoSuiteContainerProps> = ({ profile, onOpenSettings }) => {
  const [activeTool, setActiveTool] = useState<'worldClock' | 'stopwatch' | 'alarm'>('worldClock');

  return (
    <section id="chrono-suite" className="w-full py-20 border-t border-neutral-900 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Navigation Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTool('worldClock')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono-code font-bold transition-all whitespace-nowrap ${
                activeTool === 'worldClock'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>World Clocks (Every Region)</span>
            </button>

            <button
              onClick={() => setActiveTool('stopwatch')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono-code font-bold transition-all whitespace-nowrap ${
                activeTool === 'stopwatch'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>Precision Stopwatch</span>
            </button>

            <button
              onClick={() => setActiveTool('alarm')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono-code font-bold transition-all whitespace-nowrap ${
                activeTool === 'alarm'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alarm Feature (5 Ringtones)</span>
            </button>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono-code transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Profile Audio & Time Settings</span>
          </button>
        </div>

        {/* Dynamic Tool Display */}
        <div className="transition-all duration-300">
          {activeTool === 'worldClock' && <WorldClockSection timeFormat={profile.timeFormat} />}
          {activeTool === 'stopwatch' && (
            <StopwatchSection soundEnabled={profile.soundEnabled} volume={profile.volume} />
          )}
          {activeTool === 'alarm' && (
            <AlarmSection
              timeFormat={profile.timeFormat}
              defaultRingtone={profile.defaultRingtone}
              volume={profile.volume}
            />
          )}
        </div>
      </div>
    </section>
  );
};
