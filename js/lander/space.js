var scene, transparentBackground, spaceImages = ["img/lander/background/Background-2.jpg", "img/lander/background/Background-3.jpg", "img/lander/background/Background-4.jpg", "img/lander/background/Background-5.jpg", "img/lander/background/Background-6.jpg", "img/lander/background/Background-7.jpg", "img/lander/background/Background-8.jpg", "img/lander/background/Background-9.jpg", "img/lander/background/Background-10.jpg", "img/lander/background/Background-11.jpg", "img/lander/background/Background-12.jpg", "img/lander/background/Background-13.jpg", "img/lander/background/Background-14.jpg"],
    lander, platform, spacemoths, spacecrabs = [], platforms = [], life_250, message = "", spaceMP3, spaceOGG, moth_crashMP3, moth_crashOGG, life_250MP3, life_250OGG, NUMSPACEMOTHS = 3, fuel = 12000, level = 1,
    dirs = [["left",    270],
            ["right",   90 ],
            ["up",      0  ],
            ["down",    180]];
            var NUMOFSPACECRABS = 50; var dead = 0;
function populateRandomCrab() {
    Math.random().toString(2)[7] == 0 ? spacecrabs.push(new Crabella()) : spacecrabs.push(new Crabber()); //toString(2) returns binary rep - check last binary if it 0 or 1
}
                
function init() {
    scene = new Scene();
    scene.setSize(window.innerWidth, window.innerHeight);
    scene.setBG("transparent");
    for (var i = 0; i < NUMOFSPACECRABS; i++) {populateRandomCrab();}
    
    stats = document.getElementById("game_stats");
    
    
    moth_crashMP3 = new Sound("sounds/moth_crash.mp3");
    moth_crashOGG = new Sound("sounds/moth_crash.ogg");
    life_250MP3 = new Sound("sounds/life_250.mp3");
    life_250OGG = new Sound("sounds/life_250.ogg");
    scene.start();
} // end ini
var index = 0;
var k = NUMOFSPACECRABS;
function update() {
    scene.clear();
    spacecrabs[index++].changeDirection();// update one at a time
    for(var i = 0; i < spacecrabs.length; i++)
    {
        spacecrabs[i].healthBarFollow();
    }
        
    if (index >= NUMOFSPACECRABS)
    {
        index = 0; // reset
    }
    while(k--) {
        checkCrabCollisions(k);
        if(spacecrabs[k].pregnant){
            spacecrabs[k].getBirth();
        }
        spacecrabs[k].update();
        spacecrabs[k].healthBar.update();
    }
    k = NUMOFSPACECRABS;
    showStats();
} // end update
var showStats = function(){
    //displays stats
    output = "DX: " + Math.round(this.dx * 10) + "<br />";
    output += "DY: " + Math.round(this.dy * 10) + "<br />";
    output += "ALT: " + Math.round(525 - this.y) + "<br />";
    output += "Dead: " + dead + "<br />";
    output += "Creatues: " + NUMOFSPACECRABS + " and " + spacecrabs.length;
    
    stats.innerHTML = output;
};


function checkCrabCollisions(spaceCrabNum) {// check crabs against each other
    var crab = NUMOFSPACECRABS;
    while(crab--)
    {
        if (crab == spaceCrabNum) continue; // dont collide with itself
        if (spacecrabs[crab].distanceTo(spacecrabs[spaceCrabNum]) < 25) {
            if(spacecrabs[crab].gender == "Crabber" && spacecrabs[spaceCrabNum].gender == "Crabber")
            {    
                moth_crashMP3.play();
                moth_crashOGG.play();
                if (spacecrabs[crab].health < 1){
                    NUMOFSPACECRABS--;
                    spacecrabs.splice(crab,1);
                    dead++;
                }else if (spacecrabs[spaceCrabNum].health < 1){
                    NUMOFSPACECRABS--;
                    spacecrabs.splice(spaceCrabNum,1);
                    dead++;
                }else{
                    spacecrabs[crab].healthBar.setCurrentCycle(parseInt(Math.floor(spacecrabs[crab].health--)/10));// reduce health and adjust sprite image to correct cycle if necessary
                    spacecrabs[spaceCrabNum].healthBar.setCurrentCycle(parseInt(Math.floor(spacecrabs[spaceCrabNum].health--)/10));
                }
            }
            else if (spacecrabs[crab].gender == "Crabella" && spacecrabs[spaceCrabNum].gender == "Crabber")
            {
                life_250MP3.play();
                life_250OGG.play();
                if (spacecrabs[crab].gender == "Crabella"){
                    if(!spacecrabs[crab].pregnant){
                        spacecrabs[crab].impregnate();
                    }
                }
                else{
                    if(!spacecrabs[spaceCrabNum].pregnant){
                        spacecrabs[spaceCrabNum].impregnate();
                    }
                }
            }
            else
            {
            }
        } // end if
    }
    crab = NUMOFSPACECRABS;
} // end checkCollisions

function Bar(x, y){
    tBar = new Sprite(scene, "img/lander/Energy.png", (window.innerWidth+window.innerHeight)/25, (window.innerWidth+window.innerHeight)/125);
    tBar.loadAnimation(30, 30, 30, 3);
    tBar.generateAnimationCycles();
    tBar.renameCycles(new Array("10", "9", "8", "7", "6", "5", "4", "3", "2", "1"));
    tBar.pauseAnimation();
    tBar.setCurrentCycle("10");
    tBar.setRandomPosition = function(x, y){
    this.setPosition(x - 10, y - 20);
    };
    return tBar;
} // end bar constructor

function restart() {
    document.location.href = "";
} // end restart

function Crabella(){
    tSpaceCrab = new Sprite(scene, "img/lander/crabella.png", 132, 128);
    tSpaceCrab.healthBar = new Bar(this.x, this.y);
    tSpaceCrab.loadAnimation(132, 128, 33, 32);
    tSpaceCrab.generateAnimationCycles();
    tSpaceCrab.renameCycles(new Array("down", "up", "left", "right"));
    tSpaceCrab.setAnimationSpeed(500);
    tSpaceCrab.myTimer = new Timer();
    tSpaceCrab.gender = "Crabella";
    tSpaceCrab.health = 100;
    tSpaceCrab.pregnant = false;
    tSpaceCrab.pregnancy = undefined;

        //start paused
    tSpaceCrab.setSpeed(1);
    tSpaceCrab.changeDirection = function(){
        var direction = dirs[Math.floor(Math.random()*dirs.length)];
        this.setMoveAngle(direction[1]);
        this.setCurrentCycle(direction[0]);
            this.myTimer.reset();
    };
    tSpaceCrab.impregnate = function(){
        this.pregnant = true;
        this.pregnancy = new Timer();
    };  
    
    tSpaceCrab.getBirth = function(){
        if (this.pregnancy.getElapsedTime() > 5){
            this.pregnancy = undefined;
            NUMOFSPACECRABS++;
            populateRandomCrab();
            this.pregnant = false;
        }
    }
    
    tSpaceCrab.healthBarFollow = function(){
        this.healthBar.setRandomPosition(this.x, this.y)
    };
    
    tSpaceCrab.reset = function(){
        //set new random position
        newX = Math.random() * this.cWidth;
        newY = Math.random() * this.cHeight;
        this.setPosition(newX, newY);
        this.changeDirection();
        this.healthBar.setRandomPosition(this.x, this.y)
    }; // end reset
    //alert(tSpaceCrab.x);

    tSpaceCrab.reset();

    return tSpaceCrab;
} // end tSpaceCrab

function Crabber(){
    tSpaceCrab = new Sprite(scene, "img/lander/crabber.png", 132, 128);
    tSpaceCrab.healthBar = new Bar(this.x, this.y);
    tSpaceCrab.loadAnimation(132, 128, 33, 32);
    tSpaceCrab.generateAnimationCycles();
    tSpaceCrab.renameCycles(new Array("down", "up", "left", "right"));
    tSpaceCrab.setAnimationSpeed(500);
    tSpaceCrab.myTimer = new Timer();
    tSpaceCrab.gender = "Crabber";
    tSpaceCrab.health = 100;

        //start paused
    tSpaceCrab.setSpeed(1);
    tSpaceCrab.changeDirection = function(){
        var direction = dirs[Math.floor(Math.random()*dirs.length)];
        this.setMoveAngle(direction[1]);
        this.setCurrentCycle(direction[0]);
            this.myTimer.reset();
    };
    
    tSpaceCrab.healthBarFollow = function(){
        this.healthBar.setRandomPosition(this.x, this.y)
    };
    
    tSpaceCrab.reset = function(){
        //set new random position
        newX = Math.random() * this.cWidth;
        newY = Math.random() * this.cHeight;
        this.setPosition(newX, newY);
        this.changeDirection();
        this.healthBar.setRandomPosition(this.x, this.y)
    }; // end reset
    //alert(tSpaceCrab.x);

    tSpaceCrab.reset();

    return tSpaceCrab;
} // end tSpaceCrab

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