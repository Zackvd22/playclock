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


// Instantiate Timers
var gameClock = new Timer({callback: gameClockUpdate,countdown : true, startValues: {'minutes': 10, 'seconds': 0}});
var playClock = new Timer({callback: playClockUpdate,countdown : true, startValues: {'minutes': 0, 'seconds': 40}});
var practiceTimer = new Timer({callback: practiceTimerUpdate,countup : true});


// activeTimer definition:
// 0 = no timer shown
// 1 = game clock shown
// 2 = play clock shown
// 3 = practice timer shown

// may add later
// 4 = clock shown

var activeTimer = 0; // determines which clock is shown on board see above


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

// Do things when user connects
IO.on('connection', function (socket) {

    //update all timers for user
    gameClockUpdate();
    playClockUpdate();
    practiceTimerUpdate();

    // event lisnters for functions defined in the frontEnd.js
    // Handle game clock information
    socket.on('gameClockStart', function(){
        gameClock.start(); 
    });

    socket.on('gameClockPause', function(){
        gameClock.pause();
    });

    socket.on('gameClockSet', function(min, sec){
        gameClock.stop();
        gameClock.start({startValues: {'minutes': min,'seconds': sec}});
        gameClock.pause();
    });
    socket.on('setGameClockActive', function(){
        activeTimer = 1;
    });


    //Handle play clock information
    socket.on('playClockStart', function(){
        playClock.start();
    });

    socket.on('playClockPause',function(){
        playClock.pause();
    });

    socket.on('playClockSet', function( min, sec){
        playClock.stop();
        playClock.start({startValues:{'minutes' : min, 'seconds' : sec}});
        playClock.pause();
    });
    socket.on('setPlayClockActive', function(){
        activeTimer = 2;
    });

    //Handle Practice Timer
    socket.on('practiceTimerStart', function(){
        practiceTimer.start();
    });

    socket.on('practiceTimerPause', function(){
        practiceTimer.pause();
    });

    socket.on('practiceTimerReset', function(){
        practiceTimer.reset();
        practiceTimer.pause();
        practiceTimerUpdate();
    });
    socket.on('setPracticeTimerActive', function(){
        activeTimer = 3;
    });

    

    socket.on('timersNotActive', function(){
        activeTimer = 0;
    });
});



// Listners for all timers
gameClock.addEventListener('started', function (e) {
    gameClockUpdate();
});

playClock.addEventListener('started', function (e) {
    playClockUpdate();
});

practiceTimer.addEventListener('started', function (e) {
    practiceTimerUpdate();
});




// Update functions for timers
function gameClockUpdate(){
    sec = gameClock.getTimeValues().seconds;
    min = gameClock.getTimeValues().minutes;
    IO.sockets.emit('gameClockUpdate', sec,min);
}

function playClockUpdate(){
    sec = playClock.getTimeValues().seconds;
    min = playClock.getTimeValues().minutes;
    IO.sockets.emit('playClockUpdate', sec,min);
}

function practiceTimerUpdate(){
    sec = practiceTimer.getTimeValues().seconds;
    min = practiceTimer.getTimeValues().minutes;
    IO.sockets.emit('practiceTimerUpdate', sec,min);
}



// handle exit gracefully
process.on('SIGINT', () => {
    console.log('Closing...');
       process.exit(0);
});