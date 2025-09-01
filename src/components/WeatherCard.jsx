import React from 'react';

const WeatherCard = ({ icon, temperature, location, unit }) => {
  return (
    <div className='weatherCard'>
      <img key={icon} src={icon} alt='weather Icon' className='weather-icon fade-in' />
      <p key={temperature} className="temperature animate-pop">
        {temperature}°{unit === "metric" ? "C" : "F"}
      </p>
      <p key={location} className='location animate-slideUp'>{location}</p>
    </div>
  );
};

export default WeatherCard;
