import { RingtoneDefinition } from '../types';

export const AVAILABLE_RINGTONES: RingtoneDefinition[] = [
  {
    id: 'digital_chime',
    name: 'Digital Crystal',
    description: 'Sparkling ascending bell chime with shimmer harmonics',
    genre: 'Ambient Digital',
    badge: 'Popular',
    color: '#38bdf8', // sky
  },
  {
    id: 'cosmic_pulse',
    name: 'Cosmic Pulse',
    description: 'Futuristic synthesizer arpeggio with resonant filter sweep',
    genre: 'Sci-Fi Synth',
    badge: 'Modern',
    color: '#818cf8', // indigo
  },
  {
    id: 'zen_bell',
    name: 'Zen Singing Bowl',
    description: 'Calming Tibetan singing bowl with warm acoustic resonance',
    genre: 'Mindful',
    badge: 'Gentle',
    color: '#34d399', // emerald
  },
  {
    id: 'morning_radiance',
    name: 'Morning Radiance',
    description: 'Bright wooden marimba rhythmic sequence to wake up fresh',
    genre: 'Melodic Acoustic',
    badge: 'Energetic',
    color: '#fbbf24', // amber
  },
  {
    id: 'cyber_alarm',
    name: 'Cybernetic Echo',
    description: 'Dynamic two-tone radar alert with driving pulse',
    genre: 'High-Tech Alert',
    badge: 'Crisp',
    color: '#f43f5e', // rose
  },
];

let audioCtx: AudioContext | null = null;
let activeLoopInterval: number | null = null;
let activeOscillators: (OscillatorNode | GainNode)[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a single pattern instance for a specific ringtone
 */
export function playRingtoneNotePattern(ringtoneId: string, volume = 0.8): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), now);
    masterGain.connect(ctx.destination);

    switch (ringtoneId) {
      case 'digital_chime': {
        // Pentatonic sparkling crystal bells (E5, G#5, B5, E6, G#6)
        const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.12;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          // Harmonic overtone
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 2, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);

          gain2.gain.setValueAtTime(0, startTime);
          gain2.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
          gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

          osc.connect(gain);
          osc2.connect(gain2);
          gain.connect(masterGain);
          gain2.connect(masterGain);

          osc.start(startTime);
          osc2.start(startTime);
          osc.stop(startTime + 0.75);
          osc2.stop(startTime + 0.45);
        });
        break;
      }

      case 'cosmic_pulse': {
        // Sci-Fi Arpeggiated synthesizer with lowpass filter sweep
        const freqs = [220, 277.18, 329.63, 440, 554.37, 659.25];
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.5);
        filter.frequency.exponentialRampToValueAtTime(600, now + 1.2);
        filter.Q.setValueAtTime(4.5, now);
        filter.connect(masterGain);

        freqs.forEach((freq, idx) => {
          const startTime = now + idx * 0.1;
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, startTime);

          noteGain.gain.setValueAtTime(0, startTime);
          noteGain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

          osc.connect(noteGain);
          noteGain.connect(filter);

          osc.start(startTime);
          osc.stop(startTime + 0.45);
        });
        break;
      }

      case 'zen_bell': {
        // Tibetan Singing Bowl with rich deep fundamental and warm sustained resonance
        const fundamental = 396; // Solfeggio frequency (Liberating Guilt & Fear)
        const harmonics = [1, 2.02, 3.01, 4.05];
        const weights = [0.4, 0.25, 0.15, 0.08];

        harmonics.forEach((mult, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * mult, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(weights[idx], now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 2.5);
        });
        break;
      }

      case 'morning_radiance': {
        // Energetic Marimba pattern: C5, E5, G5, B5, C6, G5, E5
        const melody = [523.25, 659.25, 783.99, 987.77, 1046.50, 783.99, 659.25];
        melody.forEach((freq, i) => {
          const startTime = now + i * 0.11;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          // Click transient for wooden mallet feel
          const clickOsc = ctx.createOscillator();
          const clickGain = ctx.createGain();
          clickOsc.type = 'square';
          clickOsc.frequency.setValueAtTime(freq * 3, startTime);
          clickGain.gain.setValueAtTime(0.12, startTime);
          clickGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.03);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

          osc.connect(gain);
          clickOsc.connect(clickGain);
          gain.connect(masterGain);
          clickGain.connect(masterGain);

          osc.start(startTime);
          clickOsc.start(startTime);
          osc.stop(startTime + 0.4);
          clickOsc.stop(startTime + 0.05);
        });
        break;
      }

      case 'cyber_alarm':
      default: {
        // High-energy two-tone futuristic radar alert
        const pulses = [
          { freq1: 880, freq2: 1200, time: 0 },
          { freq1: 880, freq2: 1200, time: 0.18 },
          { freq1: 1100, freq2: 1440, time: 0.36 },
          { freq1: 1100, freq2: 1440, time: 0.54 },
        ];

        pulses.forEach(({ freq1, freq2, time }) => {
          const startTime = now + time;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(freq1, startTime);
          osc2.frequency.setValueAtTime(freq2, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.2, startTime + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(masterGain);

          osc1.start(startTime);
          osc2.start(startTime);
          osc1.stop(startTime + 0.16);
          osc2.stop(startTime + 0.16);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio synthesis warning:', err);
  }
}

/**
 * Preview ringtone once
 */
export function previewRingtone(ringtoneId: string, volume = 0.8): void {
  stopActiveAlarm();
  playRingtoneNotePattern(ringtoneId, volume);
}

/**
 * Start looping alarm sound until stopped
 */
export function startAlarmSound(ringtoneId: string, volume = 0.8): { stop: () => void } {
  stopActiveAlarm();

  // Play first immediately
  playRingtoneNotePattern(ringtoneId, volume);

  // Determine loop period based on pattern length
  let loopMs = 1800;
  if (ringtoneId === 'zen_bell') loopMs = 2800;
  if (ringtoneId === 'morning_radiance') loopMs = 1600;
  if (ringtoneId === 'cyber_alarm') loopMs = 1200;

  activeLoopInterval = window.setInterval(() => {
    playRingtoneNotePattern(ringtoneId, volume);
  }, loopMs);

  return {
    stop: stopActiveAlarm,
  };
}

/**
 * Stop any active looped alarm or preview
 */
export function stopActiveAlarm(): void {
  if (activeLoopInterval !== null) {
    clearInterval(activeLoopInterval);
    activeLoopInterval = null;
  }
  activeOscillators.forEach((node) => {
    try {
      if ('stop' in node) (node as OscillatorNode).stop();
      node.disconnect();
    } catch {
      // ignore
    }
  });
  activeOscillators = [];
}

/**
 * Short acoustic UI tap or lap beep
 */
export function playUiFeedback(type: 'click' | 'start' | 'stop' | 'lap' = 'click', volume = 0.5): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    gain.gain.setValueAtTime(0.08 * volume, now);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'start') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'stop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(370, now + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'lap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  } catch {
    // ignore
  }
}
