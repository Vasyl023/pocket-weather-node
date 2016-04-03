const rp = require('request-promise');
const fs = require('fs');


	class Deezer {

		constructor() {

		}

		search(q) {
			return rp(`https://api.deezer.com/search/playlist?q=${q}`);
		}

		getPlaylist(q) {
			return this.search(q).then((res) => {
				return this.getTracks(JSON.parse(res))
			})
		}

		getTracks(res) {

			var limit = res.total >= 25 ? 25 : res.total - 1;
			var idx = Math.floor(Math.random() * (limit - 0 + 1));

			//console.log('\n-----------\nDEEZER RESPONSE:', res.total);
			//console.log(`INDEX  --> ${idx}`);
			fs.appendFile('./log.txt', '\nDeezer:\n'+JSON.stringify({
				playlistData: res.data[idx]
			}), err => {
				console.log(err)
			});

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