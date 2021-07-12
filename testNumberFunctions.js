var ledstrip = require('rpi-ws281x');
const NUM_PIXELS = 602;

ledstrip.configure({leds:NUM_PIXELS});

var pixelData = new Uint32Array(NUM_PIXELS);


const RED = (255<<8);
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

// for (i in numArray){
//     ledstrip.render(numArray[i]);
//     ledstrip.sleep(50);
// }


display(11,10);

function display(min, sec){

    min_2 = numArray[(min%10)];
    min_1 = numArray[parseInt(min/10)];
    sec_2 = numArray[(sec%10)];
    sec_1 = numArray[parseInt(sec/10)];

    pixelData = Uint32Array.from([...min_1,...min_2,...dots,...sec_1,...sec_2]);

    ledstrip.render(pixelData);
}