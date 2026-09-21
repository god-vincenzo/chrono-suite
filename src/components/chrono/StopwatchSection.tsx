import React, { useState, useEffect, useRef } from 'react';
import { Lap } from '../../types';
import { playUiFeedback } from '../../utils/audioSynthesizer';
import { Play, Pause, RotateCcw, Flag, Download, Trash2, Zap, Timer } from 'lucide-react';

interface StopwatchSectionProps {
  soundEnabled: boolean;
  volume: number;
}

export const StopwatchSection: React.FC<StopwatchSectionProps> = ({ soundEnabled, volume }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // milliseconds
  const [laps, setLaps] = useState<Lap[]>([]);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleStart();
      } else if (e.code === 'KeyL' && isRunning) {
        e.preventDefault();
        handleRecordLap();
      } else if (e.code === 'KeyR' && !isRunning) {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, elapsedTime]);

  const updateStopwatch = () => {
    const now = performance.now();
    const current = accumulatedTimeRef.current + (now - startTimeRef.current);
    setElapsedTime(current);
    animFrameRef.current = requestAnimationFrame(updateStopwatch);
  };

  const handleToggleStart = () => {
    if (isRunning) {
      // Pause
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      accumulatedTimeRef.current += performance.now() - startTimeRef.current;
      setIsRunning(false);
      if (soundEnabled) playUiFeedback('stop', volume);
    } else {
      // Start / Resume
      startTimeRef.current = performance.now();
      setIsRunning(true);
      if (soundEnabled) playUiFeedback('start', volume);
      animFrameRef.current = requestAnimationFrame(updateStopwatch);
    }
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    setElapsedTime(0);
    setLaps([]);
    if (soundEnabled) playUiFeedback('click', volume);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      centiseconds: pad(centiseconds),
      formatted: `${hours > 0 ? `${pad(hours)}:` : ''}${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`,
    };
  };

  const handleRecordLap = () => {
    if (soundEnabled) playUiFeedback('lap', volume);

    const currentTotal = elapsedTime;
    const lastTotal = laps.length > 0 ? laps[0].totalTimeMs : 0;
    const splitTime = currentTotal - lastTotal;

    const newLap: Lap = {
      lapNumber: laps.length + 1,
      splitTimeMs: splitTime,
      totalTimeMs: currentTotal,
      formattedSplit: formatTime(splitTime).formatted,
      formattedTotal: formatTime(currentTotal).formatted,
    };

    const newLaps = [newLap, ...laps];

    // Recalculate fastest and slowest
    if (newLaps.length >= 2) {
      let fastestMs = Infinity;
      let slowestMs = -Infinity;

      newLaps.forEach((l) => {
        if (l.splitTimeMs < fastestMs) fastestMs = l.splitTimeMs;
        if (l.splitTimeMs > slowestMs) slowestMs = l.splitTimeMs;
      });

      newLaps.forEach((l) => {
        l.isFastest = l.splitTimeMs === fastestMs;
        l.isSlowest = l.splitTimeMs === slowestMs;
      });
    }

    setLaps(newLaps);
  };

  const handleExportLaps = () => {
    if (laps.length === 0) return;
    const text = laps
      .map(
        (l) =>
          `Lap #${l.lapNumber.toString().padStart(2, '0')} | Split: ${l.formattedSplit} | Total: ${l.formattedTotal}`
      )
      .join('\n');

    navigator.clipboard.writeText(`--- Aura3D Stopwatch Lap Summary ---\n${text}`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const timeFormatted = formatTime(elapsedTime);
  const secondsMod60 = (elapsedTime / 1000) % 60;
  const progressPercent = (secondsMod60 / 60) * 100;

  return (
    <div id="stopwatch" className="w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase tracking-wider mb-1">
          <Timer className="w-4 h-4" />
          <span>High-Precision Chronometer</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white">Precision Stopwatch</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Sub-millisecond frame synchronized stopwatch with progressive dial, lap differential metrics, and hotkeys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Display & Controls (Left 7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Background Ring */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90">
              {/* Track */}
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-neutral-800/80"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Dynamic Animated Progress Circle */}
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-indigo-500 transition-all duration-75"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 135}`}
                strokeDashoffset={`${2 * Math.PI * 135 * (1 - progressPercent / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered Digital Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-mono-code tracking-tight text-white flex items-baseline">
                {timeFormatted.hours !== '00' && (
                  <span>
                    {timeFormatted.hours}
                    <span className="text-neutral-500 text-3xl">:</span>
                  </span>
                )}
                <span>{timeFormatted.minutes}</span>
                <span className="text-neutral-500 text-3xl">:</span>
                <span>{timeFormatted.seconds}</span>
                <span className="text-xl md:text-2xl font-bold font-mono-code text-indigo-400 ml-1">
                  .{timeFormatted.centiseconds}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs font-mono-code text-neutral-400">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
                <span>{isRunning ? 'RUNNING' : elapsedTime > 0 ? 'PAUSED' : 'READY'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            {/* Start / Pause Button */}
            <button
              onClick={handleToggleStart}
              className={`flex-1 min-w-[130px] py-3.5 px-6 rounded-xl font-mono-code text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isRunning
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-amber-300" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Pause' : elapsedTime > 0 ? 'Resume' : 'Start'}</span>
            </button>

            {/* Lap Button */}
            <button
              onClick={handleRecordLap}
              disabled={!isRunning}
              className="py-3.5 px-5 rounded-xl font-mono-code text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-200 flex items-center gap-2 border border-neutral-700 transition-colors"
            >
              <Flag className="w-4 h-4 text-indigo-400" />
              <span>Lap</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              disabled={elapsedTime === 0 && laps.length === 0}
              className="py-3.5 px-5 rounded-xl font-mono-code text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-400 hover:text-white flex items-center gap-2 border border-neutral-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Keyboard Hotkey helper */}
          <div className="flex items-center gap-4 mt-6 text-[11px] font-mono-code text-neutral-500">
            <span>[Space] Start / Pause</span>
            <span>[L] Lap</span>
            <span>[R] Reset</span>
          </div>
        </div>

        {/* Lap History Table (Right 5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold font-display text-white text-base">Recorded Laps ({laps.length})</h3>
              </div>

              {laps.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportLaps}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Export Laps"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLaps([])}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/30 text-neutral-400 hover:text-rose-400 transition-colors"
                    title="Clear Laps"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {copiedNotification && (
              <div className="mt-3 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono-code text-center">
                Laps summary copied to clipboard!
              </div>
            )}

            {/* Lap List */}
            <div className="mt-4 max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {laps.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 font-mono-code text-xs">
                  No laps recorded yet. Press "Lap" or hotkey [L] while running.
                </div>
              ) : (
                laps.map((lap) => (
                  <div
                    key={lap.lapNumber}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono-code transition-all ${
                      lap.isFastest
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : lap.isSlowest
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-400">
                        #{lap.lapNumber.toString().padStart(2, '0')}
                      </span>
                      {lap.isFastest && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                          FASTEST
                        </span>
                      )}
                      {lap.isSlowest && laps.length > 2 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">
                          SLOWEST
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-white">{lap.formattedSplit}</div>
                      <div className="text-[10px] text-neutral-500">Total: {lap.formattedTotal}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fastest Lap Stat footer */}
          {laps.length > 0 && (
            <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono-code text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Fastest Split:</span>
              </span>
              <span className="font-bold text-emerald-400">
                {laps.find((l) => l.isFastest)?.formattedSplit || laps[0].formattedSplit}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
