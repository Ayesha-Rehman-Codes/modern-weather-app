// OpenWeatherMap API Configurations
const API_KEY = '9993cb122c3c799eca1f9904f53de170';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements Selection
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const appBackground = document.getElementById('appBackground');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeatherByCity(city);
    }
});

locationBtn.addEventListener('click', getUserLocation);

// Fetch Weather by City Name (Promises using Async/Await)
async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error('City not found. Please try again.');
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

// Fetch Weather using Geolocation API (Additional Challenge)
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                if (!response.ok) throw new Error('Unable to fetch weather for your location.');
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                showError(error.message);
            }
        }, () => {
            showError('Location access denied by user.');
        });
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

// Display Data and Update DOM Dynamically
function displayWeather(data) {
    errorMessage.classList.add('hidden');
    weatherCard.classList.remove('hidden');

    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    
    const condition = data.weather[0].main;
    document.getElementById('weatherCondition').textContent = condition;

    updateUITheme(condition);
}

// Update Icons and Background Dynamically (Additional Challenge)
function updateUITheme(condition) {
    const iconElement = document.getElementById('weatherIcon');
    
    // Clear previous background classes
    appBackground.style.background = '';

    switch (condition.toLowerCase()) {
        case 'clear':
            iconElement.textContent = '☀️';
            appBackground.style.setProperty('background', 'var(--bg-sunny)');
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            iconElement.textContent = '🌧️';
            appBackground.style.setProperty('background', 'var(--bg-rainy)');
            break;
        case 'clouds':
            iconElement.textContent = '☁️';
            appBackground.style.setProperty('background', 'var(--bg-cloudy)');
            break;
        default:
            iconElement.textContent = '🌤️';
            appBackground.style.setProperty('background', 'var(--bg-default)');
            break;
    }
}

// Error Handling Function
function showError(message) {
    weatherCard.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = message;
}