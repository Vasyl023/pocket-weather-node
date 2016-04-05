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
			/*
			if (/(clear sky)|(few|scattered) clouds/.test(q)) {
				q = ['clear sky', 'sun shining', 'sunny', 'sunshine'];
			} else if (/(broken|overcast) clouds/.test(q)) {
				q = ['clouds'];
			}
			*/
			return this.search(q).then((res) => {
				let plNames = JSON.parse(res).data.map(pl => pl.title);
				logger.cacheSet('matchingPlaylists', plNames);
				return this.getTracks(JSON.parse(res))
			});
		}

		getTracks(res) {
			const limit = res.total >= 25 ? 24 : res.total - 1;
			const idx = Math.floor(Math.random() * (limit + 1));
			//console.log('\n-----------\nDEEZER RESPONSE:', res.total);
			//console.log(`INDEX  --> ${idx}`);
			const playlistData = res.data[idx];
			logger.cacheSet('playlistData', playlistData);

			const playlistTracksUrl = playlistData['tracklist'];

			//console.log('DATA', res.data[idx]);

			return rp(playlistTracksUrl).then((res) => {
				return this.processPlaylistTracks(playlistData, JSON.parse(res))
			});

		}

		processPlaylistTracks(plData, res) {

				const tracks = res.data.map((el) => {
				return {
					title: el.title,
					duration: el.duration,
					source: el.preview,
					artist: el.artist.name,
					cover: el.album.cover_small
				}
			});

			plData = {
				title: plData.title,
				link: plData.link,
				cover: plData.picture,
				author: plData.user.name
			};

			plData.tracks = tracks;
			return plData;
		}

	}

module.exports = Deezer;