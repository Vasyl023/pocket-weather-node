'use strict';

const Hapi = require('hapi');
const rp = require('request-promise');
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
		const youtube = new Youtube();

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
				return Promise.all(
					[
						Promise.resolve(res[0]),
						Promise.resolve(res[1])
					]
				)
			})
			.then((res) => {
				logger.unloadCache(`https://api.mongolab.com/api/1/databases/mongodb/collections/pocket_weather_log?apiKey=eTCiaa0zEzzP5ywGrdohk7bv6V8_uMen`);
				return res;
			})
			.then((res) => reply({
				weather: res[0],
				playlist: res[1]
			}))
			.catch(err => console.log(err));
	}
});

server.route({
	method: 'GET',
	path: '/yt/{q}/',
	handler: function (req, reply) {
		let youtube = new Youtube();
		youtube
			.search('muse - panic station', 1)
			.then((res) => {
				console.log(res);
				reply(res);
			})
			.catch(err => console.log(err));
	}
});

server.route({
	method: 'GET',
	path: '/music/{tag}',
	handler: function (req, reply) {
		let deezer = new Deezer();
		deezer
			.getPlaylist(req.params.tag)
			.then((res) => {
				reply(res);
			});
	}
});

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log('Server running at:', server.info.uri);
});