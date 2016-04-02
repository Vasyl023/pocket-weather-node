'use strict';

const Hapi        = require('hapi');
const OpenWeather = require('./models/OpenWeather');
const Youtube     = require('./models/Youtube');

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

server.route({
   method: 'GET',
   path: '/yt/{q}/',
    handler: function(req, reply) {
        let youtube = new Youtube();
        let songsList = req.params.q.split(',');
        youtube
            .searchFor(songsList, 1)
            .then((res) => {
                reply(
                    res.map(el => JSON.parse(el).items[0].id.videoId)
                );
            })
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});