var schedule = require('node-schedule');
const rp = require('request-promise');

let j = schedule.scheduleJob('0,30 * * * *', function(){
	console.log(`Running scheduled task - ${new Date()}`);
	rp(`http://localhost:8000/weather/49.83/24`).catch(err => console.log(err));
});