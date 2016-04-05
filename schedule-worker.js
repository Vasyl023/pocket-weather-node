var schedule = require('node-schedule');
const rp = require('request-promise');

var j = schedule.scheduleJob('0,30 * * * *', function(){
	console.log('running scheduled task');
	rp(`http://localhost:8000/weather/49.83/24`);
});