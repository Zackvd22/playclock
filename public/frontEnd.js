//This handles the front end socket stuff

var socket = io();


function test(){
    socket.emit('test');
}
