// ==========================================
// 天气历史应用配置文件
// ==========================================

export const config = {
    location: {
        name: "beijing",
    },

    // 'today_in_history' 或 'specific_dates'
    historyMode: 'specific_dates',

    specificDates: ['2001-04-22'],

    theme: {
        duskWindow: 0.5,          // 黄昏时间窗口（小时）
        dynamicBackground: true,  // 动态背景
        weatherEffects: true,     // 天气特效
    },
};

// ==========================================
// 示例天气数据 - 与 mockData.js 格式一致
// ==========================================
export const exampleWeatherData = [

    {
        "date": "2001-04-22",
        "solarTerm": "谷雨",
        "lunarDate": "己巳年三月廿二",
        "moonPhase": "Waxing Crescent",
        "dailySummary": "111111"
        "sun": { "sunrise": "05:50", "sunset": "18:43" },
        "hourlyTemp": [8.4, 7.6, 9.1, 6.9, 7.2, 6.8, 5.0, 7.4, 11.4, 14.3, 16.1, 17.4, 18.4, 19.3, 19.7, 19.8, 19.7, 19.1, 18.2, 16.8, 15.3, 14.3, 13.1, 12.3],
        "hourlyHumidity": [87, 89, 81, 90, 89, 90, 95, 91, 79, 64, 53, 48, 45, 43, 43, 44, 44, 48, 55, 62, 67, 73, 76, 81],
        "hourlyRadiation": [0, 0, 0, 0, 0, 0, 0, 71, 258, 468, 656, 752, 801, 867, 774, 693, 501, 262, 94, 12, 0, 0, 0, 0],
        "hourlyCloudCover": [0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 45, 99, 99, 54, 93, 99, 100, 100, 100, 100, 100, 97, 95, 68],
        "hourlyPrecip": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "hourlyWindSpeed": [9.7, 9.2, 5.9, 5.9, 4.8, 5.0, 7.3, 6.2, 4.0, 4.1, 5.5, 8.0, 6.8, 7.6, 9.2, 10.3, 10.0, 6.6, 5.4, 2.3, 5.2, 5.5, 5.9, 5.9],
        "hourlyPressure": [1011, 1011, 1012, 1011, 1011, 1011, 1011, 1012, 1012, 1012, 1011, 1011, 1011, 1010, 1009, 1008, 1008, 1009, 1009, 1010, 1010, 1011, 1011, 1010],
        "hourlyUVIndex": [0, 0, 0, 0, 0, 0, 0, 0.4, 1.8, 3.2, 4.5, 5.2, 5.6, 6.0, 5.4, 4.8, 3.5, 1.8, 0.6, 0.1, 0, 0, 0, 0],
        "hourlyVisibility": [12, 10, 12, 10, 10, 8, 8, 12, 18, 22, 24, 24, 24, 24, 22, 20, 20, 18, 18, 18, 18, 18, 15, 12]
    },

];

// 节气/节日 API
export const fetchCalendarInfo = async (date) => {
    try {
        const res = await fetch(`https://timor.tech/api/holiday/info/${date}`);
        const data = await res.json();
        return data.code === 0 ? { solarTerm: data.type?.name, lunarDate: data.holiday?.name, isHoliday: data.holiday?.holiday } : {};
    } catch { return {}; }
};
