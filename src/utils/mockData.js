
import { format } from 'date-fns';
import { config, exampleWeatherData } from '../config';

// Helper to calculate solar position/radiation (simplified)
const calculateRadiationRatio = (hour, sunriseStr, sunsetStr) => {
  const sunrise = parseInt(sunriseStr.split(':')[0]) + parseInt(sunriseStr.split(':')[1]) / 60;
  const sunset = parseInt(sunsetStr.split(':')[0]) + parseInt(sunsetStr.split(':')[1]) / 60;

  if (hour < sunrise || hour > sunset) return 0;

  const dayLength = sunset - sunrise;
  const normalizedTime = ((hour - sunrise) / dayLength) * Math.PI;
  return Math.sin(normalizedTime);
};

// Core Inference Logic
export const deriveCondition = (precip, cloudCover, radiationRatio, temp) => {
  if (precip > 0) {
    if (temp <= 0) {
      return precip > 2.5 ? 'Heavy Snow' : 'Light Snow';
    }
    return precip > 5 ? 'Heavy Rain' : 'Light Rain';
  }

  if (radiationRatio <= 0) {
    if (cloudCover < 20) return 'Clear';
    if (cloudCover < 60) return 'Partly Cloudy';
    return 'Cloudy';
  }

  if (radiationRatio > 0.6) {
    if (cloudCover < 30) return 'Sunny';
    return 'Partly Cloudy';
  }

  if (cloudCover < 30) return 'Sunny';
  if (cloudCover < 70) return 'Partly Cloudy';

  return 'Cloudy';
};

// 使用 config.js 的数据
// exampleWeatherData 是一个嵌套数组，第一层是日期组，第二层是每天的数据
export const weatherHistory = exampleWeatherData.flat();

export const processDailyData = (dayData) => {
  const conditions = dayData.hourlyTemp.map((temp, i) => {
    const radiation = dayData.hourlyRadiation[i];
    const cloud = dayData.hourlyCloudCover[i];
    const precip = dayData.hourlyPrecip[i];
    const actualRadRatio = radiation / 1000;

    return deriveCondition(precip, cloud, actualRadRatio, temp);
  });

  return { ...dayData, hourlyConditions: conditions };
};

export const getSmartHistoryData = () => {
  const today = new Date();
  const currentMonthStr = format(today, 'MM-dd');

  // 根据 config 的 historyMode 来决定如何查找数据
  if (config.historyMode === 'specific_dates') {
    // 查找指定日期的数据
    const targetDate = config.specificDates[0];
    const match = weatherHistory.find(d => d.date === targetDate);
    if (match) {
      return processDailyData(match);
    }
  }

  // today_in_history 模式：匹配月-日
  const match = weatherHistory.find(d => d.date.endsWith(currentMonthStr));
  if (match) {
    return processDailyData(match);
  }

  // Fallback: 返回第一条数据
  return processDailyData(weatherHistory[0]);
};

// 获取所有历史数据（用于 DailyForecast）
export const getAllHistoryData = () => {
  return weatherHistory.map(d => processDailyData(d));
};
