const searchInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn');
const locationButton = document.querySelector('.location-btn');
const currentWeather = document.querySelector('.current-weather');
const forecastList = document.querySelector('.weather-cards');

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
  const temperatureCelsius = data.temp;
  const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
  let weatherEmoji = "";
  if (data.weather.code >= 200 && data.weather.code < 600) {
    // Weather condition is related to precipitation
    weatherEmoji = "🌧️";
  } else if (data.weather.code >= 600 && data.weather.code < 700) {
    // Weather condition is related to snow
    weatherEmoji = "❄️";
  } else if (data.weather.code >= 700 && data.weather.code < 800) {
    // Weather condition is related to atmospheric conditions (e.g., fog, dust)
    weatherEmoji = "🌫️";
  } else if (temperatureCelsius >= 25) {
    weatherEmoji = "☀️"; // Sun emoji for hot weather
  } else if (temperatureCelsius >= 15) {
    weatherEmoji = "⛅"; // Partly cloudy emoji for warm weather
  } else {
    weatherEmoji = "🌥️"; // Cloud emoji for cold weather
  }
  // Check if the temperature is currently displayed in Celsius or Fahrenheit
  const temperatureElement = document.querySelector('.temperature');
  const currentUnit = temperatureElement.dataset.unit;
  const temperature = currentUnit === 'C' ? temperatureCelsius : temperatureFahrenheit;
  const temperatureUnit = currentUnit === 'C' ? '°C' : '°F';
  
  currentWeather.innerHTML = `
    <div class="details">
      <h2>${data.city_name} (Weather Condition: ${data.weather.description})</h2>
      <h6>Temperature: ${weatherEmoji} <span class="temperature" data-temperature="${temperature}" data-unit="${currentUnit}">${temperature.toFixed(2)}${temperatureUnit}</span></h6>
      <h6>Wind: ${data.wind_spd} M/S</h6>
      <h6>Humidity: ${data.rh}%</h6>
    </div>
    <button class="temperature-toggle-btn">Convert to ${currentUnit === 'C' ? 'Fahrenheit' : 'Celsius'} and Celsius</button>
  `;
};



const displayForecast = (data) => {
  // Display forecast data in the UI
  forecastList.innerHTML = data.map(day => `
    <li class="card">
      <h3>${day.valid_date}</h3>
      <h6>Temp: <span class="temperature" data-temperature="${day.temp}" data-unit="C">${day.temp.toFixed(2)}°C</span></h6>
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

// Temperature conversion functionality
document.addEventListener('click', (event) => {
  if (event.target && event.target.classList.contains('temperature-toggle-btn')) {
    toggleTemperatureUnit();
  }
});

const toggleTemperatureUnit = () => {
  const temperatureElements = document.querySelectorAll('.temperature');
  temperatureElements.forEach(element => {
    const currentTemperature = parseFloat(element.dataset.temperature);
    const currentUnit = element.dataset.unit;
    if (currentUnit === 'C') {
      const temperatureFahrenheit = (currentTemperature * 9/5) + 32;
      element.textContent = `${temperatureFahrenheit.toFixed(2)}°F`;
      element.dataset.unit = 'F';
    } else {
      const temperatureCelsius = (currentTemperature - 32) * 5/9;
      element.textContent = `${temperatureCelsius.toFixed(2)}°C`;
      element.dataset.unit = 'C';
    }
  });
};