const rp = require('request-promise');
const logger = require('./Logger');
class Deezer {

	constructor() {
	}

	search(q) {
		return rp(`https://api.deezer.com/search/playlist?q=${q}`);
	}

	getKeywords(criteria) {
		var keywords = [];
		// [weather block]
		if (/(clear sky)|(few|scattered) clouds/.test(criteria)) {
			keywords = ['clear sky', 'sun shining', 'sunny', 'sunshine'];
		} else if (/(broken|overcast) clouds/.test(criteria)) {
			keywords = ['clouds'];
		} else if (/thunderstorm/.test(criteria)) {
			keywords = ['thunder', 'stormy weather'];
		} else if (/drizzle|rain/.test(criteria)) {
			keywords = ['rainy'];
		}

		// TODO:
		// [daytime block]
		// [season block]

		return keywords.length ? keywords : [criteria];
	}

	getPlaylist(q) {
		var keywords = this.getKeywords(q);
		return Promise.all(
			keywords.map((el) => this.search(el))
		).then((res) => {
			let plNames = res.map((el) => {
				return JSON.parse(el).data.map((elInner) => {
					return {
						title: elInner.title,
						url: elInner.tracklist,
						cover: elInner.picture,
						author: elInner.user.name,
						tracksCount: elInner.nb_tracks
					}
				});
			}).reduce((a, b) => {
				return a.concat(b);
			});

			const limit = plNames.length >= 25 ? 24 : plNames.length - 1;
			const idx = Math.floor(Math.random() * (limit + 1));

			logger.cacheSet('playlistData', {
				title: plNames[idx].title,
				author: plNames[idx].author,
				tracksCount: plNames[idx].tracksCount
			});

			logger.cacheSet('playlistsMatched', plNames.map(el => el.title));

			var pl = plNames[idx];
			const url = plNames[idx].url;
			return rp(url).then((res) => {
				var plTracks = {
					data: JSON.parse(res).data.map((el) => { return {
						title: el.title,
						artist: el.artist.name,
						duration: el.duration,
						source: el.preview,
						album: el.album.title,
						cover: el.album.cover
					}})
				};
				return Object.assign(pl, plTracks);
			});
		});
	}
}

module.exports = Deezer;