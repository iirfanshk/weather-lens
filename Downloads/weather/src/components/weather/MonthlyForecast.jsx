import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { CloudRain, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { cn } from '../../libs/utils';

const DayCard = ({ day, isSelected, onClick }) => {
    const { date, maxtemp, mintemp, condition, chanceofrain } = day;
    const formattedDate = new Date(date);

    return (
        <motion.div
            layout
            onClick={onClick}
            className={cn(
                "glass-card p-3 rounded-2xl cursor-pointer flex flex-col items-center gap-1 transition-all duration-300",
                isSelected ? "bg-white/20 border-white/40 ring-2 ring-white/20" : "hover:bg-white/10"
            )}
        >
            <span className="text-[10px] uppercase font-bold text-white/40">
                {format(formattedDate, 'EEE')}
            </span>
            <span className="text-sm font-bold text-white">
                {format(formattedDate, 'd')}
            </span>
            <img src={condition.icon} alt={condition.desc} className="w-8 h-8 object-contain my-1" />
            <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-white">{Math.round(maxtemp)}°</span>
                <span className="text-[10px] text-white/40">{Math.round(mintemp)}°</span>
            </div>
            {chanceofrain > 20 && (
                <div className="flex items-center gap-0.5 text-[8px] text-cyan-400 font-bold mt-1">
                    <CloudRain className="w-2 h-2" />
                    {chanceofrain}%
                </div>
            )}
        </motion.div>
    );
};

const MonthlyForecast = ({ data, onSelectDay }) => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'scroll'
    const days = Object.values(data.forecast);

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                    <h3 className="text-white text-lg font-bold">30-Day Forecast</h3>
                    <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest">
                        Expected conditions for the next month
                    </p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white/20 text-white" : "text-white/30 hover:text-white/60")}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('scroll')}
                        className={cn("p-2 rounded-lg transition-all", viewMode === 'scroll' ? "bg-white/20 text-white" : "text-white/30 hover:text-white/60")}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-4 sm:grid-cols-7 gap-2"
                    >
                        {days.map((day, idx) => (
                            <DayCard
                                key={day.date}
                                day={day}
                                onClick={() => onSelectDay?.(day)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="scroll"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1"
                    >
                        {days.map((day) => (
                            <div key={day.date} className="min-w-[100px]">
                                <DayCard
                                    day={day}
                                    onClick={() => onSelectDay?.(day)}
                                />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MonthlyForecast;
