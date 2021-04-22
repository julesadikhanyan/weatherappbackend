const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const fav = require('./favorites');
const weather = require('./weather');

const app = express();
app.use(cors());
app.options('*', cors());

mongoose.set('useCreateIndex', true);

const mongooseURL = process.env.MONGODB_URL;

const PORT = process.env.PORT || 3000;

async function start() {
    let dataBase = await mongoose.connect(mongooseURL, {useUnifiedTopology: true, useNewUrlParser: true,
        useFindAndModify: false});

    app.use('/weather', weather);

    fav.initSchema(dataBase);
    app.use('/favorites', fav.router);

    app.listen(PORT, () => {
        console.log('Server has been started...');
    });
}

start();