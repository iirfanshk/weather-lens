import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, History, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { cn } from '../libs/utils';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { suggestions, fetchAutocomplete, clearSuggestions, savedCities, removeSavedCity } = useWeather();
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length >= 2) {
                fetchAutocomplete(query);
            } else {
                clearSuggestions();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [query, fetchAutocomplete, clearSuggestions]);

    const handleSelect = (cityName) => {
        const q = cityName.trim();
        setQuery(q);
        setIsFocused(false);
        clearSuggestions();
        onSearch(q);
    };

    const handleGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    onSearch(`${latitude},${longitude}`);
                    setIsFocused(false);
                    clearSuggestions();
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            onSearch(trimmed);
            setIsFocused(false);
            clearSuggestions();
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full z-50">
            <form onSubmit={handleSubmit} className="relative group">
                <motion.div
                    animate={{
                        scale: isFocused ? 1.01 : 1,
                        boxShadow: isFocused ? "0 15px 35px -15px rgba(0,0,0,0.4)" : "0 5px 15px -5px rgba(0,0,0,0.2)"
                    }}
                    className={cn(
                        "flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300",
                        "glass-effect",
                        isFocused ? "bg-white/20 border-white/25" : "bg-white/10 border-white/10"
                    )}
                >
                    <Search className={cn("w-5 h-5 transition-colors", isFocused ? "text-blue-400" : "text-white/30")} />
                    <input
                        type="text"
                        value={query}
                        onFocus={() => setIsFocused(true)}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a city (e.g. Bangalore, Paris)..."
                        className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-base font-medium"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(''); clearSuggestions(); }}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-white/40" />
                        </button>
                    )}
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button
                        type="button"
                        onClick={handleGeolocation}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
                        title="Use my location"
                    >
                        <Navigation className="w-5 h-5" />
                    </button>
                </motion.div>
            </form>

            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 6, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 glass-effect rounded-[1.5rem] overflow-hidden shadow-2xl p-2 flex flex-col gap-1 max-h-[400px] overflow-y-auto no-scrollbar bg-black/40 backdrop-blur-3xl border-white/10"
                    >
                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="flex flex-col gap-1 mb-2">
                                <p className="px-3 py-1.5 text-[9px] font-black text-blue-400/80 uppercase tracking-[0.2em]">Top Matches</p>
                                {suggestions.map((item, index) => (
                                    <button
                                        key={`${item.name}-${index}`}
                                        onClick={() => handleSelect(item.name)}
                                        className="w-full px-4 py-3 hover:bg-white/10 rounded-xl flex items-center gap-3 transition-colors text-left group"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                            <MapPin className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-bold tracking-tight">{item.name}</span>
                                            <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">{item.country}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Recent Searches */}
                        {savedCities.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <p className="px-3 py-1.5 text-[9px] font-black text-orange-400/80 uppercase tracking-[0.2em]">Recent History</p>
                                {savedCities.map((city, index) => (
                                    <div key={`${city}-${index}`} className="flex items-center group/item">
                                        <button
                                            onClick={() => handleSelect(city)}
                                            className="flex-1 px-4 py-3 hover:bg-white/10 rounded-xl flex items-center gap-3 transition-colors text-left"
                                        >
                                            <History className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                                            <span className="text-white/60 text-sm font-medium group-hover:text-white transition-colors">{city}</span>
                                        </button>
                                        <button
                                            onClick={() => removeSavedCity(city)}
                                            className="p-2 opacity-0 group-hover/item:opacity-100 hover:bg-red-500/10 rounded-lg transition-all text-white/20 hover:text-red-400"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {suggestions.length === 0 && savedCities.length === 0 && (
                            <div className="py-8 text-center flex flex-col items-center gap-3">
                                <div className="p-3 rounded-full bg-white/5">
                                    <Search className="w-5 h-5 text-white/10" />
                                </div>
                                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Type a city name to search</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
