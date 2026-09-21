import React, { useState, useEffect } from 'react';
import { UserProfile, AuthUser } from '../../types';
import { formatCityTime } from '../../data/worldCities';
import { GoogleLogoIcon } from '../auth/GoogleAuthGateModal';
import {
  Clock,
  Bell,
  Settings,
  Menu,
  X,
  Compass,
  Layers,
  Globe,
  Timer,
  Send,
  Sparkles,
  LogOut,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  authUser: AuthUser | null;
  activeAlarmsCount: number;
  onOpenSettings: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  authUser,
  activeAlarmsCount,
  onOpenSettings,
  onNavigateSection,
  onOpenSignIn,
  onSignOut,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const localTimeData = formatCityTime(
    profile.defaultTimezone || 'America/New_York',
    profile.timeFormat === '12h',
    currentTime
  );

  const navItems = [
    { label: '3D Spatial Core', id: 'hero', icon: Compass },
    { label: 'Works & 3D Models', id: 'projects', icon: Layers },
    { label: 'World Clock', id: 'world-clock', icon: Globe },
    { label: 'Stopwatch', id: 'stopwatch', icon: Timer },
    { label: 'Alarms', id: 'alarm', icon: Bell },
    { label: 'Experience', id: 'experience', icon: Sparkles },
    { label: 'Contact', id: 'contact', icon: Send },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Profile Avatar */}
        <div
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover border border-neutral-700 ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all"
            />
            {profile.isGoogleAuth ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-neutral-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-950" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white font-display group-hover:text-indigo-300 transition-colors">
                {profile.name}
              </span>
              {profile.isGoogleAuth ? (
                <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              ) : (
                <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  3D
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono-code text-neutral-400 hidden sm:block truncate max-w-[180px]">
              {profile.email || profile.role}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-full px-4 py-1.5 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-neutral-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {/* Live Chrono Mini Indicator */}
          <div
            onClick={() => handleLinkClick('world-clock')}
            title="Click to open World Clock"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono-code cursor-pointer hover:border-neutral-700 transition-colors shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="font-bold text-white tracking-tight">
              {localTimeData.timeString}
              <span className="text-[10px] text-neutral-400 ml-0.5">:{localTimeData.secondsString}</span>
              {localTimeData.period && <span className="text-[10px] text-indigo-300 ml-1">{localTimeData.period}</span>}
            </span>

            {activeAlarmsCount > 0 && (
              <span className="flex items-center gap-1 pl-1.5 border-l border-neutral-800 text-[11px] text-amber-400" title={`${activeAlarmsCount} active alarm(s)`}>
                <Bell className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{activeAlarmsCount}</span>
              </span>
            )}
          </div>

          {/* Google Auth Status / Actions */}
          {authUser ? (
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-neutral-900/80 border border-emerald-500/30 text-xs font-mono-code">
              <GoogleLogoIcon className="w-3.5 h-3.5" />
              <span className="text-neutral-200 truncate max-w-[110px]" title={authUser.email}>
                {authUser.name.split(' ')[0]}
              </span>
              <button
                onClick={onSignOut}
                title="Sign Out of Google"
                className="p-1 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs transition-colors shadow-sm"
            >
              <GoogleLogoIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Personalized Profile & Chrono Settings"
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all shadow-sm flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-neutral-300" />
            <span className="hidden md:inline text-xs font-mono-code">Settings</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 bg-neutral-950/95 backdrop-blur-2xl border-b border-neutral-800 animate-in slide-in-from-top-4 space-y-2 mt-2">
          {/* User Auth Status on Mobile */}
          {authUser ? (
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <GoogleLogoIcon className="w-4 h-4" />
                <div>
                  <div className="text-xs font-bold text-white">{authUser.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono-code">{authUser.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono-code flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
              className="w-full py-2.5 rounded-xl bg-white text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 shadow mb-3"
            >
              <GoogleLogoIcon className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-mono-code text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
