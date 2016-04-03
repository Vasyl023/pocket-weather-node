'use strict';

const Hapi = require('hapi');
const rp = require('request-promise');
const OpenWeather = require('./models/OpenWeather');
const Youtube = require('./models/Youtube');
const Deezer = require('./models/Deezer');

const server = new Hapi.Server();
//var resp;
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
			//.then((res) => {
			//	return Promise.all(
			//		res.map((el) => el.youtubeId)
			//	)
			//})
			//.then((res) => {
			//	return resp.forEach((el, i) => {
			//		el.youtubeId = res[i];
			//	})
			//})
			//.then((res) => console.log(res))
			.then((res) => reply(res))
			.catch(err => console.log(err));
	}
});

server.route({
	method: 'GET',
	path: '/yt/{q}/',
	handler: function (req, reply) {
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