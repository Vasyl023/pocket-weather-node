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
			keywords = keywords.concat(['clear sky', 'sun shining', 'sunny', 'sunshine']);
		} else if (/(broken|overcast) clouds/.test(criteria)) {
			keywords = keywords.concat(['clouds']);
		} else if (/thunderstorm/.test(criteria)) {
			keywords = keywords.concat(['thunder', 'stormy weather']);
		} else if (/drizzle|rain/.test(criteria)) {
			keywords = keywords.concat(['rainy']);
		}

		// TODO:
		const now = new Date();
		const monthToSeasonMapper = {
			0: 'winter',
			1: 'winter',
			2: 'spring',
			3: 'spring',
			4: 'spring',
			5: 'summer',
			6: 'summer',
			7: 'summer',
			8: 'autumn',
			9: 'autumn',
			10: 'autumn',
			11: 'winter'
		};

		var hourToDaytimeMapping = (hh) => {
			var dayParts = {
				morning: ['morning', 'sunrise'],
				afternoon: ['afternoon', 'daytime'],
				evening: ['evening', 'sunset'],
				night: ['night', 'midnight']
			};
			if (hh >= 0 && hh < 6) return dayParts.night;
			else if (hh >= 6 && hh < 12) return dayParts.morning;
			else if (hh >=12 && hh < 19) return dayParts.afternoon;
			else if (hh >= 19 && hh <= 24) return dayParts.evening;
		};

		keywords.push(monthToSeasonMapper[now.getMonth()]);
		keywords = keywords.concat(hourToDaytimeMapping(now.getHours()));

		return keywords.length ? keywords : criteria;
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

			var generateRandomIndex = (l) => Math.floor(Math.random() * (l + 1));
			var plCount = 5;
			var pll;
			var tmp = new Array(plCount);
			pll = tmp.map((el, i) => generateRandomIndex(plCount));
			console.log(pll);
			var respl = pll.map((idx) => plNames[idx]);
			console.log(respl);

			return;

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
					data: JSON.parse(res).data.map((el) => {
						return {
							title: el.title,
							artist: el.artist.name,
							duration: el.duration,
							source: el.preview,
							album: el.album.title,
							cover: el.album.cover
						}
					})
				};
				return Object.assign(pl, plTracks);
			});
		});
	}
}

module.exports = Deezer;