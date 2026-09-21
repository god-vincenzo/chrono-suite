import React, { useState, useEffect, useMemo } from 'react';
import { WorldCity, TimeFormat } from '../../types';
import { WORLD_CITIES, formatCityTime } from '../../data/worldCities';
import { Globe, Search, Sun, Moon, Star, Clock, Filter, ArrowRightLeft, Sparkles } from 'lucide-react';

interface WorldClockSectionProps {
  timeFormat: TimeFormat;
}

export const WorldClockSection: React.FC<WorldClockSectionProps> = ({ timeFormat }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_clock_favorites');
      return saved ? JSON.parse(saved) : ['nyc', 'lon', 'tyo', 'dxb', 'syd'];
    } catch {
      return ['nyc', 'lon', 'tyo', 'dxb', 'syd'];
    }
  });

  // Time converter helper
  const [converterCityA, setConverterCityA] = useState<string>('lon');
  const [converterCityB, setConverterCityB] = useState<string>('tyo');
  const [customHour, setCustomHour] = useState<number>(14); // 2:00 PM

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (cityId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId];
      try {
        localStorage.setItem('aura_clock_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const regions = ['All', 'Favorites', 'Americas', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa'];

  const filteredCities = useMemo(() => {
    return WORLD_CITIES.filter((city) => {
      const matchesSearch =
        city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.region.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedRegion === 'All') return true;
      if (selectedRegion === 'Favorites') return favorites.includes(city.id);
      return city.region === selectedRegion;
    });
  }, [selectedRegion, searchQuery, favorites]);

  // Converter calculations
  const cityAObj = WORLD_CITIES.find((c) => c.id === converterCityA) || WORLD_CITIES[0];
  const cityBObj = WORLD_CITIES.find((c) => c.id === converterCityB) || WORLD_CITIES[1];

  const convertedDate = useMemo(() => {
    const d = new Date(currentTime);
    d.setHours(customHour, 0, 0, 0);
    return d;
  }, [currentTime, customHour]);

  const timeAData = useMemo(() => formatCityTime(cityAObj.timezone, timeFormat === '12h', convertedDate), [cityAObj, timeFormat, convertedDate]);
  const timeBData = useMemo(() => formatCityTime(cityBObj.timezone, timeFormat === '12h', convertedDate), [cityBObj, timeFormat, convertedDate]);

  return (
    <div id="world-clock" className="w-full space-y-8">
      {/* Header with Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Global Chrono Network</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">World Clock & Regional Timers</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Synchronized atomic clocks across all world continents with daylight detection and solar angle offsets.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search city, country, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {regions.map((region) => {
          const count =
            region === 'All'
              ? WORLD_CITIES.length
              : region === 'Favorites'
              ? favorites.length
              : WORLD_CITIES.filter((c) => c.region === region).length;

          return (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-xl font-mono-code text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedRegion === region
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-neutral-800/80'
              }`}
            >
              {region === 'Favorites' && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
              <span>{region}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedRegion === region ? 'bg-indigo-700 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of City Clocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCities.map((city) => {
          const timeData = formatCityTime(city.timezone, timeFormat === '12h', currentTime);
          const isFav = favorites.includes(city.id);

          return (
            <div
              key={city.id}
              className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                timeData.isDaytime
                  ? 'bg-gradient-to-br from-neutral-900/90 to-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  : 'bg-gradient-to-br from-neutral-950 to-neutral-900/80 border-neutral-800/90 hover:border-neutral-700'
              }`}
            >
              {/* Card Top: Flag, Name, Star */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" role="img" aria-label={city.country}>
                    {city.flag}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                      {city.city}
                      {timeData.isDaytime ? (
                        <span title="Daytime">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                        </span>
                      ) : (
                        <span title="Nighttime">
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono-code">{city.country}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(city.id)}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                </button>
              </div>

              {/* Card Middle: Large Digital Clock Display */}
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono-code tracking-tight text-white">
                    {timeData.timeString}
                  </span>
                  <span className="text-sm font-mono-code font-bold text-neutral-400">
                    :{timeData.secondsString}
                  </span>
                  {timeData.period && (
                    <span className="text-xs font-mono-code font-bold text-indigo-400 uppercase ml-1">
                      {timeData.period}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono-code text-neutral-400 mt-1">{timeData.dateString}</div>
              </div>

              {/* Card Bottom: Offset and Tag */}
              <div className="pt-3 mt-3 border-t border-neutral-800/70 flex items-center justify-between text-[11px] font-mono-code">
                <span className={`px-2 py-0.5 rounded-md ${
                  timeData.offsetDiffHours === 0
                    ? 'bg-neutral-800 text-neutral-300'
                    : timeData.offsetDiffHours > 0
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {timeData.offsetDiffText}
                </span>

                <span className="text-neutral-500">{city.region}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regional Time Overlap & Converter Tool */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase mb-1">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Interactive Cross-Region Time Converter</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-2">Cross-Continent Meeting & Time Overlap Calculator</h3>
        <p className="text-xs text-neutral-400 mb-6">
          Slide the hour marker below to inspect corresponding local times across different global office regions simultaneously.
        </p>

        {/* Interactive Slider */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400">
            <span>Reference Hour Slider (24h)</span>
            <span className="font-bold text-white text-sm">{customHour}:00 ({customHour >= 12 ? `${customHour === 12 ? 12 : customHour - 12} PM` : `${customHour === 0 ? 12 : customHour} AM`})</span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            step="1"
            value={customHour}
            onChange={(e) => setCustomHour(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-mono-code text-neutral-500">
            <span>00:00 (Midnight)</span>
            <span>06:00 (Dawn)</span>
            <span>12:00 (Noon)</span>
            <span>18:00 (Evening)</span>
            <span>23:00 (Night)</span>
          </div>
        </div>

        {/* Dual City Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City A */}
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono-code text-neutral-400">Location A</label>
              <select
                value={converterCityA}
                onChange={(e) => setConverterCityA(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none font-mono-code"
              >
                {WORLD_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.city}, {c.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono-code text-white">{timeAData.timeString}</span>
              {timeAData.period && <span className="text-sm font-mono-code font-bold text-indigo-400">{timeAData.period}</span>}
            </div>
            <div className="text-xs font-mono-code text-neutral-400 mt-1">{timeAData.dateString}</div>
          </div>

          {/* City B */}
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono-code text-neutral-400">Location B</label>
              <select
                value={converterCityB}
                onChange={(e) => setConverterCityB(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none font-mono-code"
              >
                {WORLD_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.city}, {c.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono-code text-white">{timeBData.timeString}</span>
              {timeBData.period && <span className="text-sm font-mono-code font-bold text-indigo-400">{timeBData.period}</span>}
            </div>
            <div className="text-xs font-mono-code text-neutral-400 mt-1">{timeBData.dateString}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
