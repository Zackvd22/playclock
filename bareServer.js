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
var   IO         = require('socket.io');  // include socket.io module for socket.io webpage
const EXPRESS    = require('express')     // include express module for serving up webpages
const HTTP       = require('http')        // include http module to set up express as an http server.

const HTTP_PORT = 80;

var expressApp = EXPRESS();
var httpServer = HTTP.createServer(expressApp);

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
    console.log('User Connected');

    //socket.on('someFunction', someFunction(data));
    socket.on('test', function(){netDiscovery()});

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('User Disconnected');
        IO.sockets.emit('connectionStatus', { description: "Disconnected" });
    });
});


// handle exit gracefully
process.on('SIGINT', () => {
    console.log('Closing...');
       process.exit(0);
});