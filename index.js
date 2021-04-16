const express = require('express');
const cors = require('cors');
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

const fetch = require('./requests/fetch');
const fav = require('./favorites');

const app = express();
app.use(cors());
app.options('*', cors());

mongoose.set('useCreateIndex', true);
const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;

const mongooseURL =
    `mongodb+srv://${user}:${password}@cluster0.v4uez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3000;

async function start() {
    let dataBase = await mongoose.connect(mongooseURL, {useUnifiedTopology: true, useNewUrlParser: true,
        useFindAndModify: false});

    app.listen(PORT, () => {
        console.log('Server has been started...');
    });

    app.get("/weather/coordinates", asyncHandler(async (req, res) => {
        const lat = req.query.lat;
        const lon = req.query.lon;

        const json = await fetch.fetchWeatherByLocation(lat, lon);
        if (json == null) {
            res.status(404).send();
            return;
        }
        res.send(json);
    }));

    app.get("/weather/city", asyncHandler(async (req, res) => {
        const name = req.query.q;

        const json = await fetch.fetchWeatherByName(name);
        if (json == null) {
            res.status(404).send();
            return;
        }
        res.send(json);
    }));

    fav.initSchema(dataBase);
    app.use('/favorites', fav.router);
}

start();