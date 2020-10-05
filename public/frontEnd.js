var socket = io();

function gameClockStart(){
    var min = document.getElementById("gameClockMin").value;
    var sec = document.getElementById("gameClockSec").value;
    console.log(min);
    console.log(sec);
    socket.emit('gameClockStart', parseInt(min), parseInt(sec));
}
function gameClockStop(){
    socket.emit('gameClockStop');
}
function gameClockReset(){
    var min = document.getElementById("gameClockMin").value;
    var sec = document.getElementById("gameClockSec").value;
    socket.emit('gameClockReset', parseInt(min), parseInt(sec));
}
function gameClockSet(sec, min){
    socket.emit('gameClockReset', parseInt(min), parseInt(sec));
}

// write to user
socket.on('gameClockUpdateTime', function(sec,min){
    if(sec < 10){
        sec = '0' + sec.toString();
    }
    var time = min.toString() + ':' + sec.toString();
    document.getElementById("gameClockTime").innerHTML = time;
});