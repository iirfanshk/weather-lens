import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { format } from 'date-fns';

const Forecast = ({ data }) => {
    if (!data || !data.forecast) return null;

    const forecastDays = Object.entries(data.forecast);
    // Calculate global min/max for the progress bar scaling
    const allMaxTemps = forecastDays.map(([, d]) => d.maxtemp);
    const allMinTemps = forecastDays.map(([, d]) => d.mintemp);
    const globalMax = Math.max(...allMaxTemps);
    const globalMin = Math.min(...allMinTemps);
    const range = globalMax - globalMin || 1;

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Header */}
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3 px-1">
                🗓 7-Day Forecast {data._isMock && <span className="text-violet-400 ml-1">(demo)</span>}
            </p>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl overflow-hidden divide-y divide-white/10">
                {forecastDays.map(([date, day], index) => {
                    const cond = day.hourly?.[0];
                    const icon = cond?.weather_icons?.[0];
                    const desc = cond?.weather_descriptions?.[0] || '';

                    // Bar positioning
                    const leftPct = ((day.mintemp - globalMin) / range) * 100;
                    const widthPct = ((day.maxtemp - day.mintemp) / range) * 100;

                    return (
                        <motion.div
                            key={date}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex items-center gap-3 px-5 py-4"
                        >
                            {/* Day name */}
                            <div className="w-10 flex-shrink-0">
                                <p className="text-white font-semibold text-sm">
                                    {index === 0 ? 'Today' : format(new Date(date), 'EEE')}
                                </p>
                                <p className="text-white/40 text-xs">{format(new Date(date), 'MMM d')}</p>
                            </div>

                            {/* Icon + description */}
                            <div className="flex items-center gap-2 w-28 flex-shrink-0">
                                {icon && <img src={icon} alt={desc} className="w-7 h-7 object-contain" />}
                                <span className="text-white/55 text-xs truncate">{desc}</span>
                            </div>

                            {/* Temperature range bar */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-white/50 text-sm w-8 text-right flex-shrink-0">{day.mintemp}°</span>
                                <div className="flex-1 relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                                        style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 5)}%` }}
                                    />
                                </div>
                                <span className="text-white text-sm font-semibold w-8 flex-shrink-0">{day.maxtemp}°</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
