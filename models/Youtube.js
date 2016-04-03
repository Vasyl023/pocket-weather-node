const rp = require('request-promise');

class Youtube {

	constructor() {
		this.apiKey = 'AIzaSyBH__Lnq26dnriBiNBAZMgqEXrP2kCa2y8';
		this.serverKey = 'AIzaSyAN-BVOHfuKDcmpveZ_HWR5ewsYUM1uaKc';
		this.baseUrl = 'https://www.googleapis.com/youtube/v3/search';
	}

	search(query, limit) {
		return rp(
			`${this.baseUrl}?part=snippet&q=${JSON.stringify(query)}&maxResults=${limit}&key=${this.serverKey}`
		);
	}

	searchFor(argsArray, limit) {
		return Promise.all(
			argsArray.map((i) => {
				return new Promise((resolve, reject) => {
					resolve(this.search(i, limit))
				});
			})
		);

	}
}

module.exports = Youtube;