
import React from 'react';

const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

const SunMoon = ({ sunrise, sunset, selectedHour = null, isDark = true, isDusk = false }) => {
    // Use selectedHour if provided, otherwise use current time
    const currentMinutes = selectedHour !== null
        ? selectedHour * 60
        : new Date().getHours() * 60 + new Date().getMinutes();
    const isNightTheme = isDark || isDusk;

    const sunriseMinutes = parseTime(sunrise);
    const sunsetMinutes = parseTime(sunset);

    // Calculate if it's day or night based on selected time
    const isDay = currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes;

    // Calculate progress
    let currentPercent = 0;
    if (isDay) {
        const total = sunsetMinutes - sunriseMinutes;
        const current = currentMinutes - sunriseMinutes;
        currentPercent = (current / total) * 100;
    } else {
        // Night progress
        const nightLength = (24 * 60) - (sunsetMinutes - sunriseMinutes);
        if (currentMinutes > sunsetMinutes) {
            const elapsed = currentMinutes - sunsetMinutes;
            currentPercent = (elapsed / nightLength) * 100;
        } else if (currentMinutes < sunriseMinutes) {
            const timeAfterSunset = (24 * 60) - sunsetMinutes;
            const totalElapsed = timeAfterSunset + currentMinutes;
            currentPercent = (totalElapsed / nightLength) * 100;
        }
    }

    const icon = isDay ? '☀️' : '🌙';
    const labelStart = isDay ? '日出' : '日落';
    const labelEnd = isDay ? '日落' : '日出';
    const timeStart = isDay ? sunrise : sunset;
    const timeEnd = isDay ? sunset : sunrise;

    const textColor = isNightTheme ? '#ffffff' : '#1f2937';
    const subTextColor = isNightTheme ? '#9ca3af' : '#6b7280';
    const barBg = isNightTheme ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const barFill = isDusk ? '#a78bfa' : isDay ? '#fbbf24' : '#60a5fa'; // Purple for dusk

    return (
        <div className="flex flex-col h-full justify-center">
            {/* Top Labels */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <div className="text-xs mb-0.5" style={{ color: subTextColor }}>{labelStart}</div>
                    <div className="text-xl font-semibold" style={{ color: textColor }}>{timeStart}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs mb-0.5" style={{ color: subTextColor }}>{labelEnd}</div>
                    <div className="text-xl font-semibold" style={{ color: textColor }}>{timeEnd}</div>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative h-12 flex items-center">
                {/* Background Line */}
                <div
                    className="absolute w-full h-1.5 rounded-full"
                    style={{ backgroundColor: barBg }}
                ></div>

                {/* Filled Progress Line */}
                <div
                    className="absolute h-1.5 rounded-full transition-all duration-500"
                    style={{
                        width: `${currentPercent}%`,
                        backgroundColor: barFill
                    }}
                ></div>

                {/* Moving Icon */}
                <div
                    className="absolute transition-all duration-500 flex items-center justify-center"
                    style={{
                        left: `${Math.min(Math.max(currentPercent, 5), 95)}%`,
                        transform: 'translateX(-50%)',
                        fontSize: '24px'
                    }}
                >
                    {icon}
                </div>
            </div>

            {/* Status Text */}
            <div className="text-center text-xs mt-1" style={{ color: subTextColor }}>
                {isDay ? '白天' : '夜间'}
            </div>
        </div>
    );
};

export default SunMoon;
