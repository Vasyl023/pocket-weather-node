## README.MD

Set up project 

    npm install
    nodemon --harmony index
    
Nodemon server will watch for changes and reload the server as well as
do immediate running of the `event.restart` as defined in `nodemon.json`. Currently 
it triggers a GET request to the weather endpoint.
 
Run `node --harmony schedule-worker.js` in another terminal tab to start cron,
which will run every 30 minutes and perform the same GET request to the endpoint to
seed the db with the sample data.