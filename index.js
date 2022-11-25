"use strict"

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/config');
const app = express();

(async () => {
    try {
        //database
        await mongoose.connect(config.dbURL);
        console.log("Connected to MongoDB");

        //utilities
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cors({ origin: true, credentials: true }));

        //routes
        app.use(express.static(path.join(__dirname, 'client/build')));
        require('./config/routes')(app);
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname + '/client/build/index.html'))
        })

        app.listen(config.port, () => {
            console.log("Express server is listening on port " + config.port);
        });
    } catch (err) { console.error(err); }
})();
