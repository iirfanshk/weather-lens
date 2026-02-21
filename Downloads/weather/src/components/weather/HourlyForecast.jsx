import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Wind, Droplets } from 'lucide-react';
import { cn } from '../../libs/utils';

const HourCard = ({ hour }) => {
    const { time, temperature, weather_icons, weather_descriptions, windspeedKmph, humidity } = hour;
    const formattedTime = time.slice(0, 2) + ':00';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card min-w-[90px] p-3 rounded-2xl flex flex-col items-center gap-2"
        >
            <span className="text-[10px] font-bold text-white/40 uppercase">{formattedTime}</span>
            <img src={weather_icons?.[0]} alt={weather_descriptions?.[0]} className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold text-white">{temperature}°</span>
            <div className="flex flex-col gap-1 w-full border-t border-white/5 pt-2">
                <div className="flex items-center gap-1.5 text-[8px] text-white/50">
                    <Wind className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{windspeedKmph} <span className="opacity-50 text-[6px]">KM/H</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-[8px] text-white/50">
                    <Droplets className="w-2.5 h-2.5 text-blue-400" />
                    <span>{humidity}%</span>
                </div>
            </div>
        </motion.div>
    );
};

const HourlyForecast = ({ hourly }) => {
    if (!hourly) return null;

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
                <Clock className="w-4 h-4 text-white/60" />
                <h3 className="text-white/70 text-sm font-semibold">Hourly Forecast</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
                {hourly.map((hour, idx) => (
                    <HourCard key={`${hour.time}-${idx}`} hour={hour} />
                ))}
            </div>
        </div>
    );
};

export default HourlyForecast;
