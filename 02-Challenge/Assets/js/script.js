const userSearch = document.getElementById('city-search');
const searchBtn = document.getElementById('search-button');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');
const apiKey = 'a3aae8933b04e64f40888cfe629f2e70';
// api key: a3aae8933b04e64f40888cfe629f2e70
// geocode api must be called first to obtain coords for forecast api
//const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userSearch.value},&limit=5&appid=${apiKey}`
// ^ This didn't work because it was referencing userSearch before it was input by the user, resulting in a bad/empty query.

//const forecastUrl = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}'

const getForecast = function() {
    const getCoords = function() {
        return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userSearch.value}&limit=5&appid=${apiKey}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const cityLat = data[0].lat;
                const cityLon = data[0].lon;
                console.log(`Latitude: ${cityLat}, Longitude: ${cityLon}`);
                return { lat: cityLat, lon: cityLon };
            });
    };

    getCoords().then(function(coords) {
        const { lat, lon } = coords;
        return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        displayCurrentWeather(data)
        displayForecast(data)
        addToSearchHistory(userSearch.value);
        //'dt' in returned array stands for 'data timestamp', clockinthe time the forecast is relevant to, formatted as as unix timestamp
    });
};

// TODO: find a way to parse/iterate through forecast results
// initialized 'date' object in javscript
// 'toLocaleDateString() converts dt stored as unix timestamp to readable format
// openWeather returns temps in Kelvin; celcius = K - 273.15
const displayCurrentWeather = function(data) {
    const current = data.list[0];
    const temperatureCelsius = (current.main.temp - 273.15).toFixed(2); // converts Kelvin to Celsius
    currentWeatherDiv.innerHTML = `
    <h2>Current Weather in ${data.city.name}</h2>
    <p>Date: ${new Date(current.dt * 1000).toLocaleDateString()}</p>
    <p>Temperature: ${temperatureCelsius} °C</p>
    <p>Humidity: ${current.main.humidity}%</p>
    <p>Wind Speed: ${current.wind.speed} m/s</p>
    <img src="http://openweathermap.org/img/w/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
    `;
};

const displayForecast = function(data) {
    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    const forecastList = [];
    for (let i = 8; i < data.list.length && forecastList.length < 5; i += 8) {
        forecastList.push(data.list[i]);
    }
    forecastList.forEach(day => {
        const temperatureCelsius = (day.main.temp - 273.15).toFixed(2); // .toFixed(2) returns a temp value rounded down to 100s place
        const forecastItem = document.createElement('div');
        forecastItem.innerHTML = `
            <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: ${temperatureCelsius} °C</p>
            <p>Humidity: ${day.main.humidity}%</p>
            <p>Wind Speed: ${day.wind.speed} m/s</p>
            <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
        `;
        forecastDiv.appendChild(forecastItem);
    });
};

const addToSearchHistory = function(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
};

// TODO: Fetch search history from local storage and display on page on load

searchBtn.addEventListener('click', getForecast)