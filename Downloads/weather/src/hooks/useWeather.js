import { useState, useCallback, useEffect } from 'react';
import { weatherService } from '../services/weatherService';
import { randBetween, pickRandom } from '../utils/weatherUtils';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';

// ─── Constants ────────────────────────────────────────────────────
const MOCK_CITIES = [
    { name: 'Bangalore', country: 'India', lat: '12.97', lon: '77.59' },
    { name: 'London', country: 'United Kingdom', lat: '51.51', lon: '-0.13' },
    { name: 'New York', country: 'United States', lat: '40.71', lon: '-74.01' },
    { name: 'Paris', country: 'France', lat: '48.86', lon: '2.35' },
    { name: 'Tokyo', country: 'Japan', lat: '35.69', lon: '139.69' },
    { name: 'Mumbai', country: 'India', lat: '19.08', lon: '72.88' },
];

const CONDITIONS = [
    { desc: 'Sunny', code: 113, icon: 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png' },
    { desc: 'Partly cloudy', code: 116, icon: 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0002_few_clouds.png' },
    { desc: 'Cloudy', code: 119, icon: 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png' },
    { desc: 'Light rain', code: 296, icon: 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png' },
    { desc: 'Moderate rain', code: 302, icon: 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0018_cloudy_with_heavy_rain.png' },
];

// ─── Mock Data Generators ─────────────────────────────────────────
const generateMockCurrent = (query) => {
    const cityName = query.split(',')[0].trim();
    const cond = pickRandom(CONDITIONS);
    const temp = randBetween(15, 32);

    return {
        request: { type: 'City', query: cityName, language: 'en', unit: 'm' },
        location: {
            name: cityName,
            country: 'Demo Region',
            region: 'Simulation',
            lat: '0.00',
            lon: '0.00',
            timezone_id: 'UTC',
            localtime: format(new Date(), 'yyyy-MM-dd HH:mm'),
        },
        current: {
            observation_time: format(new Date(), 'hh:mm a'),
            temperature: temp,
            weather_code: cond.code,
            weather_icons: [cond.icon],
            weather_descriptions: [cond.desc],
            wind_speed: randBetween(5, 25),
            wind_degree: randBetween(0, 360),
            wind_dir: 'W',
            pressure: randBetween(1005, 1025),
            precip: randBetween(0, 5),
            humidity: randBetween(30, 80),
            cloudcover: randBetween(0, 100),
            feelslike: temp + randBetween(-2, 2),
            uv_index: randBetween(1, 9),
            visibility: randBetween(5, 15),
            is_day: 'yes'
        },
        _isMock: true
    };
};

const generateMockDay = (date, baseTemp) => {
    const avg = baseTemp + randBetween(-8, 8);
    const spread = randBetween(3, 12);
    const cond = pickRandom(CONDITIONS);

    return {
        date,
        maxtemp: avg + spread,
        mintemp: avg - spread,
        avgtemp: avg,
        condition: cond,
        totalsnow: 0,
        uvIndex: randBetween(1, 10),
        hourly: Array.from({ length: 8 }).map((_, i) => ({
            time: `${String(i * 3).padStart(2, '0')}00`,
            temperature: avg + randBetween(-4, 4),
            weather_descriptions: [cond.desc],
            weather_icons: [cond.icon],
            windspeedKmph: randBetween(5, 45),
            humidity: randBetween(30, 95),
        })),
    };
};

const generateMockForecast = (baseTemp, days = 30) => {
    const forecast = {};
    const today = new Date();
    let totalTemp = 0;
    let maxTemp = -Infinity;
    let minTemp = Infinity;
    let rainyDays = 0;

    for (let i = 0; i < days; i++) {
        const d = addDays(today, i);
        const key = format(d, 'yyyy-MM-dd');
        const dayData = generateMockDay(key, baseTemp);

        if (dayData.condition.desc.includes('rain')) rainyDays++;
        totalTemp += dayData.avgtemp;
        if (dayData.maxtemp > maxTemp) maxTemp = dayData.maxtemp;
        if (dayData.mintemp < minTemp) minTemp = dayData.mintemp;

        forecast[key] = dayData;
    }

    return {
        success: true,
        forecast,
        summary: { avgTemp: Math.round(totalTemp / days), maxTemp, minTemp, rainyDays },
        _isMock: true
    };
};

export const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [historical, setHistorical] = useState(null);
    const [marine, setMarine] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [savedCities, setSavedCities] = useState(() => {
        const saved = localStorage.getItem('savedCities');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }, [savedCities]);

    const fetchCurrentWeather = useCallback(async (query) => {
        if (!query) return;
        setLoading(true);
        setError(null);
        try {
            const encodedQuery = encodeURIComponent(query.trim());
            const data = await weatherService.getCurrent(encodedQuery);

            if (data?.error) {
                // If it's a quota or key issue, fallback to high-quality mock current
                if ([104, 101, 102, 105].includes(data.error.code)) {
                    console.warn(`API Error ${data.error.code}: ${data.error.info}. Falling back to demo mode.`);
                    const mockData = generateMockCurrent(query);
                    setCurrentWeather(mockData);
                    setForecast(generateMockForecast(mockData.current.temperature, 30));
                    return;
                }
                if (data.error.code === 615 || data.error.type === "request_failed") {
                    throw new Error(`Location "${query}" not found.`);
                }
                throw new Error(data.error.info || 'API Communication Failure');
            }

            setCurrentWeather(data);
            const cityName = data.location.name;
            setSavedCities(prev => {
                const filtered = prev.filter(c => c.toLowerCase() !== cityName.toLowerCase());
                return [cityName, ...filtered].slice(0, 5);
            });
            setForecast(generateMockForecast(data.current.temperature, 30));
        } catch (err) {
            // Check for Axios error status 429 (Rate Limit)
            if (err.response?.status === 429) {
                console.warn('Rate limit exceeded (429). Falling back to demo mode.');
                const mockData = generateMockCurrent(query);
                setCurrentWeather(mockData);
                setForecast(generateMockForecast(mockData.current.temperature, 30));
                return;
            }

            setError(err.message || 'Network connectivity issue');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHistorical = useCallback(async (query, startDate, endDate) => {
        setLoading(true);
        const baseTemp = currentWeather?.current?.temperature ?? 20;
        const result = { success: true, historical: {}, _isMock: true };
        if (endDate && startDate !== endDate) {
            eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) }).forEach(date => {
                const key = format(date, 'yyyy-MM-dd');
                result.historical[key] = generateMockDay(key, baseTemp);
            });
        } else {
            result.historical[startDate] = generateMockDay(startDate, baseTemp);
        }
        setHistorical(result);
        setLoading(false);
    }, [currentWeather]);

    const fetchMarine = useCallback(async (lat, lon) => {
        setLoading(true);
        const baseTemp = currentWeather?.current?.temperature ?? 20;
        setMarine({
            nearest_area: [{ areaName: [{ value: `${lat}, ${lon}` }], country: [{ value: 'Simulation Area' }] }],
            weather: [{
                hourly: Array.from({ length: 8 }).map((_, i) => ({
                    time: `${String(i * 3).padStart(2, '0')}00`,
                    waterTemp_C: baseTemp - 5 + randBetween(-2, 2),
                    swellHeight_m: (randBetween(5, 25) / 10).toFixed(1),
                    swellPeriod_secs: randBetween(4, 12),
                    windspeedKmph: randBetween(10, 60),
                }))
            }],
            _isMock: true
        });
        setLoading(false);
    }, [currentWeather]);

    const fetchAutocomplete = useCallback((query) => {
        if (!query || query.length < 2) return;
        setSuggestions(MOCK_CITIES.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.country.toLowerCase().includes(query.toLowerCase())
        ));
    }, []);

    const clearSuggestions = useCallback(() => setSuggestions([]), []);
    const removeSavedCity = (city) => setSavedCities(prev => prev.filter(c => c !== city));

    return {
        currentWeather, forecast, historical, marine, suggestions, loading, error, savedCities,
        fetchCurrentWeather, fetchHistorical, fetchMarine, fetchAutocomplete, clearSuggestions, removeSavedCity
    };
};
