const rp = require('request-promise');
const fs = require('fs');

class OpenWeather {

	constructor() {
		this.apiKey = '7ed77a066ff8ff1b42915e7c136db3a6';
		this.baseUrl = 'http://api.openweathermap.org/data/2.5/';
	}

	getCurrentWeather(lat, lon) {
		return rp(`${this.baseUrl}weather?lat=${lat}&lon=${lon}&APPID=${this.apiKey}`)
	}

	/*
	 @param {String} lat - latitude
	 @param {String} lon - longitude
	 @returns {Promise}
	 */
	getWeatherJSONObject(lat, lon) {
		return this
			.getCurrentWeather(lat, lon)
			.then((res) => {
				return this.prepareRawData(res);
			});
	}

	/*
	 @param {JSON Object} weatherData - data returned from the API
	 @returns {JSON Object}
	 */
	prepareRawData(weatherData) {

		// 1: Clear
		// 2: Thunderstorm
		// 3: Drizzle
		// 5: Rain
		// 6: Snow
		// 7: Atmosphere
		// 8: Clouds
		// 9: Extreme

		var weatherData = JSON.parse(weatherData);

		let getWeatherGroupId = ((weatherId) => {
			if (weatherId === 800) return 1;
			let reGroupId = /\d/;
			let res = parseInt(reGroupId.exec(weatherData.weather[0].id)[0]);
			return res;
		});

		fs.appendFile('./log.txt',  '\n-----------\n'+(new Date()).toString()+'\nWeather:\n'+JSON.stringify({
			weatherTime: weatherData.dt,
			weatherTemperature: weatherData.main.temp,
			locationName: weatherData.name,
			weatherSlogan: weatherData.weather[0].description,
			weatherGroupId: getWeatherGroupId(weatherData.weather[0].id),
			weatherId: weatherData.weather[0].id
			}), err => {
			console.log(err)
		});

		return {
			weatherTime: weatherData.dt,
			weatherTemperature: weatherData.main.temp,
			locationName: weatherData.name,
			weatherSlogan: weatherData.weather[0].description,
			weatherGroupId: getWeatherGroupId(weatherData.weather[0].id),
			weatherId: weatherData.weather[0].id
		};

	}

}

module.exports = OpenWeather;