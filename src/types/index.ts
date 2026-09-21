export type AccentColor = 'indigo' | 'cyan' | 'emerald' | 'rose' | 'amber';

export type TimeFormat = '12h' | '24h';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google';
  verified: boolean;
  accessToken: string;
  signedInAt: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  bio: string;
  avatar: string;
  email?: string;
  isGoogleAuth?: boolean;
  defaultRingtone: string;
  volume: number; // 0 to 1
  timeFormat: TimeFormat;
  accentColor: AccentColor;
  defaultTimezone: string;
  soundEnabled: boolean;
  haptics: boolean;
}

export interface AlarmItem {
  id: string;
  time: string; // "HH:MM" in 24h format
  label: string;
  enabled: boolean;
  ringtone: string;
  days: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday. Empty array = once
  snoozedUntil?: number | null; // timestamp
  createdDate: string;
}

export interface WorldCity {
  id: string;
  city: string;
  country: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Africa' | 'Middle East';
  timezone: string;
  flag: string;
  popular?: boolean;
  utcOffset: string;
  tag?: string;
}

export interface Lap {
  lapNumber: number;
  splitTimeMs: number;
  totalTimeMs: number;
  formattedSplit: string;
  formattedTotal: string;
  isFastest?: boolean;
  isSlowest?: boolean;
}

export interface StudyResource {
  title: string;
  url: string;
  source: string;
  description: string;
}

export interface GeometryStudyData {
  geometricName: string;
  classification: string;
  topologyFormula?: string;
  facesCount: number;
  verticesCount: number;
  edgesCount: number;
  symmetryGroup: string;
  overview: string;
  keyProperties: string[];
  realWorldApplications: string[];
  studyResources: StudyResource[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  category: 'Spatial & 3D' | 'Systems' | 'Full-Stack' | 'Creative';
  geometryType: 'torusKnot' | 'icosahedron' | 'cyberSphere' | 'octahedron' | 'dodecahedron' | 'ringMatrix';
  color: string;
  githubUrl?: string;
  demoUrl: string;
  year: string;
  metrics: { label: string; value: string }[];
  studyData?: GeometryStudyData;
}

export interface SkillItem {
  name: string;
  category: 'Core' | '3D & Graphics' | 'Eng & Architecture' | 'Tools & Chrono';
  level: number; // 0 - 100
  icon: string;
}

export interface RingtoneDefinition {
  id: string;
  name: string;
  description: string;
  genre: string;
  badge: string;
  color: string;
}
