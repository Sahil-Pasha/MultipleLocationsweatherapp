import React from "react";

const WeatherCard = ({ data }) => {
  return (
    <div
      style={{
        background: "blue",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgab(0,0,0,0.1)",
        margin: "10px",
        padding: "20px",
        width: "200px",
        textAlign: "left",
      }}
    >
      <h2>{data.name}</h2>
      <p>Temperature: {Math.round(data?.main?.temp - 273.15)}°C</p>
      <p>Weather: {data?.weather[0]?.description}</p>
      <p>Humidity: {data?.main?.humidity}%</p>
      <p>Wind Speed {Math.floor(data?.wind.speed)}km/h</p>
    </div>
  );
};

export default WeatherCard;
