import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Anchor, Wind, Thermometer, ArrowRight, MapPin, Navigation } from 'lucide-react';
import { cn } from '../libs/utils';

const PRESETS = [
    { name: 'London', lat: '51.50', lon: '-0.12' },
    { name: 'Paris', lat: '48.85', lon: '2.35' },
    { name: 'NYC', lat: '40.71', lon: '-74.00' },
    { name: 'Sydney', lat: '-33.87', lon: '151.21' },
    { name: 'Mumbai', lat: '19.07', lon: '72.87' },
];

const Marine = ({ onFetch, data, loading }) => {
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');

    const handleFetch = (latVal = lat, lonVal = lon) => {
        if (latVal && lonVal) onFetch(parseFloat(latVal), parseFloat(lonVal));
    };

    const handlePreset = (preset) => {
        setLat(preset.lat);
        setLon(preset.lon);
        handleFetch(preset.lat, preset.lon);
    };

    const marineHourly = data?.weather?.[0]?.hourly;
    const nearestArea = data?.nearest_area?.[0];

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-1 px-1">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                    <Waves className="w-5 h-5 text-cyan-400" />
                    Marine Weather
                </h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    Ocean conditions & nautical data
                </p>
            </div>

            {/* Input Card */}
            <div className="glass-card p-6 rounded-3xl flex flex-col gap-5">
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">
                    <Navigation className="w-3 h-3" /> Enter Coordinates
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white/30 text-[10px] uppercase font-bold tracking-wider ml-1">Latitude</label>
                        <input
                            type="number"
                            placeholder="48.85"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white/30 text-[10px] uppercase font-bold tracking-wider ml-1">Longitude</label>
                        <input
                            type="number"
                            placeholder="2.35"
                            value={lon}
                            onChange={(e) => setLon(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                        />
                    </div>
                </div>
                <button
                    onClick={() => handleFetch()}
                    disabled={loading || !lat || !lon}
                    className="w-full py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-sm transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                >
                    {loading ? 'Fetching...' : <><MapPin className="w-4 h-4" /> Analyze Marine Data</>}
                </button>

                <div>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Quick Access</p>
                    <div className="flex gap-2 flex-wrap">
                        {PRESETS.map(p => (
                            <button
                                key={p.name}
                                onClick={() => handlePreset(p)}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white text-xs font-bold transition-all"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            {marineHourly ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                >
                    {nearestArea && (
                        <div className="flex items-center gap-2 px-1 text-white/60 text-xs font-bold uppercase tracking-widest">
                            <Anchor className="w-4 h-4 text-cyan-400" />
                            {nearestArea.areaName?.[0]?.value}, {nearestArea.country?.[0]?.value}
                        </div>
                    )}
                    <div className="glass-card rounded-3xl overflow-hidden divide-y divide-white/5">
                        {marineHourly.map((h, i) => {
                            const timeStr = String(h.time).padStart(4, '0');
                            const hh = timeStr.slice(0, 2);
                            const mm = timeStr.slice(2);
                            return (
                                <div key={i} className="px-6 py-5 hover:bg-white/5 transition-colors">
                                    <p className="text-white/30 text-xs font-black mb-4 tracking-tighter">{hh}:{mm}</p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                <Thermometer className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-tight">Water Temp</p>
                                                <p className="text-white text-lg font-black">{h.waterTemp_C}°C</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                                <Waves className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-tight">Swell Height</p>
                                                <p className="text-white text-lg font-black">{h.swellHeight_m} m</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                                                <Wind className="w-5 h-5 text-teal-400" />
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-tight">Wind Speed</p>
                                                <p className="text-white text-lg font-black">{h.windspeedKmph} <span className="text-xs opacity-40">KM/H</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                                <Anchor className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-tight">Swell Period</p>
                                                <p className="text-white text-lg font-black">{h.swellPeriod_secs} s</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            ) : !loading && (
                <div className="glass-effect rounded-3xl py-16 flex flex-col items-center gap-4 border-dashed">
                    <Waves className="w-12 h-12 text-white/10" />
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest text-center px-8">Enter coordinates or pick a preset to view maritime data</p>
                </div>
            )}
        </div>
    );
};

export default Marine;
