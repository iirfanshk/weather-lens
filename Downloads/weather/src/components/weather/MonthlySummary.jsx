import React from 'react';
import { Thermometer, ThermometerSnowflake, ThermometerSun, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCard = ({ icon: Icon, label, value, unit, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass-card rounded-2xl p-4 flex flex-col gap-2 flex-1"
    >
        <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-white text-xl font-bold">
            {value}<span className="text-white/50 text-xs ml-1 font-normal">{unit}</span>
        </p>
    </motion.div>
);

const MonthlySummary = ({ summary }) => {
    if (!summary) return null;

    return (
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-white/70 text-sm font-semibold px-1">Monthly Insights</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryCard
                    icon={Thermometer}
                    label="Avg Temp"
                    value={summary.avgTemp}
                    unit="°C"
                    color="text-orange-400"
                    delay={0.1}
                />
                <SummaryCard
                    icon={ThermometerSun}
                    label="Highest"
                    value={summary.maxTemp}
                    unit="°C"
                    color="text-red-400"
                    delay={0.2}
                />
                <SummaryCard
                    icon={ThermometerSnowflake}
                    label="Lowest"
                    value={summary.minTemp}
                    unit="°C"
                    color="text-blue-400"
                    delay={0.3}
                />
                <SummaryCard
                    icon={CloudRain}
                    label="Rainy Days"
                    value={summary.rainyDays}
                    unit="days"
                    color="text-cyan-400"
                    delay={0.4}
                />
            </div>
        </div>
    );
};

export default MonthlySummary;
