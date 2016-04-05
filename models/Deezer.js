const rp = require('request-promise');
const logger = require('./Logger');
	class Deezer {

		constructor() {
		}

		search(q) {
			return rp(`https://api.deezer.com/search/playlist?q=${q}`);
		}

		getPlaylist(q) {
			//let weather = ['clear sky', 'broken clouds'];
			/clouds/.test(q) && (q = 'clouds');
			return this.search(q).then((res) => {
				let plNames = JSON.parse(res).data.map(pl => pl.title);
				logger.cacheSet('matchingPlaylists', plNames);
				return this.getTracks(JSON.parse(res))
			});
		}

		getTracks(res) {
			var limit = res.total >= 25 ? 24 : res.total - 1;
			var idx = Math.floor(Math.random() * (limit - 0 + 1));
			//console.log('\n-----------\nDEEZER RESPONSE:', res.total);
			//console.log(`INDEX  --> ${idx}`);

			logger.cacheSet('playlistData', res.data[idx]);

			let playlistTracksUrl = res.data[idx]['tracklist'];

			//console.log('DATA', res.data[idx]);

			return rp(playlistTracksUrl).then((res) => {
				return this.processPlaylistTracks(JSON.parse(res))
			});

		}

		processPlaylistTracks(res) {
			return res.data.map((el) => {
				return {
					title: el.title,
					duration: el.duration,
					source: el.preview,
					artist: el.artist.name,
					cover: el.album.cover_small
					//youtubeId: youtube.search(`${el.title} - ${el.artist}`, 1)
				}
			});
		}

	}

module.exports = Deezer;