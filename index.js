'use strict';

const Hapi = require('hapi');
const OpenWeather = require('./models/OpenWeather');
const Youtube = require('./models/Youtube');
const Deezer = require('./models/Deezer');
const logger = require('./models/Logger');

const server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 8000
});

server.route({
	method: 'GET',
	path: '/weather/{lat}/{lon}',
	handler: function (req, reply) {

		const weather = new OpenWeather();
		const deezer = new Deezer();
		weather
			.getWeatherJSONObject(req.params.lat, req.params.lon)
			.then((data) => {
				return Promise.all(
					[
						Promise.resolve(data),
						deezer.getPlaylist(data.weatherSlogan)
					]
				);
			})
			.then((res) => {
				logger.unloadCache(`https://api.mongolab.com/api/1/databases/mongodb/collections/pocket_weather_log?apiKey=eTCiaa0zEzzP5ywGrdohk7bv6V8_uMen`);
				return res;
			})
			.then((res) => reply({ weather: res[0],	playlist: res[1] }))
			.catch(err => console.log(err));
	}
});

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log('Server running at:', server.info.uri);
});