
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Emoji mapping for weather conditions
const getWeatherEmoji = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower === 'sun' || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('partly cloudy') || conditionLower === 'cloud-sun') return '⛅';
    if (conditionLower.includes('cloudy') || conditionLower === 'cloud') return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    return '☀️';
};

const calculateTempBar = (low, high, minTemp = -10, maxTemp = 20) => {
    const range = maxTemp - minTemp;
    const startPercent = ((low - minTemp) / range) * 100;
    const widthPercent = ((high - low) / range) * 100;
    return {
        marginLeft: `${Math.max(0, Math.min(100, startPercent))}%`,
        width: `${Math.max(8, Math.min(100 - startPercent, widthPercent))}%`
    };
};

const formatDate = (dateStr) => {
    try {
        const date = new Date(dateStr);
        const options = { month: 'short', day: 'numeric', weekday: 'short' };
        return date.toLocaleDateString('zh-CN', options);
    } catch {
        return dateStr;
    }
};

const getYear = (dateStr) => {
    try {
        return new Date(dateStr).getFullYear();
    } catch {
        return '未知';
    }
};

const DailyForecast = ({ data, selectedDate, onDaySelect, isDark = true, isDusk = false }) => {
    const scrollRef = useRef(null);
    const isNightTheme = isDark || isDusk;

    // Group data by year
    const groupedByYear = useMemo(() => {
        const groups = {};
        data.forEach((day, originalIndex) => {
            const year = getYear(day.date);
            if (!groups[year]) {
                groups[year] = [];
            }
            groups[year].push({ ...day, originalIndex });
        });
        // Sort years in descending order (newest first)
        return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
    }, [data]);

    // Track which years are expanded (default: all expanded)
    const [expandedYears, setExpandedYears] = useState(() => {
        const years = {};
        groupedByYear.forEach(([year]) => {
            years[year] = true;
        });
        return years;
    });

    const toggleYear = (year) => {
        setExpandedYears(prev => ({
            ...prev,
            [year]: !prev[year]
        }));
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            if (el.scrollHeight > el.clientHeight) {
                e.stopPropagation();
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: true });
        return () => el.removeEventListener('wheel', handleWheel);
    }, []);

    // Material 3 colors - handle dusk
    const cardBg = isDusk ? 'rgba(60, 40, 70, 0.6)' : isDark ? 'rgba(30, 35, 48, 0.6)' : 'rgba(255, 255, 255, 0.95)';
    const textColor = isNightTheme ? '#e5e7eb' : '#1f2937';
    const subTextColor = isNightTheme ? '#9ca3af' : '#6b7280';
    const surfaceVariant = isNightTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
    const barBg = isNightTheme ? 'rgba(55, 65, 81, 0.5)' : 'rgba(0, 0, 0, 0.08)';
    const selectedBg = isDusk ? 'rgba(147, 51, 234, 0.2)' : isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)';
    const yearHeaderBg = isNightTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
    const borderColor = isNightTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    return (
        <div
            className="rounded-3xl p-5 shadow-lg flex flex-col h-full overflow-hidden"
            style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`
            }}
        >
            <div className="text-sm font-medium mb-4 flex-shrink-0" style={{ color: subTextColor }}>
                <span>历史天气记录</span>
            </div>

            <div
                ref={scrollRef}
                className="space-y-2 overflow-y-auto flex-1 pr-1"
                style={{ scrollbarWidth: 'thin', scrollbarColor: isDark ? 'rgba(255,255,255,0.1) transparent' : 'rgba(0,0,0,0.1) transparent' }}
            >
                {groupedByYear.map(([year, days]) => (
                    <div key={year} className="mb-2">
                        {/* Year Header - Collapsible */}
                        <div
                            onClick={() => toggleYear(year)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all hover:opacity-80"
                            style={{ backgroundColor: yearHeaderBg }}
                        >
                            {expandedYears[year] ? (
                                <ChevronDown size={16} style={{ color: subTextColor }} />
                            ) : (
                                <ChevronRight size={16} style={{ color: subTextColor }} />
                            )}
                            <span className="text-sm font-semibold" style={{ color: textColor }}>{year}年</span>
                            <span className="text-xs" style={{ color: subTextColor }}>({days.length}条记录)</span>
                        </div>

                        {/* Days in this year */}
                        {expandedYears[year] && (
                            <div className="space-y-1 mt-1 ml-2">
                                {days.map((day) => {
                                    const emoji = getWeatherEmoji(day.condition);
                                    const barStyle = calculateTempBar(day.low, day.high);
                                    const isSelected = selectedDate === day.date;

                                    return (
                                        <div
                                            key={day.originalIndex}
                                            onClick={() => onDaySelect && onDaySelect(day.originalIndex)}
                                            className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all cursor-pointer hover:scale-[1.01] ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                                            style={{ backgroundColor: isSelected ? selectedBg : 'transparent' }}
                                        >
                                            {/* Date */}
                                            <span className="text-sm w-24 font-medium truncate" style={{ color: textColor }}>{formatDate(day.date)}</span>

                                            {/* Weather emoji */}
                                            <div className="w-8 flex justify-center">
                                                <span className="text-lg">{emoji}</span>
                                            </div>

                                            {/* Temperature bar and values */}
                                            <div className="flex items-center gap-2 text-sm font-medium flex-1 justify-end">
                                                <span className="w-7 text-right" style={{ color: subTextColor }}>{day.low}°</span>
                                                <div className="w-20 h-1.5 rounded-full overflow-hidden relative" style={{ backgroundColor: barBg }}>
                                                    <div
                                                        className="h-full rounded-full absolute top-0"
                                                        style={{
                                                            ...barStyle,
                                                            background: 'linear-gradient(to right, #60a5fa, #34d399, #fbbf24)'
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="w-7 text-left font-semibold" style={{ color: textColor }}>{day.high}°</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyForecast;
