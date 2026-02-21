import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, Thermometer, Wind, Droplets, ArrowRight, CalendarRange } from 'lucide-react';
import { format, subDays, isAfter, isBefore, parseISO } from 'date-fns';
import { cn } from '../libs/utils';

const Historical = ({ onFetch, data, loading, location }) => {
    const maxDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(maxDate);

    const handleFetch = () => {
        if (location && startDate && endDate) {
            onFetch(location, startDate, endDate);
        }
    };

    const histDays = data?.historical ? Object.values(data.historical).sort((a, b) => b.date.localeCompare(a.date)) : [];

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-1 px-1">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                    <CalendarRange className="w-5 h-5 text-blue-400" />
                    Historical Archive
                </h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    Select a date range to review past weather patterns {data?._isMock && <span className="text-violet-400 ml-1">(demo)</span>}
                </p>
            </div>

            {/* Date Range Picker Card */}
            <div className="glass-card p-6 rounded-3xl flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white/40 text-[10px] uppercase font-black tracking-widest ml-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white/40 text-[10px] uppercase font-black tracking-widest ml-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            max={maxDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all w-full"
                        />
                    </div>
                </div>
                <button
                    onClick={handleFetch}
                    disabled={loading || !location}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
                >
                    {loading ? 'Processing...' : <><CalendarDays className="w-4 h-4" /> Fetch History Range</>}
                </button>
                {!location && (
                    <p className="text-red-400/60 text-[10px] font-bold uppercase tracking-widest text-center">Search for a city first to unlock history</p>
                )}
            </div>

            {histDays.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex items-center justify-between px-1">
                        <p className="text-white/70 text-sm font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Results ({histDays.length} days)
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {histDays.map((day, idx) => (
                            <div
                                key={day.date}
                                className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-all group"
                            >
                                <div className="flex flex-col w-16 flex-shrink-0">
                                    <span className="text-[10px] font-black text-white/40 uppercase">{format(parseISO(day.date), 'EEE')}</span>
                                    <span className="text-sm font-bold text-white">{format(parseISO(day.date), 'MMM d')}</span>
                                </div>

                                <img src={day.condition.icon} alt="" className="w-10 h-10 object-contain" />

                                <div className="flex-1 min-w-0">
                                    <p className="text-white/80 text-xs font-semibold truncate">{day.condition.desc}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] text-orange-400 font-bold">{Math.round(day.maxtemp)}°</span>
                                        <span className="text-[10px] text-blue-400 font-bold">{Math.round(day.mintemp)}°</span>
                                        <div className="flex items-center gap-1 text-[8px] text-white/30">
                                            <Wind className="w-2.5 h-2.5" />
                                            {day.hourly?.[0]?.windspeedKmph} <span className="opacity-50">KPH</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-xl font-black text-white">{Math.round(day.avgtemp)}°</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {histDays.length === 0 && !loading && location && (
                <div className="glass-effect rounded-3xl py-16 flex flex-col items-center gap-4 border-dashed border-white/5 bg-transparent">
                    <CalendarRange className="w-12 h-12 text-white/5" />
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">Select range and fetch history</p>
                </div>
            )}
        </div>
    );
};

export default Historical;
