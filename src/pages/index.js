import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "b7187ca773f5115ef5aa0102ddb861a9";
  const defaultCity = "Areopoli";

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${
    city || defaultCity
  }&appid=${apiKey}&units=metric`;
  const currentLocationApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid=${apiKey}&units=metric`;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            currentLocationApiUrl
              .replace("{latitude}", latitude)
              .replace("{longitude}", longitude)
          );
          setWeatherData(response.data);
          setError(null);
        } catch (error) {
          setError("Unable to get your location weather");
        }
      });
    } else {
      setError("Geolocation is not supported in your browser");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!city) {
      setError("Please enter a city");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(apiUrl.trim());
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Please enter a valid city");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Weather App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter a city..."
              />
            </label>
          </form>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {weatherData && (
            <div className="weather">
              <h2>
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="temperature">
                {Math.round(weatherData.main.temp)}°C
              </p>
              <p>{weatherData.weather[0].description}</p>
              <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>
          )}
        </div>
      </main>
      <footer className="footer">
        <p>Created by Michalis Drakoulakos</p>
      </footer>
    </>
  );
}
