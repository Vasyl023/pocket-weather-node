'use strict';

const Hapi = require('hapi');
const OpenWeather = require('./models/OpenWeather');

const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path: '/weather/{lat}/{lon}',
    handler: function (req, reply) {
        let weather = new OpenWeather();
        weather
            .getWeatherJSONObject(req.params.lat, req.params.lon)
            .then((data) => {
                reply(data);
            })
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});