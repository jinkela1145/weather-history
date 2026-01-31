
import React, { useRef, useEffect } from 'react';

// Emoji mapping for weather conditions
const getWeatherEmoji = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower === 'sun') return '☀️';
    if (conditionLower.includes('partly cloudy') || conditionLower === 'cloud-sun') return '⛅';
    if (conditionLower.includes('cloudy') || conditionLower === 'cloud') return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('clear')) return '🌙';
    return '☀️';
};

const HourlyForecast = ({ data, selectedIndex, onHourSelect, isDark = true, isDusk = false }) => {
    const scrollRef = useRef(null);
    const isNightTheme = isDark || isDusk;

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, []);

    // Material 3 colors - handle dusk
    const cardBg = isDusk ? 'rgba(60, 40, 70, 0.6)' : isDark ? 'rgba(30, 35, 48, 0.6)' : 'rgba(255, 255, 255, 0.95)';
    const selectedBg = isDusk ? 'rgba(147, 51, 234, 0.3)' : isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)';
    const textColor = isNightTheme ? '#e5e7eb' : '#1f2937';
    const subTextColor = isNightTheme ? '#9ca3af' : '#6b7280';
    const surfaceVariant = isNightTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
    const borderColor = isNightTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    return (
        <div
            className="rounded-3xl p-6 shadow-lg transition-colors duration-300 overflow-hidden"
            style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`
            }}
        >
            <div className="text-sm font-medium mb-5" style={{ color: subTextColor }}>
                <span>每小时天气预报</span>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 pb-3 -mx-2 px-2 snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {data.map((hour, i) => {
                    const isSelected = i === selectedIndex;
                    const emoji = getWeatherEmoji(hour.condition);

                    return (
                        <div
                            key={i}
                            onClick={() => onHourSelect(i)}
                            className={`flex flex-col items-center flex-shrink-0 space-y-3 snap-center py-4 px-3 rounded-2xl transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-400' : 'hover:scale-105'}`}
                            style={{
                                backgroundColor: isSelected ? selectedBg : (i % 2 === 0 ? surfaceVariant : 'transparent'),
                                minWidth: '70px'
                            }}
                        >
                            <span className="text-sm font-semibold" style={{ color: textColor }}>{hour.temp}°</span>
                            <span className="text-2xl">{emoji}</span>
                            <span className="text-xs font-medium" style={{ color: subTextColor }}>{hour.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HourlyForecast;
