const rp = require('request-promise');
const API_KEY = '7ed77a066ff8ff1b42915e7c136db3a6';

class OpenWeather {

    constructor() {
    }

    getCurrentWeather(lat, lon) {
        return rp(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`)
    }

}

module.exports = OpenWeather;