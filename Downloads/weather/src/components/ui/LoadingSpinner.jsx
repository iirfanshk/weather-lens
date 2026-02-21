import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Fetching weather...' }) => (
    <div className="flex flex-col items-center justify-center py-28 gap-4 text-white/50">
        <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
            <div className="absolute inset-0 w-12 h-12 blur-xl bg-blue-400/20 animate-pulse" />
        </div>
        <span className="text-sm font-medium tracking-wide animate-pulse">{message}</span>
    </div>
);

export default LoadingSpinner;
