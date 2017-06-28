var scene, transparentBackground, spaceImages = ["img/lander/background/Background-2.jpg", "img/lander/background/Background-3.jpg", "img/lander/background/Background-4.jpg", "img/lander/background/Background-5.jpg", "img/lander/background/Background-6.jpg", "img/lander/background/Background-7.jpg", "img/lander/background/Background-8.jpg", "img/lander/background/Background-9.jpg", "img/lander/background/Background-10.jpg", "img/lander/background/Background-11.jpg", "img/lander/background/Background-12.jpg", "img/lander/background/Background-13.jpg", "img/lander/background/Background-14.jpg"],
    lander, platform, spacemoths, spacecrabs = [], life_250, message = "", spaceMP3, spaceOGG, moth_crashMP3, moth_crashOGG, life_250MP3, life_250OGG, NUMSPACEMOTHS = 3, fuel = 12000, level = 1,
    directions = {
        left :  {   dir : "left",
                    angle : 270},
        right : {   dir : "right",
                    angle : 90},
        up :    {   dir : "up",
                    angle : 0},
        down :  {   dir : "down",
                    angle : 180}
    };
function init() {
    scene = new Scene();
    scene.setSize(window.innerWidth, window.innerHeight);
    scene.setBG("transparent");
    transparentBackground = new Sprite(scene, "img/lander/fullyTransparent.png", 2560, 1600);
    transparentBackground.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    transparentBackground.setSpeed(0);
    spacecrabs.push(new SpaceCrab());
    life_250 = new Life_250();
    
    stats = document.getElementById("game_stats");
    setupSpaceMoths();
    
    spaceMP3 = new Sound("sounds/space.mp3");
    spaceOGG = new Sound("sounds/space.ogg");
    moth_crashMP3 = new Sound("sounds/moth_crash.mp3");
    moth_crashOGG = new Sound("sounds/moth_crash.ogg");
    life_250MP3 = new Sound("sounds/life_250.mp3");
    life_250OGG = new Sound("sounds/life_250.ogg");
    spaceMP3.play();
    spaceOGG.play();
    
    scene.start();
} // end ini

function update() {
    scene.clear();
    transparentBackground.update();
    
    for (i = 0; i < NUMSPACEMOTHS; i++) {
        spacemoths[i].wriggle();
        spacemoths[i].update();
    } // end for loop
    
    if (spacecrabs.length < 30) {
        spacecrabs.push(new SpaceCrab());
    }
    for (i = 0; i < spacecrabs.length; i++) {
        spacecrabs[i].changeDirectionEvery2Seconds();
        spacecrabs[i].update();
    }
    life_250.showStats();
    life_250.update();
} // end update

function setupSpaceMoths() {
    spacemoths = new Array(NUMSPACEMOTHS);
    for (i = 0; i < NUMSPACEMOTHS; i++) {
        spacemoths[i] = new SpaceMoth();
    } // end for
} // end setupSpaceMoths

function restart() {
    document.location.href = "";
} // end restart

function SpaceMoth(){
    tSpaceMoth = new Sprite(scene, "img/lander/spacemoth.png", (window.innerWidth+window.innerHeight)/25, (window.innerWidth+window.innerHeight)/25);
    tSpaceMoth.setSpeed(1);
    tSpaceMoth.wriggle = function(){
        //change direction by some random amount
        newDir = (Math.random() * 90) - 45;
        this.changeAngleBy(newDir);
    }; // end wriggle
    
    tSpaceMoth.reset = function(){
        //set new random position
        newX = Math.random() * this.cWidth;
        newY = Math.random() * this.cHeight;
        this.setPosition(newX, newY);
    }; // end reset
    
    tSpaceMoth.reset();
    
    return tSpaceMoth;
} // end Spacemoth

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
    result = prop;
    return result;
}

function SpaceCrab(){
    tSpaceCrab = new Sprite(scene, "img/lander/r-typesheet20_new.png", (window.innerWidth+window.innerHeight)/37, (window.innerWidth+window.innerHeight)/37);
    tSpaceCrab.loadAnimation(99, 128, 33, 32);
    tSpaceCrab.generateAnimationCycles();
    tSpaceCrab.renameCycles(new Array("down", "up", "left", "right"));
    tSpaceCrab.setAnimationSpeed(500);
    tSpaceCrab.myTimer = new Timer();

        //start paused
    tSpaceCrab.setSpeed(3);
    tSpaceCrab.changeDirection = function(){
        var myDir = pickRandomProperty(directions);
        this.setMoveAngle(directions[myDir].angle);
        this.setCurrentCycle(directions[myDir].dir);
    };
    
    tSpaceCrab.changeDirectionEvery2Seconds = function(){
        if(this.myTimer.getElapsedTime() > 2){
            this.changeDirection();
            this.myTimer.reset();
        }
    };
    
    tSpaceCrab.reset = function(){
        //set new random position
        newX = Math.random() * this.cWidth;
        newY = Math.random() * this.cHeight;
        this.setPosition(newX, newY);
        this.changeDirection();
    }; // end reset

    tSpaceCrab.reset();

    return tSpaceCrab;
} // end tSpaceCrab

function Life_250(){
    tLife_250 = new Sprite(scene, "img/lander/life_250.png", 40, 30);
    tLife_250.setSpeed(3);
    newDir = (Math.random() * 90) - 45;
    tLife_250.setAngle(newDir);
            
    tLife_250.reset = function(){
        //set new random position
        newX = Math.random() * this.cWidth;
        newY = Math.random() * this.cHeight;
        this.setPosition(newX, newY);
        this.hide();
    }; // end reset
    
    tLife_250.showStats = function(){
        //displays stats
        output = "DX: " + Math.round(this.dx * 10) + "<br />";
        output += "DY: " + Math.round(this.dy * 10) + "<br />";
        output += "ALT: " + Math.round(525 - this.y) + "<br />";
        output += "MSG: " + message + "<br />";
        output += "FUEL: " + fuel;
        
        stats.innerHTML = output;
    }; // end showStats
    tLife_250.reset();
    
    return tLife_250;
} // end Life_250

var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout (timers[uniqueId]);
        }
    timers[uniqueId] = setTimeout(callback, ms);
    };
})();

$(window).resize(function() {
    var beforeResizeWidth = scene.width;
    var beforeResizeHeight = scene.height;
    waitForFinalEvent(function(){
        scene.setSize(window.innerWidth, window.innerHeight);
        var myResizeDivider = beforeResizeWidth/scene.width;
        platform.setX(platform.x/myResizeDivider);
        platform.setY(platform.y/myResizeDivider);

        for (i = 0; i < spacecrabs.length; i++){
            spacecrabs[i].setX(spacecrabs[i].x/myResizeDivider);
            spacecrabs[i].setY(spacecrabs[i].y/myResizeDivider);
        }
        for (i = 0; i < NUMSPACEMOTHS; i++){
            spacemoths[i].setX(spacemoths[i].x/myResizeDivider);
            spacemoths[i].setY(spacemoths[i].y/myResizeDivider);
        } // end for loop
    }, 500, "some unique string");
});