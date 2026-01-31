
import React from 'react';
import { Wind, Droplets } from 'lucide-react';

const getWindRotation = (direction) => {
    const directions = {
        'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
        'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
        'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
};

const getUVLabel = (index) => {
    if (index <= 2) return '弱';
    if (index <= 5) return '中等';
    if (index <= 7) return '强';
    if (index <= 10) return '很强';
    return '极强';
};

const getPressureLabel = (pressure) => {
    if (pressure < 1010) return '低';
    if (pressure > 1025) return '高';
    return '正常';
};

const WeatherGrid = ({ current, isDark = true, isDusk = false }) => {
    const windRotation = getWindRotation(current.wind.direction);
    const isNightTheme = isDark || isDusk;

    // Material 3 colors - handle dusk theme  
    const cardBg = isDusk ? 'rgba(60, 40, 70, 0.6)' : isDark ? 'rgba(30, 35, 48, 0.6)' : 'rgba(255, 255, 255, 0.95)';
    const textColor = isNightTheme ? '#ffffff' : '#1f2937';
    const subTextColor = isNightTheme ? '#9ca3af' : '#6b7280';
    const borderColor = isNightTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    // Improved gauge colors for better visibility
    const gaugeBgColor = isNightTheme ? '#4b5563' : '#d1d5db';
    const compassBorderColor = isNightTheme ? '#6b7280' : '#9ca3af';
    const arrowColor = isNightTheme ? '#60a5fa' : '#3b82f6'; // Blue arrow for better visibility

    // UV gauge calculations
    const uvPercent = Math.min(current.uvIndex / 11, 1);
    const uvAngle = -135 + (uvPercent * 270);

    // Pressure gauge calculations  
    const pressureNormalized = (current.pressure - 980) / (1050 - 980);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Wind */}
            <div
                className="rounded-3xl p-5 flex flex-col justify-between aspect-square shadow-lg overflow-hidden"
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            >
                <div className="text-sm flex items-center gap-2 font-medium" style={{ color: subTextColor }}>
                    <Wind size={16} /> 风况
                </div>
                <div className="mt-2 flex-1 flex items-center justify-center">
                    <div
                        className="relative w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center"
                        style={{ borderColor: compassBorderColor }}
                    >
                        <div
                            className="absolute w-full h-full flex items-center justify-center transition-transform duration-500"
                            style={{ transform: `rotate(${windRotation}deg)` }}
                        >
                            <div
                                className="w-0 h-0 border-l-[6px] border-l-transparent border-b-[14px] border-r-[6px] border-r-transparent mb-8"
                                style={{ borderBottomColor: arrowColor }}
                            ></div>
                        </div>
                        <span className="absolute text-[10px] top-1 font-bold" style={{ color: textColor }}>N</span>
                        <span className="absolute text-[10px] bottom-1 font-bold" style={{ color: textColor }}>S</span>
                        <span className="absolute text-[10px] left-1 font-bold" style={{ color: textColor }}>W</span>
                        <span className="absolute text-[10px] right-1 font-bold" style={{ color: textColor }}>E</span>
                    </div>
                </div>
                <div>
                    <div className="text-xl font-semibold" style={{ color: textColor }}>{current.wind.speed} <span className="text-xs font-normal" style={{ color: subTextColor }}>{current.wind.unit}</span></div>
                    <div className="text-xs mt-0.5" style={{ color: subTextColor }}>{current.wind.direction}</div>
                </div>
            </div>

            {/* Humidity */}
            <div
                className="rounded-3xl p-5 flex flex-col justify-between aspect-square shadow-lg overflow-hidden"
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            >
                <div className="text-sm flex items-center gap-2 font-medium" style={{ color: subTextColor }}>
                    <Droplets size={16} /> 湿度
                </div>
                <div className="mt-2 flex-1 flex items-center justify-center">
                    <div
                        className="w-10 h-20 rounded-full relative overflow-hidden"
                        style={{ backgroundColor: isNightTheme ? 'rgba(55, 65, 81, 0.5)' : 'rgba(0, 0, 0, 0.08)' }}
                    >
                        <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-b-full transition-all duration-1000"
                            style={{ height: `${current.humidity}%` }}
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="text-xl font-semibold" style={{ color: textColor }}>{current.humidity}%</div>
                    <div className="text-xs mt-0.5" style={{ color: subTextColor }}>露点{current.dewPoint}°</div>
                </div>
            </div>

            {/* UV Index - Improved visibility */}
            <div
                className="rounded-3xl p-5 flex flex-col justify-between aspect-square shadow-lg overflow-hidden"
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            >
                <div className="flex justify-between items-start">
                    <span className="text-sm font-medium" style={{ color: subTextColor }}>紫外线指数</span>
                    <span className="text-xs" style={{ color: subTextColor }}>11+</span>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                    <svg viewBox="0 0 110 110" className="w-20 h-20">
                        {/* Background circle - thicker and more visible */}
                        <circle
                            cx="55" cy="55" r="40"
                            fill="none"
                            stroke={gaugeBgColor}
                            strokeWidth="12"
                            strokeDasharray="188.5 251.3"
                            strokeDashoffset="-31.4"
                            strokeLinecap="round"
                        />
                        {/* Progress arc - brighter green */}
                        <circle
                            cx="55" cy="55" r="40"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="12"
                            strokeDasharray={`${uvPercent * 188.5} 251.3`}
                            strokeDashoffset="-31.4"
                            strokeLinecap="round"
                        />
                        {/* Indicator dot - positioned on arc */}
                        <circle
                            cx="55" cy="15" r="6"
                            fill="#fbbf24"
                            transform={`rotate(${uvAngle} 55 55)`}
                        />
                    </svg>
                </div>
                <div>
                    <div className="text-2xl font-semibold" style={{ color: textColor }}>{current.uvIndex}</div>
                    <div className="text-xs mt-1" style={{ color: subTextColor }}>{getUVLabel(current.uvIndex)}</div>
                </div>
            </div>

            {/* Pressure - Improved visibility */}
            <div
                className="rounded-3xl p-5 flex flex-col justify-between aspect-square shadow-lg overflow-hidden"
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            >
                <div className="text-sm font-medium" style={{ color: subTextColor }}>气压</div>
                <div className="flex-1 flex items-center justify-center relative">
                    <svg viewBox="0 0 120 70" className="w-28 h-20">
                        {/* Labels - positioned outside the arc */}
                        <text x="8" y="62" fill={textColor} fontSize="10" fontWeight="bold">低</text>
                        <text x="102" y="62" fill={textColor} fontSize="10" fontWeight="bold">高</text>
                        {/* Background arc - thicker */}
                        <path
                            d="M 20 55 A 40 40 0 0 1 100 55"
                            fill="none"
                            stroke={gaugeBgColor}
                            strokeWidth="10"
                            strokeLinecap="round"
                        />
                        {/* Progress arc - brighter blue */}
                        <path
                            d="M 20 55 A 40 40 0 0 1 100 55"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${pressureNormalized * 126} 126`}
                        />
                        {/* Needle indicator - positioned on the arc */}
                        <circle
                            cx="60" cy="15" r="5"
                            fill="#fbbf24"
                            transform={`rotate(${-90 + pressureNormalized * 180} 60 55)`}
                        />
                        {/* Center pivot */}
                        <circle cx="60" cy="55" r="4" fill={textColor} />
                    </svg>
                </div>
                <div>
                    <div className="text-2xl font-semibold" style={{ color: textColor }}>{current.pressure.toLocaleString()}</div>
                    <div className="text-xs mt-1" style={{ color: subTextColor }}>毫巴</div>
                </div>
            </div>
        </div>
    );
};

export default WeatherGrid;
