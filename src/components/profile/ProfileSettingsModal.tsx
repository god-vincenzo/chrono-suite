import React, { useState, useEffect } from 'react';
import { UserProfile, AccentColor, TimeFormat, AuthUser } from '../../types';
import { AVAILABLE_RINGTONES, previewRingtone, stopActiveAlarm } from '../../utils/audioSynthesizer';
import { AVATAR_OPTIONS } from '../../data/portfolioData';
import { WORLD_CITIES } from '../../data/worldCities';
import { GoogleLogoIcon } from '../auth/GoogleAuthGateModal';
import {
  User,
  Settings,
  X,
  Volume2,
  Bell,
  Clock,
  Palette,
  Check,
  Play,
  Square,
  Globe,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

interface ProfileSettingsModalProps {
  profile: UserProfile;
  authUser?: AuthUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
  onResetProfile: () => void;
  onTriggerGoogleSignIn?: () => void;
  onSignOut?: () => void;
}

const ACCENT_OPTIONS: { id: AccentColor; label: string; bgClass: string; hex: string }[] = [
  { id: 'indigo', label: 'Hyper Indigo', bgClass: 'bg-indigo-500', hex: '#818cf8' },
  { id: 'cyan', label: 'Quantum Cyan', bgClass: 'bg-sky-400', hex: '#38bdf8' },
  { id: 'emerald', label: 'Bio Emerald', bgClass: 'bg-emerald-400', hex: '#34d399' },
  { id: 'rose', label: 'Solar Rose', bgClass: 'bg-rose-500', hex: '#f43f5e' },
  { id: 'amber', label: 'Apex Amber', bgClass: 'bg-amber-400', hex: '#fbbf24' },
];

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  profile,
  authUser,
  isOpen,
  onClose,
  onSaveProfile,
  onResetProfile,
  onTriggerGoogleSignIn,
  onSignOut,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);
  const [playingTone, setPlayingTone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'chrono' | 'appearance'>('chrono');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestRingtone = (toneId: string) => {
    if (playingTone === toneId) {
      stopActiveAlarm();
      setPlayingTone(null);
    } else {
      setPlayingTone(toneId);
      previewRingtone(toneId, formData.volume);
      setTimeout(() => {
        setPlayingTone((curr) => (curr === toneId ? null : curr));
      }, 2200);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    stopActiveAlarm();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Personalized Profile & Chrono Settings</h2>
              <p className="text-xs text-neutral-400 font-mono-code">
                Configure your personalized portfolio identity, regional time defaults, and alarm ringtones.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopActiveAlarm();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-neutral-800/80 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('chrono')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-mono-code font-semibold border-b-2 transition-all ${
              activeTab === 'chrono'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alarms & Audio Ringtones</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-mono-code font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Identity & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-mono-code font-semibold border-b-2 transition-all ${
              activeTab === 'appearance'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>3D Accent & Timezone</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: ALARMS & AUDIO RINGTONES */}
          {activeTab === 'chrono' && (
            <div className="space-y-6">
              {/* Default Ringtone Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono-code font-bold text-neutral-200 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Default Alarm Ringtone (5 Harmonic Presets)</span>
                  </label>
                  <span className="text-[11px] font-mono-code text-indigo-400">Harmonic Synthesizer</span>
                </div>
                <p className="text-xs text-neutral-400 mb-3">
                  Select the default synthesized ringtone played whenever an alarm triggers across your regional clocks.
                </p>

                <div className="space-y-2">
                  {AVAILABLE_RINGTONES.map((tone) => {
                    const isSelected = formData.defaultRingtone === tone.id;
                    const isPlaying = playingTone === tone.id;

                    return (
                      <div
                        key={tone.id}
                        onClick={() => setFormData({ ...formData, defaultRingtone: tone.id })}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                              isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-neutral-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{tone.name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-neutral-800 text-neutral-300">
                                {tone.genre}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-indigo-500/20 text-indigo-300">
                                {tone.badge}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5">{tone.description}</p>
                          </div>
                        </div>

                        {/* Audition / Test Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestRingtone(tone.id);
                          }}
                          className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono-code ${
                            isPlaying
                              ? 'bg-indigo-600 text-white'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                          }`}
                        >
                          {isPlaying ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3" />}
                          <span>{isPlaying ? 'Playing' : 'Audition'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Master Volume Slider */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-neutral-300 font-bold flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Alarm & Sound FX Volume</span>
                  </span>
                  <span className="text-indigo-400 font-bold">{Math.round(formData.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Time Format */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono-code font-bold text-neutral-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Time Display Format</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Toggle between 12-Hour AM/PM and 24-Hour International notation</div>
                </div>

                <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, timeFormat: '12h' })}
                    className={`px-3 py-1 rounded-lg text-xs font-mono-code font-semibold transition-all ${
                      formData.timeFormat === '12h' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    12-Hour
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, timeFormat: '24h' })}
                    className={`px-3 py-1 rounded-lg text-xs font-mono-code font-semibold transition-all ${
                      formData.timeFormat === '24h' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    24-Hour
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITY & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Google Account Security & Sync Enclave */}
              <div className="p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      <GoogleLogoIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">Google Identity Enclave</span>
                        {(formData.isGoogleAuth || authUser) && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-code flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Connected
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono-code">
                        {formData.email || authUser?.email || 'No Google account linked'}
                      </div>
                    </div>
                  </div>

                  {formData.isGoogleAuth || authUser ? (
                    onSignOut && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSignOut();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-mono-code flex items-center gap-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )
                  ) : (
                    onTriggerGoogleSignIn && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onTriggerGoogleSignIn();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                      >
                        <GoogleLogoIcon className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </button>
                    )
                  )}
                </div>

                <div className="text-[11px] font-mono-code text-neutral-400 border-t border-neutral-800/80 pt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                  <span>Your profile name, email, and avatar are synced from your authenticated Google session.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-neutral-400 mb-1">Handle / Username</label>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-neutral-400 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-1">Bio / Mission Statement</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-2">Select Aesthetic Avatar</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_OPTIONS.map((av) => (
                    <div
                      key={av.id}
                      onClick={() => setFormData({ ...formData, avatar: av.url })}
                      className={`p-2 rounded-xl border cursor-pointer flex flex-col items-center gap-2 transition-all ${
                        formData.avatar === av.url
                          ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-14 h-14 rounded-full object-cover" />
                      <span className="text-[11px] font-mono-code text-neutral-300 text-center">{av.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE & TIMEZONE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Accent Color Picker */}
              <div>
                <label className="block text-xs font-mono-code font-bold text-neutral-200 mb-1">
                  3D Lighting & Interface Accent
                </label>
                <p className="text-xs text-neutral-400 mb-3">
                  Dynamically shifts the 3D scene point lights, particle glow, and interface accents.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {ACCENT_OPTIONS.map((acc) => {
                    const isSelected = formData.accentColor === acc.id;
                    return (
                      <button
                        type="button"
                        key={acc.id}
                        onClick={() => setFormData({ ...formData, accentColor: acc.id })}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? 'border-white/40 bg-neutral-800 ring-2 ring-white/20'
                            : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-900'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${acc.bgClass} shadow-md`} />
                        <span className="text-[11px] font-mono-code text-white">{acc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Default Primary Timezone */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Default Primary Region Timezone</span>
                </label>
                <select
                  value={formData.defaultTimezone}
                  onChange={(e) => setFormData({ ...formData, defaultTimezone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono-code"
                >
                  {WORLD_CITIES.map((c) => (
                    <option key={c.timezone} value={c.timezone}>
                      {c.flag} {c.city}, {c.country} ({c.timezone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sound FX Toggle */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono-code font-bold text-neutral-200">Interactive Sound Effects</div>
                  <div className="text-xs text-neutral-400">Play subtle acoustic feedback on stopwatch laps & buttons</div>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, soundEnabled: !formData.soundEnabled })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    formData.soundEnabled ? 'bg-indigo-600' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${
                      formData.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onResetProfile();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-mono-code hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopActiveAlarm();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono-code transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
