import React, { useState, useEffect } from 'react';
import { AlarmItem, TimeFormat, RingtoneDefinition } from '../../types';
import { AVAILABLE_RINGTONES, previewRingtone, startAlarmSound, stopActiveAlarm } from '../../utils/audioSynthesizer';
import { Bell, Plus, Trash2, Volume2, Play, Square, Clock, Calendar, Check, AlertCircle } from 'lucide-react';

interface AlarmSectionProps {
  timeFormat: TimeFormat;
  defaultRingtone: string;
  volume: number;
}

const DEFAULT_ALARMS: AlarmItem[] = [
  {
    id: 'alarm-1',
    time: '07:30',
    label: 'Morning Focus & Meditation',
    enabled: true,
    ringtone: 'zen_bell',
    days: [1, 2, 3, 4, 5], // Mon-Fri
    createdDate: '2026-09-20',
  },
  {
    id: 'alarm-2',
    time: '14:00',
    label: 'Tokyo Market & Standup Sync',
    enabled: false,
    ringtone: 'cosmic_pulse',
    days: [1, 2, 3, 4, 5],
    createdDate: '2026-09-20',
  },
  {
    id: 'alarm-3',
    time: '21:45',
    label: 'Review 3D Render Shaders',
    enabled: true,
    ringtone: 'digital_chime',
    days: [], // Once
    createdDate: '2026-09-20',
  },
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmSection: React.FC<AlarmSectionProps> = ({ timeFormat, defaultRingtone, volume }) => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_alarms');
      return saved ? JSON.parse(saved) : DEFAULT_ALARMS;
    } catch {
      return DEFAULT_ALARMS;
    }
  });

  const [isAddingAlarm, setIsAddingAlarm] = useState(false);
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);

  // Form State
  const [newTime, setNewTime] = useState('08:00');
  const [newLabel, setNewLabel] = useState('');
  const [newRingtone, setNewRingtone] = useState(defaultRingtone);
  const [newDays, setNewDays] = useState<number[]>([]);

  // Active Ringing Alarm State
  const [ringingAlarm, setRingingAlarm] = useState<AlarmItem | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_alarms', JSON.stringify(alarms));
    } catch {
      // ignore
    }
  }, [alarms]);

  // Monitor Clock for Alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentSeconds = now.getSeconds();
      const currentDay = now.getDay();
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      // Check once at second 0
      if (currentSeconds === 0 && !ringingAlarm) {
        for (const alarm of alarms) {
          if (!alarm.enabled) continue;

          // Check snooze
          if (alarm.snoozedUntil && now.getTime() < alarm.snoozedUntil) {
            continue;
          }

          // Check day match (if days array is empty, it runs once on any day)
          const matchesDay = alarm.days.length === 0 || alarm.days.includes(currentDay);

          if (alarm.time === currentTimeString && matchesDay) {
            triggerAlarm(alarm);
            break;
          }
        }
      }
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);

  const triggerAlarm = (alarm: AlarmItem) => {
    setRingingAlarm(alarm);
    startAlarmSound(alarm.ringtone, volume);
  };

  const handleDismissRinging = () => {
    stopActiveAlarm();
    if (ringingAlarm) {
      // If it was a one-time alarm, disable it
      if (ringingAlarm.days.length === 0) {
        setAlarms((prev) =>
          prev.map((a) => (a.id === ringingAlarm.id ? { ...a, enabled: false, snoozedUntil: null } : a))
        );
      } else {
        setAlarms((prev) =>
          prev.map((a) => (a.id === ringingAlarm.id ? { ...a, snoozedUntil: null } : a))
        );
      }
    }
    setRingingAlarm(null);
  };

  const handleSnooze = (minutes = 5) => {
    stopActiveAlarm();
    if (ringingAlarm) {
      const snoozeUntilTime = Date.now() + minutes * 60 * 1000;
      setAlarms((prev) =>
        prev.map((a) => (a.id === ringingAlarm.id ? { ...a, snoozedUntil: snoozeUntilTime } : a))
      );
    }
    setRingingAlarm(null);
  };

  const toggleAlarmEnabled = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled, snoozedUntil: null } : a))
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePreviewRingtone = (toneId: string) => {
    if (playingPreviewId === toneId) {
      stopActiveAlarm();
      setPlayingPreviewId(null);
    } else {
      setPlayingPreviewId(toneId);
      previewRingtone(toneId, volume);
      setTimeout(() => {
        setPlayingPreviewId((current) => (current === toneId ? null : current));
      }, 2000);
    }
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlarmItem: AlarmItem = {
      id: `alarm-${Date.now()}`,
      time: newTime,
      label: newLabel.trim() || 'Scheduled Alarm',
      enabled: true,
      ringtone: newRingtone,
      days: newDays,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setAlarms((prev) => [newAlarmItem, ...prev]);
    setIsAddingAlarm(false);
    setNewLabel('');
    setNewDays([]);
    stopActiveAlarm();
    setPlayingPreviewId(null);
  };

  const toggleDaySelection = (dayIndex: number) => {
    setNewDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const formatDisplayTime = (time24: string) => {
    if (timeFormat === '24h') return time24;
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div id="alarm" className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Chrono Audio Dispatcher</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">Alarm Manager</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Set custom regional schedule alerts with 5 synthesizer ringtones tuned to harmonic frequencies.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddingAlarm(true);
            setNewRingtone(defaultRingtone);
          }}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Alarm</span>
        </button>
      </div>

      {/* Alarms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alarms.map((alarm) => {
          const ringtoneObj = AVAILABLE_RINGTONES.find((r) => r.id === alarm.ringtone) || AVAILABLE_RINGTONES[0];
          const isPreviewing = playingPreviewId === alarm.ringtone;

          return (
            <div
              key={alarm.id}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                alarm.enabled
                  ? 'bg-neutral-900/80 border-neutral-800 shadow-xl'
                  : 'bg-neutral-950/50 border-neutral-900 opacity-60'
              }`}
            >
              <div>
                {/* Top Row: Label & Toggle */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="font-medium text-sm text-white truncate max-w-[180px]">
                    {alarm.label}
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleAlarmEnabled(alarm.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      alarm.enabled ? 'bg-indigo-600' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        alarm.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Big Time Display */}
                <div className="text-3xl font-extrabold font-mono-code text-white mb-3">
                  {formatDisplayTime(alarm.time)}
                </div>

                {/* Days of Week */}
                <div className="flex items-center gap-1 mb-4">
                  {DAYS_SHORT.map((day, idx) => {
                    const isSelected = alarm.days.includes(idx);
                    return (
                      <span
                        key={day}
                        className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                            : 'text-neutral-600'
                        }`}
                      >
                        {day[0]}
                      </span>
                    );
                  })}
                  {alarm.days.length === 0 && (
                    <span className="text-[11px] font-mono-code text-neutral-400">Once</span>
                  )}
                </div>
              </div>

              {/* Bottom Row: Ringtone Badge with audio preview & Delete */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  onClick={() => handlePreviewRingtone(alarm.ringtone)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-xs font-mono-code text-neutral-300 transition-colors"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPreviewing ? 'text-indigo-400 animate-pulse' : 'text-neutral-400'}`} />
                  <span>{ringtoneObj.name}</span>
                  {isPreviewing ? <Square className="w-2.5 h-2.5 text-indigo-400 fill-indigo-400" /> : <Play className="w-2.5 h-2.5 text-neutral-400" />}
                </button>

                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  title="Delete alarm"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ringtones Showcase Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-neutral-900 to-indigo-950/40 border border-neutral-800 p-6">
        <div className="flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase mb-1">
          <Volume2 className="w-4 h-4" />
          <span>Synthesizer Audio Engine (5 Ringtones)</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-2">Selectable Harmonic Melodies</h3>
        <p className="text-xs text-neutral-400 mb-4 max-w-2xl">
          Harmonically tuned synthesized frequencies. Pure acoustic waveforms calibrated for alertness without sensory fatigue.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {AVAILABLE_RINGTONES.map((tone) => {
            const isPlaying = playingPreviewId === tone.id;
            return (
              <div
                key={tone.id}
                onClick={() => handlePreviewRingtone(tone.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {tone.genre}
                    </span>
                    <button
                      className={`p-1 rounded-full ${
                        isPlaying ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {isPlaying ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-neutral-400" />}
                    </button>
                  </div>
                  <div className="font-bold text-sm text-white">{tone.name}</div>
                  <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{tone.description}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800/60 text-[10px] font-mono-code text-indigo-300">
                  {isPlaying ? 'Playing Waveform...' : 'Tap to audition'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Alarm Modal */}
      {isAddingAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span>Configure New Alarm</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddingAlarm(false);
                  stopActiveAlarm();
                  setPlayingPreviewId(null);
                }}
                className="text-neutral-400 hover:text-white text-xs font-mono-code"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateAlarm} className="space-y-4">
              {/* Time Picker */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-1">Time (24h format)</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-2xl font-mono-code font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-1">Alarm Label</label>
                <input
                  type="text"
                  placeholder="e.g., Global Meeting, Render Complete"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Days selection */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-1.5">Repeat Days</label>
                <div className="flex items-center justify-between gap-1">
                  {DAYS_SHORT.map((day, idx) => {
                    const isSelected = newDays.includes(idx);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDaySelection(idx)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono-code font-medium transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'
                        }`}
                      >
                        {day[0]}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] font-mono-code text-neutral-500 mt-1">
                  {newDays.length === 0 ? 'Will trigger once' : `${newDays.length} days selected`}
                </div>
              </div>

              {/* Ringtone Selection */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-1.5">Harmonic Ringtone</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_RINGTONES.map((tone) => {
                    const isSelected = newRingtone === tone.id;
                    const isPlaying = playingPreviewId === tone.id;

                    return (
                      <div
                        key={tone.id}
                        onClick={() => setNewRingtone(tone.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white'
                            : 'bg-neutral-950 border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                              isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-neutral-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{tone.name}</div>
                            <div className="text-[10px] text-neutral-400">{tone.genre}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewRingtone(tone.id);
                          }}
                          className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                          title="Preview Ringtone"
                        >
                          {isPlaying ? <Square className="w-3 h-3 text-indigo-400" /> : <Play className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save */}
              <div className="pt-3 border-t border-neutral-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAlarm(false);
                    stopActiveAlarm();
                    setPlayingPreviewId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono-code text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Save Alarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ringing Alarm Modal Overlay */}
      {ringingAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-neutral-900 to-indigo-950 border-2 border-indigo-500/60 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-pulse">
            <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center animate-bounce">
              <Bell className="w-10 h-10 text-indigo-400" />
            </div>

            <div>
              <div className="text-xs font-mono-code text-indigo-300 uppercase tracking-widest mb-1">
                ALARM TRIGGERED
              </div>
              <div className="text-5xl font-extrabold font-mono-code text-white">
                {formatDisplayTime(ringingAlarm.time)}
              </div>
              <p className="text-lg font-display font-medium text-neutral-200 mt-2">{ringingAlarm.label}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleSnooze(5)}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono-code text-xs font-semibold transition-colors"
              >
                Snooze 5 Min
              </button>

              <button
                onClick={handleDismissRinging}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-code text-xs font-bold transition-colors shadow-lg shadow-rose-600/40"
              >
                Dismiss / Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
