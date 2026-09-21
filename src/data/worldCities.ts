import { WorldCity } from '../types';

export const WORLD_CITIES: WorldCity[] = [
  // Americas
  {
    id: 'nyc',
    city: 'New York',
    country: 'United States',
    region: 'Americas',
    timezone: 'America/New_York',
    flag: '🇺🇸',
    popular: true,
    utcOffset: 'UTC-4 / -5',
    tag: 'Financial Capital',
  },
  {
    id: 'sfo',
    city: 'San Francisco',
    country: 'United States',
    region: 'Americas',
    timezone: 'America/Los_Angeles',
    flag: '🇺🇸',
    popular: true,
    utcOffset: 'UTC-7 / -8',
    tag: 'Silicon Valley',
  },
  {
    id: 'tor',
    city: 'Toronto',
    country: 'Canada',
    region: 'Americas',
    timezone: 'America/Toronto',
    flag: '🇨🇦',
    popular: false,
    utcOffset: 'UTC-4 / -5',
    tag: 'Innovation Hub',
  },
  {
    id: 'sao',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'Americas',
    timezone: 'America/Sao_Paulo',
    flag: '🇧🇷',
    popular: true,
    utcOffset: 'UTC-3',
    tag: 'South American Hub',
  },
  {
    id: 'mex',
    city: 'Mexico City',
    country: 'Mexico',
    region: 'Americas',
    timezone: 'America/Mexico_City',
    flag: '🇲🇽',
    popular: false,
    utcOffset: 'UTC-6',
    tag: 'Metropolis',
  },
  {
    id: 'bue',
    city: 'Buenos Aires',
    country: 'Argentina',
    region: 'Americas',
    timezone: 'America/Argentina/Buenos_Aires',
    flag: '🇦🇷',
    popular: false,
    utcOffset: 'UTC-3',
    tag: 'Pampa Capital',
  },

  // Europe
  {
    id: 'lon',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    timezone: 'Europe/London',
    flag: '🇬🇧',
    popular: true,
    utcOffset: 'UTC+0 / +1',
    tag: 'Greenwich Prime',
  },
  {
    id: 'par',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    timezone: 'Europe/Paris',
    flag: '🇫🇷',
    popular: true,
    utcOffset: 'UTC+1 / +2',
    tag: 'Central European',
  },
  {
    id: 'ber',
    city: 'Berlin',
    country: 'Germany',
    region: 'Europe',
    timezone: 'Europe/Berlin',
    flag: '🇩🇪',
    popular: true,
    utcOffset: 'UTC+1 / +2',
    tag: 'Tech & Design',
  },
  {
    id: 'ams',
    city: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    timezone: 'Europe/Amsterdam',
    flag: '🇳🇱',
    popular: false,
    utcOffset: 'UTC+1 / +2',
    tag: 'Digital Gateway',
  },
  {
    id: 'zur',
    city: 'Zurich',
    country: 'Switzerland',
    region: 'Europe',
    timezone: 'Europe/Zurich',
    flag: '🇨🇭',
    popular: false,
    utcOffset: 'UTC+1 / +2',
    tag: 'Fintech Precision',
  },
  {
    id: 'rom',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    timezone: 'Europe/Rome',
    flag: '🇮🇹',
    popular: false,
    utcOffset: 'UTC+1 / +2',
    tag: 'Historic Core',
  },

  // Asia-Pacific
  {
    id: 'tyo',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia-Pacific',
    timezone: 'Asia/Tokyo',
    flag: '🇯🇵',
    popular: true,
    utcOffset: 'UTC+9',
    tag: 'JST Metropolis',
  },
  {
    id: 'sin',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia-Pacific',
    timezone: 'Asia/Singapore',
    flag: '🇸🇬',
    popular: true,
    utcOffset: 'UTC+8',
    tag: 'Equatorial Gateway',
  },
  {
    id: 'seo',
    city: 'Seoul',
    country: 'South Korea',
    region: 'Asia-Pacific',
    timezone: 'Asia/Seoul',
    flag: '🇰🇷',
    popular: true,
    utcOffset: 'UTC+9',
    tag: 'Hyper-Tech',
  },
  {
    id: 'syd',
    city: 'Sydney',
    country: 'Australia',
    region: 'Asia-Pacific',
    timezone: 'Australia/Sydney',
    flag: '🇦🇺',
    popular: true,
    utcOffset: 'UTC+10 / +11',
    tag: 'Pacific Hub',
  },
  {
    id: 'hkg',
    city: 'Hong Kong',
    country: 'Hong Kong',
    region: 'Asia-Pacific',
    timezone: 'Asia/Hong_Kong',
    flag: '🇭🇰',
    popular: false,
    utcOffset: 'UTC+8',
    tag: 'Harbor Gateway',
  },
  {
    id: 'bom',
    city: 'Mumbai',
    country: 'India',
    region: 'Asia-Pacific',
    timezone: 'Asia/Kolkata',
    flag: '🇮🇳',
    popular: true,
    utcOffset: 'UTC+5:30',
    tag: 'IST Economic Hub',
  },
  {
    id: 'bkk',
    city: 'Bangkok',
    country: 'Thailand',
    region: 'Asia-Pacific',
    timezone: 'Asia/Bangkok',
    flag: '🇹🇭',
    popular: false,
    utcOffset: 'UTC+7',
    tag: 'Indochina Center',
  },
  {
    id: 'akl',
    city: 'Auckland',
    country: 'New Zealand',
    region: 'Asia-Pacific',
    timezone: 'Pacific/Auckland',
    flag: '🇳🇿',
    popular: false,
    utcOffset: 'UTC+12 / +13',
    tag: 'Dawn Vanguard',
  },

  // Middle East
  {
    id: 'dxb',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    timezone: 'Asia/Dubai',
    flag: '🇦🇪',
    popular: true,
    utcOffset: 'UTC+4',
    tag: 'Gulf Innovation',
  },
  {
    id: 'ruh',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    region: 'Middle East',
    timezone: 'Asia/Riyadh',
    flag: '🇸🇦',
    popular: false,
    utcOffset: 'UTC+3',
    tag: 'Vision Central',
  },
  {
    id: 'ist',
    city: 'Istanbul',
    country: 'Turkey',
    region: 'Middle East',
    timezone: 'Europe/Istanbul',
    flag: '🇹🇷',
    popular: false,
    utcOffset: 'UTC+3',
    tag: 'Crossroad of Continents',
  },

  // Africa
  {
    id: 'cai',
    city: 'Cairo',
    country: 'Egypt',
    region: 'Africa',
    timezone: 'Africa/Cairo',
    flag: '🇪🇬',
    popular: true,
    utcOffset: 'UTC+2 / +3',
    tag: 'Nile Cradle',
  },
  {
    id: 'jnb',
    city: 'Johannesburg',
    country: 'South Africa',
    region: 'Africa',
    timezone: 'Africa/Johannesburg',
    flag: '🇿🇦',
    popular: true,
    utcOffset: 'UTC+2',
    tag: 'Southern Point',
  },
  {
    id: 'los',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'Africa',
    timezone: 'Africa/Lagos',
    flag: '🇳🇬',
    popular: false,
    utcOffset: 'UTC+1',
    tag: 'West African Frontier',
  },
  {
    id: 'nbo',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'Africa',
    timezone: 'Africa/Nairobi',
    flag: '🇰🇪',
    popular: false,
    utcOffset: 'UTC+3',
    tag: 'Silicon Savannah',
  },
];

export interface FormattedTimeData {
  timeString: string;
  period: string; // AM/PM or blank for 24h
  dateString: string;
  secondsString: string;
  hours24: number;
  minutes: number;
  seconds: number;
  isDaytime: boolean;
  offsetDiffHours: number;
  offsetDiffText: string;
}

export function formatCityTime(timezone: string, format12h = true, baseDate = new Date()): FormattedTimeData {
  try {
    // Format in target timezone
    const timeParts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: format12h,
    }).formatToParts(baseDate);

    // Also get 24-hour hour for daylight determination
    const parts24 = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).formatToParts(baseDate);

    let hour = '00';
    let minute = '00';
    let second = '00';
    let period = '';

    timeParts.forEach((p) => {
      if (p.type === 'hour') hour = p.value;
      if (p.type === 'minute') minute = p.value;
      if (p.type === 'second') second = p.value;
      if (p.type === 'dayPeriod') period = p.value.toUpperCase();
    });

    let hour24 = 0;
    parts24.forEach((p) => {
      if (p.type === 'hour') hour24 = parseInt(p.value, 10);
    });

    const isDaytime = hour24 >= 6 && hour24 < 18;

    const dateString = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(baseDate);

    // Calculate time difference in hours between user's local and target
    // We can compare epoch times for local vs target representation
    const localNow = new Date();
    const targetDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(localNow);

    const localDateStr = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(localNow);

    const targetParsed = new Date(targetDateStr).getTime();
    const localParsed = new Date(localDateStr).getTime();
    const diffHours = Math.round((targetParsed - localParsed) / (1000 * 60 * 60));

    let offsetDiffText = 'Same time';
    if (diffHours > 0) offsetDiffText = `+${diffHours}h ahead`;
    else if (diffHours < 0) offsetDiffText = `${diffHours}h behind`;

    return {
      timeString: `${hour}:${minute}`,
      period,
      dateString,
      secondsString: second,
      hours24: hour24,
      minutes: parseInt(minute, 10),
      seconds: parseInt(second, 10),
      isDaytime,
      offsetDiffHours: diffHours,
      offsetDiffText,
    };
  } catch {
    return {
      timeString: '--:--',
      period: '',
      dateString: 'Invalid TZ',
      secondsString: '00',
      hours24: 12,
      minutes: 0,
      seconds: 0,
      isDaytime: true,
      offsetDiffHours: 0,
      offsetDiffText: 'N/A',
    };
  }
}
