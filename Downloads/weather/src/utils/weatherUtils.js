import { format } from 'date-fns';

export const randBetween = (min, max) => Math.round(min + Math.random() * (max - min));

export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const formatTemperature = (temp) => `${Math.round(temp)}°C`;

export const formatTime = (time) => {
    const timeStr = String(time).padStart(4, '0');
    return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
};

export const getUVLabel = (uv) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
};
