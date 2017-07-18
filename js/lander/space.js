var scene, transparentBackground, spaceImages = ["img/lander/background/Background-2.jpg", "img/lander/background/Background-3.jpg", "img/lander/background/Background-4.jpg", "img/lander/background/Background-5.jpg", "img/lander/background/Background-6.jpg", "img/lander/background/Background-7.jpg", "img/lander/background/Background-8.jpg", "img/lander/background/Background-9.jpg", "img/lander/background/Background-10.jpg", "img/lander/background/Background-11.jpg", "img/lander/background/Background-12.jpg", "img/lander/background/Background-13.jpg", "img/lander/background/Background-14.jpg"],
    lander, platform, spacemoths, spacecrabs = [], plants = [], life_250, message = "", spaceMP3, spaceOGG, moth_crashMP3, moth_crashOGG, life_250MP3, life_250OGG, NUMSPACEMOTHS = 3, fuel = 12000, level = 1,
    dirs = [["left",    270],
            ["right",   90 ],
            ["up",      0  ],
            ["down",    180]];
var NUMOFSPACECRABS = 250; var dead = 0; var NUM_OF_PLANTS = 500;
function populateRandomCrab() {
    Math.random().toString(2)[7] == 0 ? spacecrabs.push(new Crabella()) : spacecrabs.push(new Crabber()); //toString(2) returns binary rep - check last binary if it 0 or 1
}

var VISIBLE_CRABS_AT_THE_BEGINNING = 30;               
function init() {
    scene = new Scene();
    scene.setSize(window.innerWidth, window.innerHeight);
    scene.setBG("transparent");
    for (var i = 0; i < NUMOFSPACECRABS; i++) {populateRandomCrab();}
    for (var i = 0; i < VISIBLE_CRABS_AT_THE_BEGINNING; i++) {
        spacecrabs[i].show(); spacecrabs[i].playAnimation(); spacecrabs[i].healthBar.show(); spacecrabs[i].healthBarFollow();
        spacecrabs[i].setPosition(Math.random() * spacecrabs[i].cWidth, Math.random() * spacecrabs[i].cHeight);
        }
    for (var i = 0; i < NUM_OF_PLANTS; i++) {plants.push(new Plant());}
    
    stats = document.getElementById("game_stats");
    
    moth_crashMP3 = new Sound("sounds/moth_crash.mp3");
    moth_crashOGG = new Sound("sounds/moth_crash.ogg");
    life_250MP3 = new Sound("sounds/life_250.mp3");
    life_250OGG = new Sound("sounds/life_250.ogg");
    scene.start();
} // end ini

var index = 0;
var crab;
var plant;
var visiblePlants = 0;
var visibleCrabs = 0;
function update() {
    scene.clear();
    
    var crabsCount = 0;
    crab = NUMOFSPACECRABS;
    while(crab--) {
        var currentCrab = spacecrabs[crab];
        if (currentCrab.visible) {
            crabsCount++;
            if (currentCrab.countToChageDirection-- < 0) {
                currentCrab.changeDirection();
                currentCrab.countToChageDirection = 40;
            }
            currentCrab.healthBarFollow();
            checkCrabCollisions(crab);
            checkCrabPlantCollisions(crab);
            
            currentCrab.getOlder();
            if(currentCrab.pregnant){
                currentCrab.getBirth();
            }
            currentCrab.update();
            currentCrab.healthBar.update();
        };
    };
    visibleCrabs = crabsCount;
    
    plant = NUM_OF_PLANTS;
    var newborn = false; // only 1 in iterration
    var plantsCount = 0;
    while(plant--) {
        var currentPlant = plants[plant];
        if (currentPlant.visible) {
            plantsCount++;
            if (currentPlant.nutrition >= 100) {
                currentPlant.reset();
            }
        currentPlant.nutrition++;
        currentPlant.update();
        }else{
            if ((visiblePlants < NUM_OF_PLANTS) &&  (!newborn)) {
                currentPlant.show();
                currentPlant.playAnimation();
                newborn = true;
            }
        }
    }
    visiblePlants = plantsCount;
    showStats();
} // end update

function BaseCrab(image){
    var tBaseCrab = new Sprite(scene, image, 132, 128);
    tBaseCrab.getOlder = function(){
        this.healthBar.setCurrentCycle(parseInt(Math.floor(this.health)/10));// reduce health and adjust sprite image to correct cycle if necessary
        if ((this.health -= 0.05) < 1){
            this.reset();
            dead++;
        }
    };
    tBaseCrab.changeDirection = function(){
        var direction = dirs[Math.floor(Math.random()*dirs.length)];
        this.setMoveAngle(direction[1]);
        this.setCurrentCycle(direction[0]);
    };
    
    tBaseCrab.healthBarFollow = function(){
        this.healthBar.setRandomPosition(this.x, this.y);
    };
    
    tBaseCrab.reset = function(){
        this.healthBar = new Bar(this.x, this.y);
        this.loadAnimation(132, 128, 33, 32);
        this.generateAnimationCycles();
        this.renameCycles(new Array("down", "up", "left", "right"));
        this.setAnimationSpeed(500);
        this.health = 100;
        this.countToChageDirection = Math.floor(Math.random()*40);
    
            //start paused
        this.setSpeed(1);
        //set new random position
        //newX = Math.random() * this.cWidth;
        //newY = Math.random() * this.cHeight;
        this.changeDirection();
        this.pauseAnimation();
        this.setPosition(-1000, -1000);
        this.hide();
        this.healthBar.hide();
    }; // end reset

    return tBaseCrab;
} // end tBaseCrab

function Crabella(){
    var tCrabella = new BaseCrab("img/lander/crabella.png");
    tCrabella.gender = "Crabella";
    tCrabella.pregnant = false;
    tCrabella.pregnancy = 100;
    tCrabella.impregnate = function(){
        this.pregnant = true;
    };  
    
    tCrabella.getBirth = function(){
        this.pregnancy--;
        if (this.pregnancy < 1){
            if (visibleCrabs < NUMOFSPACECRABS){
                var crab = NUMOFSPACECRABS;
                var newbornCrab = spacecrabs[--crab];
                while (newbornCrab.visible && --crab){
                    newbornCrab = spacecrabs[crab];
                }
                newbornCrab.show(); newbornCrab.playAnimation(); newbornCrab.healthBar.show(); newbornCrab.healthBarFollow();
                newbornCrab.setPosition(Math.random() * newbornCrab.cWidth, Math.random() * newbornCrab.cHeight);
                this.pregnancy = 100;
                this.pregnant = false;
            }
        }
    };

    tCrabella.reset();
    return tCrabella;
} // end tCrabella

function Crabber(){
    var tCrabber = new BaseCrab("img/lander/crabber.png");
    tCrabber.gender = "Crabber";

    tCrabber.reset();
    return tCrabber;
} // end tCrabber

function Plant(){
    var tPlant = new Sprite(scene, "img/lander/plant.png", (window.innerWidth+window.innerHeight)/25, (window.innerWidth+window.innerHeight)/25);
    
    tPlant.reset = function(){
        this.setSpeed(0);
        this.nutrition = 0; // dies when 100
        this.loadAnimation(468, 468, 26, 26);
        this.generateAnimationCycles();
        this.renameCycles(new Array("grow", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r"));
        this.setAnimationSpeed(5000);
        this.setCurrentCycle("grow");
        //set new random position
        var newX = Math.random() * this.cWidth;
        var newY = Math.random() * this.cHeight;
        this.pauseAnimation();
        this.setPosition(newX, newY);
        this.hide();
    }; // end reset
    
    tPlant.reset();
    
    return tPlant;
} // end Plant

function checkCrabPlantCollisions(spaceCrabNum) {// check crabs against each other
    var plant = NUM_OF_PLANTS;
    while(plant--) {
        var currentPlant = plants[plant], currentCrab = spacecrabs[spaceCrabNum];
        if (currentPlant.distanceTo(currentCrab) < 25) {
            currentCrab.health = Math.min(currentCrab.health + currentPlant.nutrition, 100);
            currentPlant.reset();
        } // end if
    }
} // end checkCollisions

function checkCrabCollisions(spaceCrabNum) {// check crabs against each other
    var crab = NUMOFSPACECRABS;
    while(crab--) {
        var currentCrab = spacecrabs[spaceCrabNum], iterratedCrab = spacecrabs[crab];
        if (crab == spaceCrabNum) continue; // dont collide with itself
        if (iterratedCrab.distanceTo(currentCrab) < 25) {
            if(iterratedCrab.gender == "Crabber" && currentCrab.gender == "Crabber"){    
                moth_crashMP3.play();moth_crashOGG.play();
                iterratedCrab.health--;
                currentCrab.health--;
            } else if (iterratedCrab.gender == "Crabella" && currentCrab.gender == "Crabber") {
                life_250MP3.play();life_250OGG.play();
                if((!iterratedCrab.pregnant) && (visibleCrabs < NUMOFSPACECRABS)){
                    iterratedCrab.impregnate();
                }
            } else if (currentCrab.gender == "Crabella" && iterratedCrab.gender == "Crabber") {
                life_250MP3.play();life_250OGG.play();
                if((!currentCrab.pregnant) && (visibleCrabs < NUMOFSPACECRABS)){
                    currentCrab.impregnate();
                }
            }else{
            }
        } // end if
    }
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

var showStats = function(){
    //displays stats
    output = "DX: " + Math.round(this.dx * 10) + "<br />";
    output += "Crabs visible: " + visibleCrabs + "<br />";
    output += "Plants visible: " + visiblePlants + "<br />";
    output += "Dead: " + dead + "<br />";
    output += "Creatues: " + NUMOFSPACECRABS + " and " + spacecrabs.length;
    
    stats.innerHTML = output;
};

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