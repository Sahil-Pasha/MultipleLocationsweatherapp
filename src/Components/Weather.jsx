import React, { useEffect, useState } from "react";
import "./Weather.css";
import { API_KEY } from "../Constants/Contant";
import searchIcon from "../Assests/search.png";
import humidityIcon from "../Assests/humidity.png";
import drizzleIcon from "../Assests/drizzle.png";
import rainIcon from "../Assests/rain.png";
import snowIcon from "../Assests/snow.png";
import clearIcon from "../Assests/clear.png";
import cloudIcon from "../Assests/cloud.png";
import windIcon from "../Assests/wind.png";
import WeatherCard from "./WeatherCard";
import axios from "axios";

const Weather = () => {
  const [searchQuery, setSearchQuery] = useState("London");
  const [weatherData, setWeatherData] = useState("");
  const [date, setDate] = useState(null);
  const [currTime, setCurrTime] = useState(null);
  const [mainCloudIcon, setMainCloudIcon] = useState(cloudIcon);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [showMultipleLocations, setShowMultipleLocations] = useState(false);
  const [weatherDataMultipleLocations, setWeatherDataMultipleLocations] =
    useState([]);
  const [newLocations, setNewLocations] = useState("");
  const [multipleLocations, setMultipleLocations] = useState([
    "New York",
    "London",
    "Tokyo",
    "Paris",
  ]);

  useEffect(() => {
    getWeatherData();
  }, []);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getWeatherData = async () => {
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=Metric&appid=${API_KEY}`;

    try {
      const response = await fetch(URL);
      if (!response.ok) {
        setWeatherData(null);
        throw new Error(
          "Please check the spelling of the city Name or Weather data not found for the given location"
        );
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
      setSearchQuery("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = () => {
    getWeatherData();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getWeatherData();
    }
  };

  const getCurrentTimeAndDate = (weatherData) => {
    const date = new Date(weatherData?.dt * 1000);
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + weatherData?.timezone * 1000);

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    const formattedTime = localTime.toLocaleTimeString("en-US", timeOptions);

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = localTime.toLocaleDateString("en-US", dateOptions);

    return {
      localTime: formattedTime,
      date: formattedDate,
    };
  };

  useEffect(() => {
    if (weatherData) {
      if (
        weatherData?.weather[0].icon === "01d" ||
        weatherData?.weather[0].icon === "01n"
      ) {
        setMainCloudIcon(clearIcon);
      } else if (
        weatherData?.weather[0].icon === "02d" ||
        weatherData?.weather[0].icon === "02n"
      ) {
        setMainCloudIcon(cloudIcon);
      } else if (
        weatherData?.weather[0].icon === "03d" ||
        weatherData?.weather[0].icon === "03n"
      ) {
        setMainCloudIcon(drizzleIcon);
      } else if (
        weatherData?.weather[0].icon === "04d" ||
        weatherData?.weather[0].icon === "04n"
      ) {
        setMainCloudIcon(drizzleIcon);
      } else if (
        weatherData?.weather[0].icon === "09d" ||
        weatherData?.weather[0].icon === "09n"
      ) {
        setMainCloudIcon(rainIcon);
      } else if (
        weatherData?.weather[0].icon === "10d" ||
        weatherData?.weather[0].icon === "10n"
      ) {
        setMainCloudIcon(rainIcon);
      } else if (
        weatherData?.weather[0].icon === "13d" ||
        weatherData?.weather[0].icon === "13n"
      ) {
        setMainCloudIcon(snowIcon);
      } else {
        setMainCloudIcon(clearIcon);
      }
    }
    let data = getCurrentTimeAndDate(weatherData);
    setDate(data.date);
    setCurrTime(data.localTime);
  }, [weatherData]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.body.classList.toggle("light-theme");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  //API call for Multiple Locations

  const fetchWeatherData = async (multipleLocations) => {
    try {
      const promises = multipleLocations.map((location) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
        )
      );
      const results = await Promise.all(promises);
      setWeatherDataMultipleLocations(results.map((result) => result.data));
      console.log("data for multiple locations", weatherDataMultipleLocations);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleMultipleLocations = () => {
    fetchWeatherData(multipleLocations);
    setShowMultipleLocations(!showMultipleLocations);
  };

  const handleAddLocations = () => {
    if (newLocations) {
      const locationsArray = newLocations
        .split(",")
        .map((loc) => loc.trim())
        .filter((loc) => loc && !multipleLocations.includes(loc));
      setMultipleLocations([...locationsArray]);
      console.log("Added locations", locationsArray);
      fetchWeatherData(locationsArray);
      setNewLocations("");
    } else {
      alert("Please Enter city Names");
    }
  };

  return (
    <div>
      {weatherData ? (
        <>
          <div className="weather-container">
            <div>
              <p className="weather-location">
                {weatherData?.name},{weatherData?.sys.country}
              </p>
              <p className="weather-date">{date}</p>
            </div>
            <div className="input-container">
              <input
                className="cityInput"
                type="text"
                placeholder="Enter the city Name..."
                value={searchQuery}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <div className="searchIcon" onClick={handleSearch}>
                <img src={searchIcon} alt="Search Icon" />
              </div>
            </div>
            <div className="toggle">
              {theme === "dark" ? (
                <button className="toggle-button" onClick={toggleTheme}>
                  light theme
                </button>
              ) : (
                <button className="toggle-button" onClick={toggleTheme}>
                  dark theme
                </button>
              )}
            </div>
          </div>
          <div className="description-container">
            <div>
              <img
                className="cloud-image"
                src={mainCloudIcon}
                alt="Cloud Icon"
              />
              <p className="weather-description">
                {weatherData?.weather[0].description}
              </p>
            </div>
            <div>
              <p className="weather-temp">
                {Math.floor(weatherData?.main.temp)}°C
              </p>
              <p className="weather-time">{currTime}</p>
            </div>
          </div>
          <div className="information-container">
            <div style={{ display: "flex" }}>
              <div>
                <img
                  className="huma-wind-image"
                  src={humidityIcon}
                  alt="Humidity Icon"
                />
              </div>
              <div>
                <p style={{ margin: "auto" }} className="weather-time">
                  Humidity {weatherData?.main.humidity}%
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div>
                <img
                  className="huma-wind-image"
                  src={windIcon}
                  alt="Wind Icon"
                />
              </div>
              <div>
                <p style={{ margin: "auto" }} className="weather-time">
                  Wind Speed {Math.floor(weatherData?.wind.speed)}km/h
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <p>
              Click below button to see weather Report for Multiple Locations
            </p>
            <button
              className="show-multiple-loc-button"
              onClick={handleMultipleLocations}
            >
              {showMultipleLocations === true
                ? "Hide Multiple Locations"
                : "Show Multiple Locations"}
            </button>
          </div>
          {showMultipleLocations && (
            <>
              <div className="location-input">
                <textarea
                  value={newLocations}
                  onChange={(e) => setNewLocations(e.target.value)}
                  placeholder="Enter city names, separated by commas, Click on Show Results"
                  rows="3"
                  cols="50"
                />
                <br />
                <button onClick={handleAddLocations}>Show Results</button>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {weatherDataMultipleLocations.map((data, index) => (
                    <WeatherCard key={index} data={data} />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p>Data is not available</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}
    </div>
  );
};

export default Weather;
