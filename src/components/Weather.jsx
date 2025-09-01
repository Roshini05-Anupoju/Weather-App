import React, { useState, useRef, useEffect } from 'react';
import './Weather.css';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import WeatherDetails from './WeatherDetails';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("default");
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false); 

  const allIcons = {
    "01d": clear_icon, "01n": clear_icon,
    "02d": cloud_icon, "02n": cloud_icon,
    "03d": cloud_icon, "03n": cloud_icon,
    "04d": drizzle_icon, "04n": drizzle_icon,
    "09d": rain_icon, "09n": rain_icon,
    "10d": rain_icon, "10n": rain_icon,
    "13d": snow_icon, "13n": snow_icon,
  };

  const getTheme = (main, iconCode) => {
    const isNight = iconCode?.includes('n');
    switch (main) {
      case 'Clear': return isNight ? 'clear-night' : 'clear';
      case 'Clouds': return 'clouds';
      case 'Rain': return 'rain';
      case 'Drizzle': return 'drizzle';
      case 'Snow': return 'snow';
      case 'Thunderstorm': return 'thunder';
      default: return 'default';
    }
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    setLoading(true); 
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "404") {
        setError("City not found. Try another name.");
        setWeatherData(null);
        setLoading(false);
        return;
      }

      const icon = allIcons[data.weather[0]?.icon] || clear_icon;

      setWeatherData({
        humidity: data.main?.humidity ?? 0,
        windSpeed: data.wind?.speed ?? 0,
        temperature: Math.round(data.main?.temp ?? 0),
        feelsLike: Math.round(data.main?.feels_like ?? 0),
        location: `${data.name ?? 'Unknown'}, ${data.sys?.country ?? ''}`,
        sunrise: data.sys?.sunrise ?? null,
        sunset: data.sys?.sunset ?? null,
        rain: data.rain?.["1h"] ?? 0,
        icon: icon,
      });

      setTheme(getTheme(data.weather[0]?.main, data.weather[0]?.icon));
      setError("");

     
      const msg = new SpeechSynthesisUtterance(
        `The weather in ${data.name} is ${data.weather[0]?.description}, 
        temperature ${Math.round(data.main?.temp)} ${unit === "metric" ? "Celsius" : "Fahrenheit"}`
      );
      window.speechSynthesis.speak(msg);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Something went wrong. Please try again.");
      setTheme("default");
    }
    setLoading(false); 
  };

  const handleSearch = (city) => {
    if (city) {
      fetchWeather(city);
    } else {
      setError("Please enter a city name.");
    }
  };

  useEffect(() => {
    fetchWeather("London"); 
  }, [unit]); 

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="Weather">
      <div className={`bg-layer theme-${theme}`} key={theme} />
      <div className="content">
        <SearchBar inputRef={inputRef} onSearch={handleSearch} />
        {error && <p className="error">{error}</p>}

        <button onClick={toggleUnit} className="unit-btn">
          {unit === "metric" ? "Switch to °F" : "Switch to °C"}
        </button>

        {loading && <div className="spinner"></div>} 

        {weatherData && !loading && (
          <>
            <WeatherCard
              icon={weatherData.icon}
              temperature={weatherData.temperature}
              location={weatherData.location}
              unit={unit} 
            />
            <WeatherDetails
              humidity={weatherData.humidity}
              windSpeed={weatherData.windSpeed}
              feelsLike={weatherData.feelsLike}
              sunrise={weatherData.sunrise}
              sunset={weatherData.sunset}
              rain={weatherData.rain}
              unit={unit} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
