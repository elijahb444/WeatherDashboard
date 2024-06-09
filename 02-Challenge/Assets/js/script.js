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
        displayCurrentWeather(data);
        //'dt' in returned array stands for 'data timestamp', clockinthe time the forecast is relevant to, formatted as as unix timestamp
    });
};

// TODO: find a way to parse/iterate through forecast results
const displayCurrentWeather = function(data) {
    const current = data.list[0];
    // 'toLocaleDateString() converts dt stored as unix timestamp to readable format
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${data.city.name}</h2>
        <p>Date: ${new Date(current.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${current.main.temp} °C</p>
        <p>Humidity: ${current.main.humidity}%</p>
        <p>Wind Speed: ${current.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/w/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
    `;
};

searchBtn.addEventListener('click', getForecast)