const userSearch = document.getElementById('city-search')
const searchBtn = document.getElementById('search-button')
// api key: a3aae8933b04e64f40888cfe629f2e70
const apiKey = 'a3aae8933b04e64f40888cfe629f2e70'
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
        console.log(data);
    });
};

// TODO: find a way to parse/iterate through forecast results

searchBtn.addEventListener('click', getForecast)