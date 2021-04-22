const asyncHandler = require('express-async-handler');
const fetch = require('./requests/fetch');
let express = require('express');
let router = express.Router();

router.get("/coordinates", asyncHandler(async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;

    const response = await fetch.fetchWeatherByLocation(lat, lon);
    if (response == null) {
        res.status(404).send();
        return;
    }
    res.send(response);
}));

router.get("/city", asyncHandler(async (req, res) => {
    const name = req.query.q;

    const response = await fetch.fetchWeatherByName(name);
    if (response == null) {
        res.status(404).send();
        return;
    }
    res.send(response);
}));

module.exports = router;