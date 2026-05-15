import { CONFIG } from "../constants/config";

export interface WeatherData {
  temp: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
  rainChance: number;
  humidity: number;
}

export interface ForecastDay {
  date: string;
  day: string;
  temp: number;
  windSpeed: number;
  rainChance: number;
  description: string;
  icon: string;
}

export type RiskLevel = "low" | "moderate" | "high";

export interface RiskAssessment {
  level: RiskLevel;
  emoji: string;
  color: string;
  message: string;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(
    `${CONFIG.OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric`
  );
  const data = await res.json();
  console.log("Weather data:", JSON.stringify(data));
  return {
    temp: Math.round(data.main.temp),
    windSpeed: Math.round(data.wind.speed * 2.237),
    windDeg: data.wind.deg,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    rainChance: data.rain ? Math.round((data.rain["1h"] ?? 0) * 100) : 0,
    humidity: data.main.humidity,
  };
}

export async function getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const res = await fetch(
    `${CONFIG.OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric`
  );
  const data = await res.json();
  const days: { [key: string]: any[] } = {};
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });
  return Object.entries(days).slice(0, 5).map(([date, items]) => {
    const midday = items[Math.floor(items.length / 2)];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const d = new Date(date);
    return {
      date,
      day: dayNames[d.getDay()],
      temp: Math.round(midday.main.temp),
      windSpeed: Math.round(midday.wind.speed * 2.237),
      rainChance: Math.round((midday.pop ?? 0) * 100),
      description: midday.weather[0].description,
      icon: midday.weather[0].icon,
    };
  });
}

export function assessRisk(weather: WeatherData): RiskAssessment {
  if (weather.windSpeed > 25 || weather.rainChance > 80) {
    return {
      level: "high",
      emoji: "🔴",
      color: "#EF4444",
      message: "Poor conditions expected. Consider reducing stock levels significantly.",
    };
  }
  if (weather.windSpeed > 15 || weather.rainChance > 50) {
    return {
      level: "moderate",
      emoji: "⚠️",
      color: "#F59E0B",
      message: "Mixed conditions. Prepare for reduced footfall and adjust stock accordingly.",
    };
  }
  return {
    level: "low",
    emoji: "✅",
    color: "#22C55E",
    message: "Great conditions. High footfall expected - make sure you have enough stock!",
  };
}