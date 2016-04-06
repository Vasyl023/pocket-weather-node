const rp = require('request-promise');
rp(`http://localhost:8000/weather/49.83/24`).catch(err => console.log(err));