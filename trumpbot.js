var five = require("johnny-five");
var pixel = require("node-pixel");
var board = new five.Board();
var strip = null;

function createRemap(inMin, inMax, outMin, outMax) {
    return function remaper(x) {
        return Math.ceil((x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
    };
}

function createRGBMap(rgbArr) {
    return function remaper(x) {
        var nr = Math.ceil(x * rgbArr[0] / 100);
        var ng = Math.ceil(x * rgbArr[1] / 100);
        var nb = Math.ceil(x * rgbArr[2] / 100);

        return [nr, ng, nb];
    };
}

var rgbRemap = createRemap(0, 255, 27, 128)

function rgbStr(rgbArr) {
  var r = Math.round(rgbRemap(rgbArr[0]));
  var g = Math.round(rgbRemap(rgbArr[1]));
  var b = Math.round(rgbRemap(rgbArr[2]));
  var s = "rgb(" + r + "," + g + "," + b + ")"
  console.log(s)
  return s
}

function loopColor() {
  setTimeout(loopColor, 100);  
}

// Servos
var hStart = 90;
var hMin = 50;
var hMax = 130;
var hMap = createRemap(0, 100, hMin, hMax);

var vStart = 55;
var vMin = 30;
var vMax = 80;
var vMap = createRemap(0, 100, vMin, vMax);

var mStart = 0;
var mMin = 0;
var mMax = 100;
var mMap = createRemap(0, 100, mMin, mMax);

var eyeX = 50;
var eyeY = 50;

// Colors
var eyeColors = [0, 0, 0];
var rgbMap = createRGBMap(eyeColors);

var icyBlue = [165,243,255];
var evilRed = [255,0,0];

board.on("ready", function() {

  // Initialize LEDs
   strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 9, length: 2}, ], // this is preferred form for definition
        gamma: 2.8, // set to a gamma that works nicely for WS2812
    });

  // Initialize a Servo collection
  // 0 : Horizontal
  // 1 : Vertical
  var eyeHS = new five.Servo({
        pin: 11, 
        range: [hMin,hMax],
        startAt: hStart
      }
    )
  var eyeVS = new five.Servo({
        pin: 12, 
        range: [vMin,vMax],
        startAt: vStart
      }
    )
  var mouthS = new five.Servo({
        pin: 10, 
        range: [mMin,mMax],
        startAt: mStart
      }
    )
  var eye_servos = new five.Servos([eyeHS, eyeVS]);

  var eyeControl = function(x,y){
    console.log('x: ' + x +' y: ' + y);
    console.log('eyeX: ' + eyeX + ' eyeY: ' + eyeY);
    console.log('hmapeyeX: ' + hMap(eyeX) + ' hmapeyeY: ' + vMap(eyeY));
    console.log('hmapx: ' + hMap(x) + ' hmapy: ' + vMap(y));
    var deltaX = hMap(x) - hMap(eyeX);
    var deltaY = vMap(y) - vMap(eyeY);
    console.log('deltaX: ' + deltaX + ' deltaY: ' + deltaY);
    //hDelta = createRemap(0, 100, 0, deltaX);
    //vDelta = createRemap(0, 100, 0, deltaY);
    hDelta = createRemap(0, 100, hMap(eyeX), hMap(x));
    vDelta = createRemap(0, 100, vMap(eyeY), vMap(y));
    var animation = new five.Animation(eye_servos);
    animation.enqueue({
      duration: 1000,
      cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
      keyFrames: [ 
        [{degrees: hDelta(0)}, {degrees: hDelta(25)}, {degrees: hDelta(50)}, {degrees: hDelta(75)}, {degrees: hDelta(100)}],
        [{degrees: vDelta(0)}, {degrees: vDelta(25)}, {degrees: vDelta(50)}, {degrees: vDelta(75)}, {degrees: vDelta(100)}],
      ]
    });
    //console.log(animation)
    eyeX = x;
    eyeY = y;
    console.log('eyeX: ' + eyeX + ' eyeY: ' + eyeY);
    console.log('hmapeyeX: ' + hMap(eyeX) + ' hmapeyeY: ' + vMap(eyeY));
  }

  var setEyeColorArr = function(rgbArr) {
    setEyeColor(rgbArr[0], rgbArr[1], rgbArr[2])
  }

  var setEyeColor = function(r,g,b){
    eyeColors = [r, g, b];
    rgbMap = createRGBMap(eyeColors);
    strip.color(rgbStr(eyeColors)); // turns entire strip red using a hex colour
    strip.show();
  } 

  // x: 0-100
  var setIntensity = function(x) {
    strip.color(rgbStr(rgbMap(x)));
    strip.show();
  }
  var mouthAnim = new five.Animation(mouthS);
  var idleAnim = new five.Animation(eye_servos);
  
  function makeEyeDeltaAnim(fromX, fromY, toX, toY){
    var deltaX = hMap(toX) - hMap(fromX);
    var deltaY = vMap(toY) - vMap(fromY);

    console.log('fromX: ' + fromX +' fromY: ' + fromY);
    console.log('toX: ' + toX + ' toY: ' + toY);
    //console.log('hmapeyeX: ' + hMap(eyeX) + ' hmapeyeY: ' + vMap(eyeY));
    //console.log('hmapx: ' + hMap(x) + ' hmapy: ' + vMap(y));
    
    hDelta = createRemap(0, 100, hMap(fromX), hMap(toX));
    vDelta = createRemap(0, 100, vMap(fromY), vMap(toY));
    var s = {
      duration: 2000,
      cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
      keyFrames: [ 
        [{degrees: hDelta(0)}, {degrees: hDelta(25)}, {degrees: hDelta(50)}, {degrees: hDelta(75)}, {degrees: hDelta(100)}],
        [{degrees: vDelta(0)}, {degrees: vDelta(25)}, {degrees: vDelta(50)}, {degrees: vDelta(75)}, {degrees: vDelta(100)}],
      ]
    };
    console.log(s)
    return s;
  }
var t = undefined;
var count = 0;
  function addRandomEye(){
    newX = Math.round(Math.random() * 100);
    newY = Math.round(Math.random() * 100);
    s = makeEyeDeltaAnim(eyeX, eyeY, newX, newY)
    console.log(s.keyFrames)
    idleAnim.enqueue(s);
    
    eyeX = newX;
    eyeY = newY;
    count += 1;
    console.log(count);
    if(count >= 10) {
      clearInterval(t);
    }
  }

  function randEyes() {
      count = 0
      console.log("Adding segment", count)
      t = setInterval(addRandomEye, 1000);
  }  

  function talk() {
    idleAnim.stop()
    setEyeColorArr(evilRed);
    eye_servos.center();
    mouthAnim.enqueue({
      duration: 750,
      metronomic: true,
      loop: true,
      keyFrames: [{degrees: mMin}, {degrees: mMax}]
    });
  }

  function shut_up() {
    mouthAnim.stop();
    mouthS.to(mMin)
    setEyeColorArr(icyBlue);
    randEyes();
  }

  setEyeColorArr(icyBlue);
  randEyes();

  // Inject the `servo` hardware into
  // the Repl instance's context;
  // allows direct command line access
  this.repl.inject({
    eyeControl: eyeControl,
    setEyeColor: setEyeColor,
    setIntensity: setIntensity,
    strip: strip,
    randEyes: randEyes,
    mouthS: mouthS,
    talk: talk,
    shut_up: shut_up
  });
});