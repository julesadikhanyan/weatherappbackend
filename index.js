// Первые две строки требуют импорт модуля Express и создания приложения Express.
const express = require('express');
const app = express();
const cors = require('cors');
const asyncHandler = require("express-async-handler");
app.use(cors());
const fetch = require('./requests/fetch');
const fav = require('./favorites');
const mongoose = require('mongoose');
// Метод app.get () указывает колбэк-функцию, которая будет вызываться всякий раз, когда есть HTTP-запрос GET с путём
// ('/') относительно корня сайта. Колбэк-функция принимает запрос и объект ответа в качестве аргументов и просто
// вызывает send () для ответа, чтобы вернуть строку «Hello World!»
/*app.get('/', function(req, res) {
    res.send('Hello World!');
});*/
mongoose.set('useCreateIndex', true);
const mongooseURL =
    'mongodb+srv://jules:6Nk-PPz-X9v-LSE@cluster0.v4uez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

async function start() {
    let dataBase = await mongoose.connect(mongooseURL, {useUnifiedTopology: true, useNewUrlParser: true,
        useFindAndModify: false});

    app.listen(PORT, () => {
        console.log('Server has been started...');
    });
    app.get('/', function(req, res) {
        res.send('Hello World!');
    });
    app.get('/weather', function (req, res) {
        res.send('Weather');
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

    //app.use('/city', city);
}

start();