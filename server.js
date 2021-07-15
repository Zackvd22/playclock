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
var ledstrip    = require('rpi-ws281x');
const { Console } = require('console');

// handle express init
const HTTP_PORT = 80;
var expressApp = EXPRESS();
var httpServer = HTTP.createServer(expressApp);


// Instantiate Timers
var gameClock = new Timer({callback: gameClockUpdate,countdown : true, startValues: {'minutes': 10, 'seconds': 0}});
var playClock = new Timer({callback: playClockUpdate,countdown : true, startValues: {'minutes': 0, 'seconds': 40}});
var practiceTimer = new Timer({callback: practiceTimerUpdate,countup : true});

// Handle all of led init
const NUM_PIXELS = 602;

ledstrip.configure({leds:NUM_PIXELS});
var pixelData = new Uint32Array(NUM_PIXELS);

const RED = (255<<8);

// LED number lookup table
var numOne = new Uint32Array(146);
numOne = numOne.fill(RED,42,84);

var numZero = new Uint32Array(146);
numZero = numZero.fill(RED,0,126);

var numTwo = new Uint32Array(146);
numTwo = numTwo.fill(RED,21,63).fill(RED,84);

var numThree = new Uint32Array(146);
numThree = numThree.fill(RED,21,105).fill(RED,126);

var numFour = new Uint32Array(146);
numFour = numFour.fill(RED,0,21).fill(RED,42,84).fill(RED,126);

var numFive = new Uint32Array(146);
numFive = numFive.fill(RED,0,42).fill(RED,63,105).fill(RED,126);

var numSix = new Uint32Array(146);
numSix = numSix.fill(RED,0,42).fill(RED,63);

var numSeven = new Uint32Array(146);
numSeven = numSeven.fill(RED,21,84);

var numEight = new Uint32Array(146);
numEight = numEight.fill(RED);

var numNine = new Uint32Array(146);
numNine = numNine.fill(RED,0,84).fill(RED,126);

var dots = new Uint32Array(18);
dots = dots.fill(RED);

var numArray = [numZero,numOne,numTwo,numThree,numFour,numFive,numSix,numSeven,numEight,numNine];


// activeTimer definition:
// 0 = no timer shown
// 1 = game clock shown
// 2 = play clock shown
// 3 = practice timer shown
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
    activeClockUpdate();


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

    socket.on('gameClockAdd', function(min,sec){
        gameClock.pause();
        currentMin = parseInt(gameClock.getTimeValues().minutes) + min;
        currentSec = gameClock.getTimeValues().seconds + sec;

        //gameClock.startValues = {'minutes': min,'seconds': sec};
        //gameClock.start();
        gameClock.stop();
        gameClock.start({startValues: {'minutes': currentMin,'seconds': currentSec}});
        gameClock.pause();

    });

    socket.on('setClockActive', function(selection){
        activeTimer = selection;
        activeClockUpdate();
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
    if (activeTimer == 1){
        showNum(min,sec);
    }
    IO.sockets.emit('gameClockUpdate',sec,min);
}

function playClockUpdate(){
    sec = playClock.getTimeValues().seconds;
    min = playClock.getTimeValues().minutes;
    if (activeTimer == 2){
        showNum(min,sec);
    }
    IO.sockets.emit('playClockUpdate', sec,min);
}

function practiceTimerUpdate(){
    sec = practiceTimer.getTimeValues().seconds;
    min = practiceTimer.getTimeValues().minutes;
    if (activeTimer == 3){
        showNum(min,sec);
    }    
    IO.sockets.emit('practiceTimerUpdate', sec,min);
}

function activeClockUpdate(){
    IO.sockets.emit('clockSet', activeTimer);
}

function showNum(min,sec){
    // lookup numbers from numArray table
    min_2 = numArray[(min%10)];
    min_1 = numArray[parseInt(min/10)];
    sec_2 = numArray[(sec%10)];
    sec_1 = numArray[parseInt(sec/10)];

    //Fill in pixel Data Array
    pixelData = Uint32Array.from([...min_1,...min_2,...dots,...sec_1,...sec_2]);
    ledstrip.render(pixelData); //render number
}


// handle exit gracefully
process.on('SIGINT', () => {
    console.log('Closing...');
       process.exit(0);
});