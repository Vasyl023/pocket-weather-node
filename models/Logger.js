const rp = require('request-promise');

class Logger {

	constructor() {
		this.id = Date.now();
		this.baseUrl = '';
		this.internalStorage = {
			id: this.id
		};
	}

	outputToRemoteServer(url, payload) {
		return rp({
			method: 'POST',
			uri: url,
			body: payload,
			json: true
		})
	}

	cacheSet(key, val) {
		this.internalStorage[key] = val;
	}

	cacheGet(key) {
		return this.internalStorage[key];
	}

	unloadCache(url) {
		this.outputToRemoteServer(url, this.internalStorage);
		this.internalStorage = {};
	}

}

module.exports = new Logger();