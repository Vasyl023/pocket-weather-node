const rp = require('request-promise');

class Youtube {

    constructor() {
        this.apiKey = 'AIzaSyBH__Lnq26dnriBiNBAZMgqEXrP2kCa2y8';
        this.baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    }

    search(query, limit) {
        return rp(
            `${this.baseUrl}?part=snippet&q=${query}&maxResults=${limit}&key=${this.apiKey}`
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