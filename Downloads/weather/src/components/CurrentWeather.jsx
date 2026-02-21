import React from 'react';
import { Wind, Droplets, Gauge, Eye, Thermometer, Sun, Cloud, CloudRain, Navigation, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../libs/utils';

const StatCard = ({ icon: Icon, label, value, unit, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay }}
        className="glass-card p-4 flex flex-col gap-2 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon className={cn('w-12 h-12', color)} />
        </div>
        <div className="flex items-center gap-2 relative z-10">
            <Icon className={cn('w-4 h-4', color)} />
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-white text-2xl font-bold leading-none relative z-10">
            {value}<span className="text-white/40 text-xs ml-1 font-normal uppercase">{unit}</span>
        </p>
    </motion.div>
);

const CurrentWeather = ({ data }) => {
    if (!data) return null;
    const { current, location, _isMock } = data;

    return (
        <div className="w-full flex flex-col gap-6">
            {/* ── Main Display ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center gap-2"
            >
                <div className="flex flex-col items-center gap-2 mb-1">
                    <div className="flex items-center gap-2 text-white/50">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs font-semibold tracking-widest uppercase">
                            {location.name}, {location.country}
                        </span>
                        {_isMock && (
                            <span className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[8px] font-black uppercase tracking-widest ml-1">
                                Simulation
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center relative py-4">
                    {/* Background glow for icon */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 blur-[80px] bg-blue-500/20 rounded-full" />

                    <div className="flex items-center justify-center gap-6 relative z-10">
                        {current.weather_icons?.[0] && (
                            <motion.img
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={current.weather_icons[0]}
                                alt={current.weather_descriptions?.[0]}
                                className="w-24 h-24 object-contain animate-float"
                            />
                        )}
                        <div className="flex flex-col items-start">
                            <h1 className="text-white text-9xl font-black tracking-tighter leading-none text-shadow-glow">
                                {current.temperature}<span className="text-4xl font-light align-top mt-4 inline-block">°</span>
                            </h1>
                            <p className="text-white/80 text-xl font-medium mt-1">
                                {current.weather_descriptions?.[0]}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm font-medium mt-2 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <span className="text-white/60">Feels Like <span className="text-white">{current.feelslike}°</span></span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{current.observation_time}</span>
                    </div>
                </div>
            </motion.div>

            {/* ── Key Stats ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Droplets} label="Humidity" value={current.humidity} unit="%" color="text-teal-400" delay={0.1} />
                <StatCard icon={Wind} label="Wind" value={current.wind_speed} unit="km/h" color="text-cyan-400" delay={0.2} />
                <StatCard icon={Gauge} label="Pressure" value={current.pressure} unit="mb" color="text-purple-400" delay={0.3} />
                <StatCard icon={Sun} label="UV Index" value={current.uv_index} unit="pts" color="text-yellow-400" delay={0.4} />
            </div>
        </div>
    );
};

export default CurrentWeather;
