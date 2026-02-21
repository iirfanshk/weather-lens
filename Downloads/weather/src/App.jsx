import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import WeatherPage from './pages/WeatherPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <WeatherPage />
    </ThemeProvider>
  );
}

export default App;
