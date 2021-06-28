import {SoundEffect} from "/utilities/sound.js";

var PROB_HAS_TOP = 0.25;
var PROB_HAS_BOTTOM = 0.25;
var MIN_Y_GAP = 0.4;
var MAX_TOP = 0.75;
var MAX_BOTTOM = 0.25; 
var NUM_OBS = 10;
var SCROLL_RATE = 0.0001;
var bgPosX = 0;
var BG_RATE = 0.08;
var TIMENOW;

var obs = [];
var startButton;
var endButton;
// var bgImg;
var bigBGImg;
var can;
var con;
var testCan;
var testCon;
var bcr;
var pigImg;
var bird = { 
    img: undefined,
    pos:{
        x: 0.5,
        y: 0.25
    },
    dim:{
        x: 0.1,
        y: 0.2
    },
    flap: undefined,
    vel:{
        x: 0,
        y: 0
    }
}
var flap = 0.001;
var GRAVITY = 0.000002;
var timePrior = 0;

window.onload = init;


function animate(timeNow) {
    con.clearRect(0,0, bcr.width, bcr.height);
    TIMENOW = timeNow;
    var timeChange = timeNow - timePrior;
    bgPosX -= BG_RATE * timeChange;
    if (bgPosX < -bcr.width * 2) {
        bgPosX += bcr.width * 2;
    }

    bird.vel.y += GRAVITY * timeChange;
    bird.pos.y += bird.vel.y * timeChange;
    if (bird.pos.y < 0){
        bird.pos.y = 0;
        bird.vel.y = 0
    }
    if (bird.pos.y > 1 - bird.dim.y/2){
        bird.pos.y = 1 - bird.dim.y/2;
        bird.vel.y = 0;
    }
    var num_obs = obs.length;
    for (var i = 0; i < num_obs; i++) {
        var ob = obs[i];
        ob.pos.x -= SCROLL_RATE * timeChange;
        if (ob.pos.x + ob.dim.x/2 < 0) {
            ob.pos.x += (3 - ob.dim.x/2);
        }

    }

    con.drawImage(bigBGImg, bgPosX, 0, bcr.width * 3, bcr.height);
    con.drawImage(
        bird.img, 
        (bird.pos.x - bird.dim.x/2) * bcr.width, 
        (bird.pos.y - bird.dim.y/2) * bcr.height,
        bird.dim.x * bcr.width, 
        bird.dim.y * bcr.height
        );

    for (var i = 0; i < num_obs; i++) {
        var ob = obs[i];
        con.drawImage(ob.img, (ob.pos.x - ob.dim.x/2) *
            bcr.width, (ob.pos.y - ob.dim.y/2) * bcr.height,
            ob.dim.x * bcr.width, ob.dim.y * bcr.height);
    }

    con.font = "30px Comic Sans MS";
    con.fillStyle = "blue";
    con.textAlign = "left";
    con.fillText(TIMENOW, 10, 30);

    for (var i = 0; i < num_obs; i++) {
        var ob =obs[i];
        if (bird.pos.x - bird.dim.x/2 < ob.pos.x + ob.dim.x/2 && 
            bird.pos.x + bird.dim.x/2 > ob.pos.x - ob.dim.x/2 &&
            bird.pos.y - bird.dim.y/2 < ob.pos.y + ob.dim.y/2 &&  
            bird.pos.y + bird.dim.y/2 > ob.pos.y - ob.dim.y/2    
             ) {
                endButton.style.display = "block";
            //     testCon.strokeStyle = "red";
            //     testCon.strokeRect(
            //         (ob.pos.x - ob.dim.x/2) * bcr.width,
            //         (ob.pos.y - ob.dim.y/2) * bcr.height,
            //         ob.dim.x * bcr.width,
            //         ob.dim.y * bcr.height
            //     );
            }
    }

    timePrior = timeNow;
    requestAnimationFrame(animate);
}

function end() {
    endButton.style.display = "none";
   // TIMENOW = 0;
    //num_obs = 0;
    con.clearRect(0,0, bcr.width, bcr.height);
    setInterval( () => {
        testCon.clearRect(0, 0, bcr.width, bcr.height);
    }, 1000);  
    console.log("end");
    requestAnimationFrame(animate);
}

function handleFlap() {
    bird.vel.y -= flap;
    bird.flap.play();
}

function init() {
    startButton = document.getElementById("startButton");
    startButton.addEventListener("click", start);
    endButton = document.getElementById("endButton");
    endButton.addEventListener("click", end);
    can = document.getElementById("can"); 
    con = can.getContext("2d");
    testCan = document.getElementById("test"); 
    testCon = testCan.getContext("2d");
    bird.img = document.getElementById("bird");
    pigImg = document.getElementById("pig");
    bigBGImg = document.getElementById("bigBG");
    // bgImg = document.getElementById("bg");
    bird.flap = new SoundEffect("flap.mp3");
    makeObs();
    testCan.addEventListener("click", handleFlap);
    window.onresize = resize;
    resize();
}

function makeObs() {
    for (var i = 0; i < NUM_OBS; i++) {
        //var imge = Math.random() <0.1 ? pigImg :LlamaImg;
        var height = Math.random() * 0.4;
        obs.push({
            img: pigImg,
            pos:{
                x: Math.random() * 3 + 1,
                y: 0 
            },
            dim:{
                x: 0.1,
                y: height
            }
        });
    }
    for (var i = 0; i < NUM_OBS; i++) {
        var height = Math.random() * 0.4;
        obs.push({
            img: pigImg,
            pos:{
                x: Math.random() * 3 + 1,
                y: 1 - height/2
            },
            dim:{
                x: 0.1,
                y: height
            }
        });
    }
}

function resize() {
    bcr = document.body.getBoundingClientRect();
    can.width = bcr.width;
    can.height = bcr.height;
    testCan.width = bcr.width;
    testCan.height = bcr.height;
}

function start() {
    startButton.style.display = "none";
    setInterval( () => {
        testCon.clearRect(0, 0, bcr.width, bcr.height);
    }, 1000);  
    requestAnimationFrame(animate);
}