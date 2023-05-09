import React, { useState } from "react";
import Head from "next/head";
import axios from "axios";

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "b7187ca773f5115ef5aa0102ddb861a9";

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=metric`;

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
      } else {
        setError(error.message);
      }
      setWeatherData(null);
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
              <p>
                <p>
                  {new Date(weatherData.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
