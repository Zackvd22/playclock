// File: bareServer.js
// Name: Zack Van Dyke
// Date: 10/04/2020
// Desc: Creates a simple node Socket.io server that can serve up index.html
// Usage: The user can navigate the web page
//
// Other files requried: index.html, 
//                       see public directory


// ========== Imports ===============
// import all requred node packages
var   IO        = require('socket.io');  // include socket.io module for socket.io webpage
const EXPRESS   = require('express')     // include express module for serving up webpages
const HTTP      = require('http')        // include http module to set up express as an http server.
var Timer       = require('easytimer.js').Timer;


const HTTP_PORT = 80;
var expressApp = EXPRESS();
var httpServer = HTTP.createServer(expressApp);

var gameClock = new Timer({callback: gameClockUpdate,countdown : true});

// use express to serve requests to the specified html pages
expressApp.use(EXPRESS.static(__dirname + '/public/'));
expressApp.get('/', function(req,res){
    var url = req.url;
    console.log("Request for : %s", url);
    res.sendFile('/index.html');
});

// begin listening for http traffic on port 80
httpServer.listen(HTTP_PORT, function(err){
    if (err) {
        return console.log('An error occured: %s', err)
    }
    console.log('Http server is listening on port: %s', HTTP_PORT)
});

// ============== Attach Socket IO to the HTTP Server ================
IO = IO(httpServer); // after creating an http.Server get the socket.io instance object. (had to do this to keep imports at the top)
IO.listen(httpServer); // socket.io begins listening for http connections
IO.on('connection', function (socket) {
    gameClockUpdate();
    //socket.on('someFunction', someFunction(data));
    socket.on('gameClockStart', function(min, sec){
        //gameClock.start({countdown: true, startValues: {'minutes': min,'seconds': sec}});   
        gameClock.start(); 
    });
    socket.on('gameClockStop', function(){
        gameClock.pause();
    });
    socket.on('gameClockReset', function(min, sec){
        gameClock.stop();
        gameClock.start({startValues: {'minutes': min,'seconds': sec}});
        console.log(gameClock.getConfig());
        gameClock.pause();
    });
});

gameClock.addEventListener('started', function (e) {
    gameClockUpdate();
});
function gameClockUpdate(){
    sec = gameClock.getTimeValues().seconds;
    min = gameClock.getTimeValues().minutes;
    IO.sockets.emit('gameClockUpdateTime', sec,min);
}

// handle exit gracefully
process.on('SIGINT', () => {
    console.log('Closing...');
       process.exit(0);
});