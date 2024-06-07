const userSearch = document.getElementById('city-search')
const searchBtn = document.getElementById('search-button')
// api key: a3aae8933b04e64f40888cfe629f2e70
const apiKey = 'a3aae8933b04e64f40888cfe629f2e70'
// geocode api must be called first to obtain coords for forecast api
//const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userSearch.value},&limit=5&appid=${apiKey}`
// ^ This didn't work because it was referencing userSearch before it was input by the user, resulting in a bad/empty query.

//const forecastUrl = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}'

const getCoords = function() {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userSearch.value},&limit=5&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        const cityLat = data[0].lat
        const cityLon = data[0].lon
        // targets latitude and longitude of top result
        console.log(`Latitude: ${cityLat}, Longitude: ${cityLon}`)
        return {cityLat, cityLon}
       })
}

const getForecast = function () {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userSearch.value},&limit=5&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        const cityLat = data[0].lat
        const cityLon = data[0].lon
        // targets latitude and longitude of top result
        console.log(`Latitude: ${cityLat}, Longitude: ${cityLon}`)
        return {cityLat, cityLon}
       })



    fetch(`api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })
}

searchBtn.addEventListener('click', getForecast)