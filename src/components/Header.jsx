
import React from 'react';
import { MapPin, Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

const Header = ({ current, isDark = true, isDusk = false }) => {
    // M3 Design colors - handle dusk theme
    const cardBg = isDusk ? 'rgba(60, 40, 70, 0.7)' : isDark ? 'rgba(30, 35, 48, 0.6)' : 'rgba(255, 255, 255, 0.95)';
    const textColor = isDark || isDusk ? '#ffffff' : '#1f2937';
    const subTextColor = isDark || isDusk ? '#9ca3af' : '#6b7280';
    const pillBg = isDark || isDusk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    const pillBorder = isDark || isDusk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    // Dynamic icon for current condition
    const getIcon = () => {
        const cond = current.condition.toLowerCase();
        if (cond.includes('snow')) return <Snowflake size={32} className="text-blue-200" />;
        if (cond.includes('rain')) return <CloudRain size={32} className="text-blue-400" />;
        if (cond.includes('cloud')) return <Cloud size={32} className="text-gray-400" />;
        return <Sun size={32} className="text-yellow-400" />;
    };

    return (
        <div
            className="rounded-3xl p-6 shadow-xl backdrop-blur-md overflow-hidden"
            style={{
                backgroundColor: cardBg,
                border: `1px solid ${isDark || isDusk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
            }}
        >
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
                <div
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-full"
                    style={{ backgroundColor: pillBg, borderColor: pillBorder, borderWidth: 1, color: subTextColor }}
                >
                    <MapPin size={16} className="text-blue-400" />
                    <span className="truncate max-w-[180px] font-medium" style={{ color: textColor }}>{current.location || "历史位置"}</span>
                </div>

                <div className="text-sm font-medium tracking-wide" style={{ color: subTextColor }}>
                    {current.date} {current.time}
                </div>
            </div>

            {/* Solar Term Display */}
            {current.solarTerm && (
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#3b82f6' }}>
                    {current.solarTerm} {current.lunarDate && `· ${current.lunarDate}`}
                </div>
            )}

            {/* Main Temperature Display */}
            <div className="flex items-start justify-between">
                <div>
                    <span
                        className="text-8xl font-bold tracking-tighter leading-[0.85]"
                        style={{ color: textColor }}
                    >{Math.round(current.temp)}°</span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-semibold flex items-center gap-2 justify-end" style={{ color: textColor }}>
                        {getIcon()}
                        {current.condition}
                    </div>
                    <div className="text-sm mt-1" style={{ color: subTextColor }}>
                        体感 {Math.round(current.feelsLike)}°
                    </div>
                </div>
            </div>

            {/* High/Low */}
            <div className="flex gap-4 mt-4">
                <div
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: pillBg, color: textColor }}
                >
                    最高: {Math.round(current.high)}°
                </div>
                <div
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: pillBg, color: textColor }}
                >
                    最低: {Math.round(current.low)}°
                </div>
            </div>

            {/* Daily Summary */}
            {current.dailySummary && (
                <div className="mt-4 text-sm leading-relaxed" style={{ color: subTextColor }}>
                    {current.dailySummary}
                </div>
            )}
        </div>
    );
};

export default Header;
