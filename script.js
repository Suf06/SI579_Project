const searchInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn');
const locationButton = document.querySelector('.location-btn');
const currentWeather = document.querySelector('.current-weather');
const forecastList = document.querySelector('.weather-cards');
// Possibly looks at switching tab or do local storage, or have user add or delete location where they can be saved in local storage.

const fetchCurrentWeather = async (city) => {
  const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=7498ac8e8a504da19f6ae2065abf3313`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayCurrentWeather(data.data[0]);
    } else {
      throw new Error('Unable to fetch current weather data');
    }
  } catch (error) {
    console.error('Error fetching current weather:', error);
  }
};

const fetchForecast = async (city) => {
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=7498ac8e8a504da19f6ae2065abf3313`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayForecast(data.data.slice(1, 6)); // Exclude current day, hence slice from index 1 to 6
    } else {
      throw new Error('Unable to fetch forecast data');
    }
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
};

const displayCurrentWeather = (data) => {
  // Display current weather data in the UI
  currentWeather.innerHTML = `
    <div class="details">
      <h2>${data.city_name} (Weather Condition:${data.weather.description})</h2>
      <h6>Temperature: ${data.temp}°C</h6>
      <h6>Wind: ${data.wind_spd} M/S</h6>
      <h6>Humidity: ${data.rh}%</h6>
    </div>
  `;
};

const displayForecast = (data) => {
  // Display forecast data in the UI
  forecastList.innerHTML = data.map(day => `
    <li class="card">
      <h3>${day.valid_date}</h3>
      <h6>Temp: ${day.temp}°C</h6>
      <h6>Wind: ${day.wind_spd} M/S</h6>
      <h6>Humidity: ${day.rh}%</h6>
    </li>
  `).join('');
};

// Event listeners
searchButton.addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchCurrentWeather(city);
    fetchForecast(city);
  }
});

locationButton.addEventListener('click', () => {
  // Handle getting user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=7498ac8e8a504da19f6ae2065abf3313`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          displayCurrentWeather(data.data[0]);
        } else {
          throw new Error('Unable to fetch current weather data');
        }
      } catch (error) {
        console.error('Error fetching current weather:', error);
      }
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
});