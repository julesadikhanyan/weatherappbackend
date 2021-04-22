const fetch = require('./requests/fetch');
const asyncHandler = require('express-async-handler');
const getFavoriteCityModel = require('./schema');
let express = require('express');
let router = express.Router();

let favoriteCity;

function initSchema (mongoose) {
    favoriteCity = getFavoriteCityModel(mongoose);
}

router.get("/", asyncHandler (async (req, res) => {
    let cities = await favoriteCity.find().exec();

    let citiesArray = [];

    cities.forEach(info => citiesArray.push(info.name));

    res.send({favoriteCities: citiesArray})
}));

router.post("/",asyncHandler (async (req, res) => {
    const {q} = req.query;

    let data = await fetch.fetchWeatherByName(q);

    if (data == null) {
        res.status(404).send();
        return;
    }

    let exists = await favoriteCity.findOne({name: data.name}).exec();

    if (exists !== null) {
        res.status(409).send();
        return;
    }

    new favoriteCity({name: data.name}).save();
    res.status(201).send(data);
}));

router.delete("/",asyncHandler (async (req, res) => {
    const {q} = req.query;

    const remove = await favoriteCity.findOneAndRemove({name: q});
    if (remove === null) {
        res.status(404).send();
        return;
    }

    res.status(204).send();
}));


module.exports = {
    router, initSchema
}