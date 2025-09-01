import React from 'react';
import HumidityIcon from '../assets/humidity.png';
import WindIcon from '../assets/wind.png';
import SunriseIcon from '../assets/sunrise.png';
import SunsetIcon from '../assets/sunset.png';
import FeelsLikeIcon from '../assets/feelslike.png';
import RainIcon from '../assets/rain.png';

const WeatherDetails = ({ 
  humidity, 
  windSpeed, 
  sunrise, 
  sunset, 
  feelsLike, 
  rain,
  unit
}) => {
  const sunriseTime = sunrise ? new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
  const sunsetTime = sunset ? new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

  return (
    <div className="weather-data">

      <div className="col">
        <img src={HumidityIcon} alt="humidity" />
        <div>
          <p>{humidity ?? 0}%</p>
          <span>Humidity</span>
        </div>
      </div>

      <div className="col">
        <img src={WindIcon} alt="wind" />
        <div>
          <p>{windSpeed ?? 0} {unit === "metric" ? "m/s" : "mph"}</p>
          <span>Wind</span>
        </div>
      </div>

      <div className="col">
        <img src={FeelsLikeIcon} alt="feels like"/>
        <div>
          <p>{feelsLike ?? 0}°{unit === "metric" ? "C" : "F"}</p>
          <span>Feels Like</span>
        </div>
      </div>

      <div className="col">
        <img src={SunriseIcon} alt="sunrise"/>
        <div>
          <p>{sunriseTime}</p>
          <span>Sunrise</span>
        </div>
      </div>

      <div className="col">
        <img src={SunsetIcon} alt="sunset"/>
        <div>
          <p>{sunsetTime}</p>
          <span>Sunset</span>
        </div>
      </div>

      {rain > 0 && (
        <div className="col">
          <img src={RainIcon} alt="rain"/>
          <div>
            <p>{rain} mm</p>
            <span>Rain</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDetails;
