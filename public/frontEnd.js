// File: frontEnd.js
// Name: Zack Van Dyke
// Date: 11/24/2020
// Desc: Client side JS for playclock controller
// Usage: Used to pass data from HTML to server side




var socket = io(); // include the socket.io package


// game clock functions
function gameClockStart(){
    socket.emit('gameClockStart',);
}
function gameClockPause(){
    socket.emit('gameClockPause');
}

function gameClockSet(sec, min){
    socket.emit('gameClockSet', parseInt(min), parseInt(sec));
}

function gameClockAdd(sec, min){
    socket.emit('gameClockAdd', parseInt(min), parseInt(sec));
}

function submitCustomTime(){
    var min = document.getElementById("testMin").value;
    var sec = document.getElementById("testSec").value;

    // if the user enters nothing assume they meant zero
    if(!min) min = 0;
    if(!sec) sec = 0;

    //parse to ineger
    min = parseInt(min);
    sec = parseInt(sec);

    //if parsing fails alert user and leave the function
    if(isNaN(min) || isNaN(sec)){
        alert("Invalid Time Given");
        return;
    }

    // send data to controller
    gameClockSet(sec, min);
}

function setClockActive(selection){
    socket.emit('setClockActive', selection);
}

// socket listner to update 
socket.on('gameClockUpdate', function(sec,min){
    if(sec < 10){
        sec = '0' + sec.toString();
    }
    var time = min.toString() + ':' + sec.toString();
    document.getElementById("gameClockTime").innerHTML = time;
});





// play clock funtions
function playClockStart(){
    socket.emit('playClockStart',);
}

function playClockPause(){
    socket.emit('playClockPause');
}

function playClockSet(sec, min){
    socket.emit('playClockSet', parseInt(min), parseInt(sec));
}

// socket listner to update 
socket.on('playClockUpdate', function(sec,min){
    if(sec < 10){
        sec = '0' + sec.toString();
    }
    var time = min.toString() + ':' + sec.toString();
    document.getElementById("playClockTime").innerHTML = time;
});



// practice timer funtions
function practiceTimerStart(){
    socket.emit('practiceTimerStart',);
}

function practiceTimerPause(){
    socket.emit('practiceTimerPause');
}

function practiceTimerReset(){
    socket.emit('practiceTimerReset');
}

// socket listner to update 
socket.on('practiceTimerUpdate', function(sec,min){
    if(sec < 10){
        sec = '0' + sec.toString();
    }
    var time = min.toString() + ':' + sec.toString();
    document.getElementById("practiceTimer").innerHTML = time;
});


socket.on('clockSet', function(selection){
    if(selection == 1)
    {
        document.getElementById("gameClockHeader").style.backgroundColor = '#4CAF50';
        document.getElementById("playClockHeader").style.backgroundColor = 'white';
        document.getElementById("practiceTimerHeader").style.backgroundColor = 'white';
    }
    else if (selection == 2) 
    {
        document.getElementById("gameClockHeader").style.backgroundColor = 'white';
        document.getElementById("playClockHeader").style.backgroundColor = '#4CAF50';
        document.getElementById("practiceTimerHeader").style.backgroundColor = 'white';        
    } 
    else if (selection == 3)
    {
        document.getElementById("gameClockHeader").style.backgroundColor = 'white';
        document.getElementById("playClockHeader").style.backgroundColor = 'white';
        document.getElementById("practiceTimerHeader").style.backgroundColor = '#4CAF50';  
    }
    else
    {
        document.getElementById("gameClockHeader").style.backgroundColor = 'white';
        document.getElementById("playClockHeader").style.backgroundColor = 'white';
        document.getElementById("practiceTimerHeader").style.backgroundColor = 'white';      
    }
});

// helper function to change to the focus to the next object
function moveOnMax(field,nextFieldID){
    if(field.value.length >= field.maxLength){
      document.getElementById(nextFieldID).focus();
      try{
        document.getElementById(nextFieldID).select();
      }
      catch{
      }
      
    }
}