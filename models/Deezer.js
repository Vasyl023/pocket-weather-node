const rp = require('request-promise');
const logger = require('./Logger');
class Deezer {

	constructor() {
	}

	search(q) {
		return rp(`https://api.deezer.com/search/playlist?q=${q}`);
	}

	getPlaylist(q) {
		// get daytime && season also ?
		var t_q;
		if (/(clear sky)|(few|scattered) clouds/.test(q)) {
			t_q = ['clear sky', 'sun shining', 'sunny', 'sunshine'];
		} else if (/(broken|overcast) clouds/.test(q)) {
			t_q = ['clouds'];
		} else if (/drizzle|rain/.test(q)) {
			t_q = ['rainy']
		}


		return Promise.all(
			t_q.map((el) => this.search(el))
		).then((res) => {
			let plNames = res
				.map((el) => {
					return JSON.parse(el).data.map((elInner) => {
						return {
							title: elInner.title,
							url: elInner.tracklist,
							cover: elInner.picture,
							author: elInner.user.name
						}
					});
				})
				.reduce((a, b) => {
					return a.concat(b);
				});

			const limit = plNames.length >= 25 ? 24 : plNames.length - 1;
			const idx = Math.floor(Math.random() * (limit + 1));

			logger.cacheSet('playlists', plNames[idx]);
			logger.cacheSet('playlists', plNames.map(el => el.title));

			var pl = plNames[idx];
			const url = plNames[idx].url;

			return rp(url).then((res) => (Object.assign(pl, JSON.parse(res))));
		});
	}
}

module.exports = Deezer;