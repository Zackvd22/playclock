// File: server.js
// Name: Zack Van Dyke
// Date: 8/20/2020
// Desc: Creates a node Socket.io server that is the interface for controlling 
//       various LED strips.
// Usage: The user can navigate the web page and select a function for an LED
//        strip to perform and the server forwards the information to the
//        appropriate raspberry pi via TCP to handle the request.
//
// Other files requried: index.html, ledControl.html


// ========== Imports ===============
// import all requred node packages
var   IO         = require('socket.io');  // include socket.io module for socket.io webpage
const EXPRESS    = require('express')     // include express module for serving up webpages
const HTTP       = require('http')        // include http module to set up express as an http server.
const { networkInterfaces, platform } = require('os'); // used to look up IP of host machine


const NICS = networkInterfaces();
//const DGRAM_SERVER = DGRAM.createSocket('udp4'); //create a UDP server

const HTTP_PORT = 80;

var IPV4; // the index for networkInterfaces determines. Set based on OS

// ============ Network Interface Selection =============
// sets "IPV4" the order of the protocol families is dependant on the host OS
if(platform() == 'win32') IPV4 = 0; // only tested on windows and linux
else IPV4 = 1;
console.log(platform());
console.log(NICS);

/*
var expressApp = EXPRESS();
var httpServer = HTTP.createServer(expressApp);
expressApp.use(EXPRESS.static(__dirname + '/public_html/'));
expressApp.get('/', function(req,res){
    var url = req.url;
    console.log("Request for : %s", url);
    res.sendFile('/index.html');
});

httpServer.listen(HTTP_PORT, function(err){
    if (err) {
        return console.log('An error occured: %s', err)
    }
    console.log('Http server is listening on port: %s', HTTP_PORT)
});

attachSocketIO(httpServer);





// ============== Attach Socket IO to the HTTP Server ================
IO = IO(server); // after creating an http.Server get the socket.io instance object. (had to do this to keep imports at the top)
IO.listen(server); // socket.io begins listening for http connections
IO.on('connection', function (socket) {
    console.log('User Connected');

        //socket.on('someFunction', someFunction(data));
        socket.on('networkDiscovery', function(){netDiscovery()});

        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function () {
            console.log('User Disconnected');
            IO.sockets.emit('connectionStatus', { description: "Disconnected" });
        });
    });
*/

// handle exit gracefully
process.on('SIGINT', () => {
    console.log('Closing...');
    try {
        DGRAM_SERVER.close();
    } catch (err) {
        console.log("Oops!");
        console.log(err);
    }
    
    process.exit(0);
});