const fetch = require('node-fetch');

const configRequests = require('./configRequests');

async function fetchWeather(params) {
    const url = new URL(configRequests.url);
    url.searchParams.append('appid', configRequests.apiKey);
    url.searchParams.append('units', 'metric');

    for (const param in params) {
        if (params.hasOwnProperty(param)) {
            url.searchParams.append(param, params[param]);
        }
    }

    let response = await fetch(url);
    if (response.status === 200) {
        return await response.json();
    }
}

async function fetchWeatherByLocation(lat, lon) {
    return fetchWeather({lat:lat, lon:lon})
}

async function fetchWeatherByName(name) {
    return fetchWeather({q: name});
}

module.exports = {
    fetchWeatherByLocation, fetchWeatherByName
};