
import React, { useState, useEffect, useMemo } from 'react';
import { getSmartHistoryData, weatherHistory, processDailyData } from '../utils/mockData';
import { config } from '../config';
import Header from './Header';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import WeatherGrid from './WeatherGrid';
import SunMoon from './SunMoon';
import DetailsGraph from './DetailsGraph';
import WeatherEffects from './WeatherEffects';

const WeatherPage = () => {
    // 1. Load History Data
    const [dayData, setDayData] = useState(() => getSmartHistoryData());

    // 2. Selection State (Default to current hour)
    const [selectedHour, setSelectedHour] = useState(() => {
        const h = new Date().getHours();
        return h;
    });

    // 3. Derived Data for UI
    const currentData = useMemo(() => {
        if (!dayData) return null;
        const i = selectedHour;
        return {
            location: config.location.name,
            date: dayData.date,
            time: `${i.toString().padStart(2, '0')}:00`,
            temp: dayData.hourlyTemp[i],
            condition: dayData.hourlyConditions[i],
            humidity: dayData.hourlyHumidity[i],
            radiation: dayData.hourlyRadiation[i],
            wind: {
                speed: dayData.hourlyWindSpeed[i],
                direction: 'N',
                unit: 'km/h'
            },
            pressure: dayData.hourlyPressure[i],
            uvIndex: dayData.hourlyUVIndex ? dayData.hourlyUVIndex[i] : 0,
            visibility: dayData.hourlyVisibility ? dayData.hourlyVisibility[i] : 10,
            dewPoint: -3,
            feelsLike: dayData.hourlyTemp[i],
            high: Math.max(...dayData.hourlyTemp),
            low: Math.min(...dayData.hourlyTemp),
            sunrise: dayData.sun.sunrise,
            sunset: dayData.sun.sunset,
            solarTerm: dayData.solarTerm,
            lunarDate: dayData.lunarDate,
            dailySummary: dayData.dailySummary
        };
    }, [dayData, selectedHour]);

    // 4. Transform for HourlyForecast Component
    const hourlyForecastData = useMemo(() => {
        if (!dayData) return [];
        return dayData.hourlyTemp.map((temp, i) => ({
            time: `${i.toString().padStart(2, '0')}:00`,
            temp: temp,
            condition: dayData.hourlyConditions[i],
            precipChance: dayData.hourlyPrecip ? dayData.hourlyPrecip[i] * 10 : 0,
            humidity: dayData.hourlyHumidity ? dayData.hourlyHumidity[i] : 50,
            windSpeed: dayData.hourlyWindSpeed ? dayData.hourlyWindSpeed[i] : 10
        }));
    }, [dayData]);

    // 4b. Transform weatherHistory for DailyForecast
    const dailyData = useMemo(() => {
        return weatherHistory.map(d => ({
            date: d.date,
            high: Math.round(Math.max(...d.hourlyTemp)),
            low: Math.round(Math.min(...d.hourlyTemp)),
            condition: d.dailySummary || 'Varied'
        }));
    }, []);

    const handleDaySelect = (index) => {
        const newData = processDailyData(weatherHistory[index]);
        setDayData(newData);
        setSelectedHour(12); // Reset to noon
    };

    // 5. Theme & Effects Logic
    const [themeState, setThemeState] = useState({ isDark: false, isDusk: false, isDay: true });

    useEffect(() => {
        if (!currentData) return;

        const parseTime = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h + m / 60;
        };

        const currentT = selectedHour;
        const sunriseT = parseTime(currentData.sunrise);
        const sunsetT = parseTime(currentData.sunset);

        const isDusk = Math.abs(currentT - sunriseT) <= 0.5 || Math.abs(currentT - sunsetT) <= 0.5;
        const isDay = currentT >= sunriseT && currentT <= sunsetT;

        setThemeState({
            isDark: !isDay && !isDusk,
            isDusk: isDusk,
            isDay: isDay
        });
    }, [selectedHour, currentData]);

    // Colors based on theme
    const bgColor = themeState.isDark ? '#0b131e' : themeState.isDusk ? '#2a1b2e' : '#f0f4f8';
    const textColor = themeState.isDark || themeState.isDusk ? '#ffffff' : '#1a1a2e';
    const subTextColor = themeState.isDark || themeState.isDusk ? '#9ca3af' : '#4b5563';

    // Component Styles - also handle dusk theme
    const cardBg = themeState.isDusk ? 'rgba(60, 40, 70, 0.7)' : themeState.isDark ? 'rgba(30, 35, 48, 0.5)' : 'rgba(255, 255, 255, 0.9)';
    const cardBorder = themeState.isDark || themeState.isDusk ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)';

    return (
        <div
            className="min-h-screen p-4 md:p-8 lg:p-12 transition-all duration-1000 relative overflow-hidden"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {/* Background Effects Layer */}
            <WeatherEffects
                condition={currentData.condition}
                isDay={themeState.isDay}
                isDusk={themeState.isDusk}
            />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10">

                {/* Left Column: Current Weather */}
                <div className="lg:col-span-4 space-y-6">
                    <Header current={currentData} isDark={themeState.isDark} isDusk={themeState.isDusk} />

                    <div className="hidden lg:block space-y-6">
                        <div
                            className="backdrop-blur-md rounded-3xl p-6 shadow-xl"
                            style={{ backgroundColor: cardBg, borderColor: cardBorder, borderWidth: 1 }}
                        >
                            <div className="text-sm font-medium mb-4" style={{ color: subTextColor }}>当前天气状况</div>
                            <WeatherGrid current={currentData} isDark={themeState.isDark} isDusk={themeState.isDusk} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Forecasts & Details */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Hourly Forecast */}
                    <HourlyForecast
                        data={hourlyForecastData}
                        selectedIndex={selectedHour}
                        onHourSelect={setSelectedHour}
                        isDark={themeState.isDark}
                        isDusk={themeState.isDusk}
                    />

                    {/* Bottom section: Daily on left, SunMoon + Details on right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Daily Forecast - half width */}
                        <div className="md:col-span-1">
                            <DailyForecast
                                data={dailyData}
                                selectedDate={dayData.date}
                                onDaySelect={handleDaySelect}
                                isDark={themeState.isDark}
                                isDusk={themeState.isDusk}
                            />
                        </div>

                        {/* Right side: SunMoon above Details */}
                        <div className="md:col-span-1 space-y-6">
                            {/* Sun Cycle */}
                            <div
                                className="backdrop-blur-md rounded-3xl p-6 shadow-xl"
                                style={{ backgroundColor: cardBg, borderColor: cardBorder, borderWidth: 1 }}
                            >
                                <div className="flex items-center gap-2 text-sm mb-4" style={{ color: subTextColor }}>
                                    <span>日出和日落</span>
                                </div>
                                <SunMoon
                                    sunrise={currentData.sunrise}
                                    sunset={currentData.sunset}
                                    selectedHour={selectedHour}
                                    isDark={themeState.isDark}
                                    isDusk={themeState.isDusk}
                                />
                            </div>

                            {/* Details Graph */}
                            <div>
                                <div className="text-sm font-medium mb-2" style={{ color: subTextColor }}>每小时详细信息</div>
                                <DetailsGraph hourly={hourlyForecastData} isDark={themeState.isDark} isDusk={themeState.isDusk} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WeatherPage;
