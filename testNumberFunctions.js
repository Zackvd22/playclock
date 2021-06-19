const red = (255<<16);
var numOne = new Uint32Array(146);
numOne = numOne.fill(red,42,84);

var numTwo = new Uint32Array(146);
numTwo = numTwo.fill(red,21,63).fill(red,84);

var numThree = new Uint32Array(146);
numThree = numThree.fill(red,21,105).fill(red,126);

var numFour = new Uint32Array(146);
numFour = numFour.fill(red,0,21).fill(red,42,84).fill(red,126);

var numFive = new Uint32Array(146);
numFive = numFive.fill(red,0,42).fill(red,63,105).fill(red,126);

var numSix = new Uint32Array(146);
numSix = numSix.fill(red,0,42).fill(red,63);

var numSeven = new Uint32Array(146);
numSeven = numSeven.fill(red,21,84);

var numEight = new Uint32Array(146);
numEight = numEight.fill(red);

var numNine = new Uint32Array(146);
numNine = numNine.fill(red,0,84).fill(red,126);

var numZero = new Uint32Array(146);
numZero = numZero.fill(red,0,126);

var numArray = [numZero,numOne,numTwo,numThree,numFour,numFive,numSix,numSeven,numEight,numNine]

console.log(numArray[0][41],numArray[0][42]);