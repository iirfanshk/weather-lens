import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, CalendarRange, Waves, History, Moon, Sun as SunIcon, Settings, CalendarDays } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import MonthlyForecast from '../components/weather/MonthlyForecast';
import MonthlySummary from '../components/weather/MonthlySummary';
import HourlyForecast from '../components/weather/HourlyForecast';
import Historical from '../components/Historical';
import Marine from '../components/Marine';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { cn } from '../libs/utils';

const BACKGROUNDS = {
    clear: 'from-blue-500 via-blue-600 to-indigo-800',
    cloudy: 'from-slate-500 via-slate-600 to-slate-800',
    rainy: 'from-blue-800 via-slate-700 to-slate-900',
    night: 'from-slate-900 via-black to-slate-900',
    default: 'from-blue-600 via-indigo-700 to-purple-800'
};

const getBackgroundClass = (code, isDay) => {
    if (!isDay) return BACKGROUNDS.night;
    if (!code) return BACKGROUNDS.default;
    const c = Number(code);
    if (c === 113) return BACKGROUNDS.clear;
    if ([116, 119, 122, 143].includes(c)) return BACKGROUNDS.cloudy;
    if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359, 386, 389, 392, 395].includes(c)) return BACKGROUNDS.rainy;
    return BACKGROUNDS.default;
};

const TAB_CONFIG = [
    { id: 'today', label: 'Today', icon: CloudSun },
    { id: 'forecast', label: '30-Day', icon: CalendarRange },
    { id: 'history', label: 'History', icon: CalendarDays },
    { id: 'marine', label: 'Marine', icon: Waves },
];

const WeatherPage = () => {
    const {
        currentWeather, forecast, historical, marine,
        loading, error,
        fetchCurrentWeather, fetchHistorical, fetchMarine
    } = useWeather();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('today');
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        // Attempt to load current location or a fallback
        if (!currentWeather && !loading) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => fetchCurrentWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
                    () => fetchCurrentWeather('London')
                );
            } else {
                fetchCurrentWeather('London');
            }
        }
    }, []);

    const bgClass = useMemo(() => {
        const code = currentWeather?.current?.weather_code;
        const isDay = currentWeather?.current?.is_day === 'yes';
        return getBackgroundClass(code, isDay);
    }, [currentWeather]);

    const handleSearch = (query) => {
        if (!query) return;
        fetchCurrentWeather(query);
        setActiveTab('today');
    };

    return (
        <div className={cn(
            "min-h-screen w-full flex flex-col transition-all duration-1000 bg-gradient-to-br",
            bgClass,
            theme === 'dark' ? 'brightness-90' : 'brightness-105'
        )}>
            {/* Ambient background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <header className="relative z-50 w-full max-w-4xl mx-auto px-4 pt-8 pb-4 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-white text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <CloudSun className="w-8 h-8 text-blue-400" />
                            SkyLens <span className="text-blue-400">Pro</span>
                        </h2>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Weather Intelligence</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-2xl glass-effect hover:bg-white/20 transition-all text-white/70 hover:text-white"
                    >
                        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                </div>

                <SearchBar onSearch={handleSearch} />
            </header>

            <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 pb-32 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                    {loading && activeTab === 'today' ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <LoadingSpinner />
                        </motion.div>
                    ) : error && activeTab === 'today' ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-effect p-8 rounded-3xl text-center flex flex-col items-center gap-4 mt-12 bg-red-500/5 border-red-500/20"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                <Settings className="w-8 h-8 text-red-500 animate-spin-slow" />
                            </div>
                            <div>
                                <h3 className="text-white text-xl font-bold">Oops! Something went wrong</h3>
                                <p className="text-white/50 text-sm mt-1">{error}</p>
                            </div>
                            <button
                                onClick={() => fetchCurrentWeather('London')}
                                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-bold transition-all"
                            >
                                Try London instead
                            </button>
                        </motion.div>
                    ) : currentWeather ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col gap-8 py-4 px-2"
                        >
                            {activeTab === 'today' && (
                                <>
                                    <CurrentWeather data={currentWeather} />
                                    {forecast && <HourlyForecast hourly={forecast.forecast[Object.keys(forecast.forecast)[0]]?.hourly} />}
                                </>
                            )}

                            {activeTab === 'forecast' && forecast && (
                                <>
                                    <MonthlySummary summary={forecast.summary} />
                                    <MonthlyForecast data={forecast} onSelectDay={setSelectedDay} />
                                </>
                            )}

                            {activeTab === 'history' && (
                                <Historical
                                    onFetch={fetchHistorical}
                                    data={historical}
                                    loading={loading}
                                    location={currentWeather?.location?.name}
                                />
                            )}

                            {activeTab === 'marine' && (
                                <Marine
                                    onFetch={fetchMarine}
                                    data={marine}
                                    loading={loading}
                                />
                            )}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center gap-4 opacity-40">
                            <CloudSun className="w-20 h-20 text-white" />
                            <p className="text-white font-bold uppercase tracking-[0.3em]">Search a city to begin</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Navigation Dock */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none">
                <div className="max-w-xl mx-auto pointer-events-auto">
                    <div className="glass-effect rounded-[2.5rem] p-2 flex items-center justify-between gap-1 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {TAB_CONFIG.map(({ id, label, icon: Icon }) => {
                            const isActive = activeTab === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={cn(
                                        "flex-1 relative flex flex-col items-center justify-center gap-1.5 py-4 rounded-[2rem] transition-all duration-500",
                                        isActive ? "bg-white text-blue-600 scale-[1.05] shadow-xl" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-wider", isActive ? "opacity-100" : "opacity-40")}>
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default WeatherPage;
