
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Umbrella, Wind, Droplets } from 'lucide-react';

const DetailsGraph = ({ hourly, isDark = true, isDusk = false }) => {
    const [activeTab, setActiveTab] = useState('precipChance');
    const isNightTheme = isDark || isDusk;

    const chartData = hourly.slice(0, 10).map(h => ({
        time: h.time,
        value: activeTab === 'precipChance' ? (h.precipChance || 0) :
            activeTab === 'wind' ? (h.windSpeed || 0) :
                (h.humidity || 0)
    }));

    const getTabLabel = (key) => {
        switch (key) {
            case 'precipChance': return '降水概率';
            case 'wind': return '风况';
            case 'humidity': return '湿度';
            default: return '';
        }
    };

    // Material 3 colors - handle dusk
    const cardBg = isDusk ? 'rgba(60, 40, 70, 0.6)' : isDark ? 'rgba(30, 35, 48, 0.5)' : 'rgba(255, 255, 255, 0.9)';
    const cardBorder = isNightTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isNightTheme ? '#ffffff' : '#1f2937';
    const subTextColor = isNightTheme ? '#9ca3af' : '#4b5563';
    const chartColor = isDusk ? '#a78bfa' : isDark ? '#60a5fa' : '#3b82f6';
    const tooltipBg = isNightTheme ? '#1f2937' : '#ffffff';
    const tooltipBorder = isNightTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const buttonBg = isNightTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    return (
        <div
            className="backdrop-blur-md rounded-3xl p-6 shadow-xl transition-all overflow-hidden"
            style={{ backgroundColor: cardBg, borderColor: cardBorder, borderWidth: 1 }}
        >
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                <button
                    onClick={() => setActiveTab('precipChance')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'precipChance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : ''}`}
                    style={activeTab !== 'precipChance' ? { backgroundColor: buttonBg, color: subTextColor } : {}}>
                    <Umbrella size={16} /> 降水概率
                </button>
                <button
                    onClick={() => setActiveTab('wind')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'wind' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : ''}`}
                    style={activeTab !== 'wind' ? { backgroundColor: buttonBg, color: subTextColor } : {}}>
                    <Wind size={16} /> 风况
                </button>
                <button
                    onClick={() => setActiveTab('humidity')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'humidity' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : ''}`}
                    style={activeTab !== 'humidity' ? { backgroundColor: buttonBg, color: subTextColor } : {}}>
                    <Droplets size={16} /> 湿度
                </button>
            </div>

            <div className="mb-4">
                <div className="text-sm mb-1" style={{ color: subTextColor }}>今日{getTabLabel(activeTab)}</div>
                <div className="text-2xl font-bold tracking-tight" style={{ color: textColor }}>
                    {activeTab === 'precipChance' ? '0.0 毫米' :
                        activeTab === 'wind' ? '3 km/h' : '79%'}
                </div>
            </div>

            {/* Chart */}
            <div style={{ width: '100%', height: '192px', minHeight: '192px' }}>
                <ResponsiveContainer width="100%" height={192}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
                                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12, fill: subTextColor }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: textColor, borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: chartColor }}
                            cursor={{ stroke: isNightTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DetailsGraph;
