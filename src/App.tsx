import React, { useState, useEffect } from 'react';
import { UserProfile, Project, AlarmItem, AuthUser } from './types';
import { INITIAL_USER_PROFILE } from './data/portfolioData';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/portfolio/HeroSection';
import { ProjectsSection } from './components/portfolio/ProjectsSection';
import { ChronoSuiteContainer } from './components/chrono/ChronoSuiteContainer';
import { SkillsAndExperience } from './components/portfolio/SkillsAndExperience';
import { ContactSection } from './components/portfolio/ContactSection';
import { Footer } from './components/layout/Footer';
import { ProjectInspectModal } from './components/three/ProjectInspectModal';
import { StudyGeometryModal } from './components/three/StudyGeometryModal';
import { ProfileSettingsModal } from './components/profile/ProfileSettingsModal';
import { GoogleAuthGateModal } from './components/auth/GoogleAuthGateModal';

export default function App() {
  // Google Auth Session State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('aura_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aura_auth_session');
      return !saved; // If no session, gate the website immediately
    } catch {
      return true;
    }
  });

  // User Profile State - Synchronized from Google Sign In or stored preferences
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('aura_user_profile');
      const savedSession = localStorage.getItem('aura_auth_session');

      let base = INITIAL_USER_PROFILE;
      if (savedProfile) {
        base = { ...base, ...JSON.parse(savedProfile) };
      }
      if (savedSession) {
        const session: AuthUser = JSON.parse(savedSession);
        base = {
          ...base,
          name: session.name,
          email: session.email,
          avatar: session.avatar,
          handle: `@${session.email.split('@')[0]}`,
          isGoogleAuth: true,
        };
      }
      return base;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [inspectProject, setInspectProject] = useState<Project | null>(null);
  const [studyProject, setStudyProject] = useState<Project | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeAlarmsCount, setActiveAlarmsCount] = useState<number>(0);

  // Read active alarms count periodically
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('aura_alarms');
        if (saved) {
          const parsed: AlarmItem[] = JSON.parse(saved);
          setActiveAlarmsCount(parsed.filter((a) => a.enabled).length);
        } else {
          setActiveAlarmsCount(2); // default enabled
        }
      } catch {
        setActiveAlarmsCount(0);
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthenticated = (user: AuthUser) => {
    setAuthUser(user);
    setIsAuthModalOpen(false);

    // Synchronize Google Account Data directly into the User Profile
    setProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        handle: `@${user.email.split('@')[0]}`,
        isGoogleAuth: true,
      };
      try {
        localStorage.setItem('aura_user_profile', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('aura_auth_session');
    } catch {
      // ignore
    }
    setAuthUser(null);
    setIsAuthModalOpen(true); // Lock the page with Google Sign In box again
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem('aura_user_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResetProfile = () => {
    setProfile(INITIAL_USER_PROFILE);
    try {
      localStorage.removeItem('aura_user_profile');
    } catch {
      // ignore
    }
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white relative">
      {/* Top Floating Navbar */}
      <Navbar
        profile={profile}
        authUser={authUser}
        activeAlarmsCount={activeAlarmsCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigateSection={handleNavigate}
        onOpenSignIn={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        {/* 3D Hero Section with Big Centered Title & Interactive 3D Background */}
        <HeroSection
          profile={profile}
          onExploreWorks={() => handleNavigate('projects')}
          onOpenChrono={() => handleNavigate('chrono-suite')}
        />

        {/* 3D Works & Interactive Meshes */}
        <ProjectsSection onOpenProjectDemo={(p) => setInspectProject(p)} />

        {/* Global Chrono Suite (World Clock of every region, Stopwatch, Alarms with 5 ringtones) */}
        <ChronoSuiteContainer
          profile={profile}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Skills Constellation & Career Milestones */}
        <SkillsAndExperience />

        {/* Contact Transmission */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Mandatory Google Sign In & Security Gate Modal */}
      <GoogleAuthGateModal
        isOpen={isAuthModalOpen || !authUser}
        onAuthenticated={handleAuthenticated}
      />

      {/* 3D Project Inspector Sandbox Modal */}
      <ProjectInspectModal
        project={inspectProject}
        onClose={() => setInspectProject(null)}
        onStudyObject={(p) => {
          setInspectProject(null);
          setStudyProject(p);
        }}
      />

      {/* 3D Object Study & Topology Reference Modal */}
      <StudyGeometryModal
        project={studyProject}
        isOpen={!!studyProject}
        onClose={() => setStudyProject(null)}
        onOpenInspector={(p) => {
          setStudyProject(null);
          setInspectProject(p);
        }}
      />

      {/* Personalized Profile Settings Modal (Synced with Google Sign In) */}
      <ProfileSettingsModal
        profile={profile}
        authUser={authUser}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveProfile={handleSaveProfile}
        onResetProfile={handleResetProfile}
        onTriggerGoogleSignIn={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
