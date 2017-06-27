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
    lander = new Lander();
    platform = new Platform();
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
    platform.update();
    lander.checkGravity();
    lander.checkKeys();
    lander.showStats();
    lander.checkLanding();
    lander.checkLife();

    checkLifeCollisions();
    
    for (i = 0; i < NUMSPACEMOTHS; i++) {
        spacemoths[i].wriggle();
        checkMothCollisions(i);
        spacemoths[i].update();
    } // end for loop
    
    if (spacecrabs.length < 3) {
        spacecrabs.push(new SpaceCrab());
    }
    for (i = 0; i < spacecrabs.length; i++) {
        spacecrabs[i].changeDirectionEvery2Seconds();
        checkCrabCollisions(i);
        spacecrabs[i].update();
    }
    
    lander.update();
    life_250.update();
} // end update

function setupSpaceMoths() {
    spacemoths = new Array(NUMSPACEMOTHS);
    for (i = 0; i < NUMSPACEMOTHS; i++) {
        spacemoths[i] = new SpaceMoth();
    } // end for
} // end setupSpaceMoths

function checkMothCollisions(spaceMothNum) {
    if (!lander.immortable && lander.collidesWith(spacemoths[spaceMothNum])) {
        spacemoths[spaceMothNum].reset();
        lander.life -= 250;
        moth_crashMP3.play();
        moth_crashOGG.play();
    } // end if
} // end checkCollisions

function checkCrabCollisions(spaceCrabNum) {
    if (!lander.immortable && lander.collidesWith(spacecrabs[spaceCrabNum])) {
        spacecrabs[spaceCrabNum].reset();
        lander.life -= 250;
        moth_crashMP3.play();
        moth_crashOGG.play();
    } // end if
} // end checkCollisions

function checkLifeCollisions() {
    if (lander.collidesWith(life_250)) {
        lander.life += 250;
        life_250MP3.play();
        life_250OGG.play();
        life_250.reset();
    } // end if
} // end checkCollisions

function restart() {
    document.location.href = "";
} // end restart

function Lander() {
    tLander = new Sprite(scene, "img/lander/lander.png", (window.innerWidth + window.innerHeight) / 25, (window.innerWidth + window.innerHeight) / 25);
    tLander.setSpeed(0);
    tLander.falling = true;
    tLander.life = 1000;
    tLander.immortable = true;
    tLander.imgDefault = "img/lander/lander.png";
    tLander.imgUp = "img/lander/landerUp.png";
    tLander.imgLeft = "img/lander/landerLeft.png";
    tLander.imgRight = "img/lander/landerRight.png";
    tLander.imgTransparent = "img/lander/landerTransparent.png";
    tLander.setRandomPosition = function () {
        x = Math.random() * scene.width;
        y = Math.random() * scene.height;
        this.setPosition(x, y);
    };
    tLander.myTimer = new Timer();
    tLander.blink = function (direction) {
        this.image.src.substring(this.image.src.lastIndexOf('/img/lander') + 1) !== this.imgTransparent ?
        this.setImage(this.imgTransparent) :
        this.setImage(direction);
    }; // end blink    
    tLander.blinkOrNot = function (direction) {
        if (this.myTimer.getElapsedTime() < 5) {
            this.blink(direction);
        } else {
            this.setImage(direction);
            this.immortable = false;
        }
    }; // end blinkOrNot    
    tLander.checkGravity = function () {
        if (this.falling) {
          this.addVector(180, 0.1);
        } // end if
    }; // end checkGravity
    tLander.checkLife = function () {
    if (this.life <= 0) {
        scene.stop();
        } //end if statement
    if (this.life <= 500) {
        life_250.show();
        }// end if
    }; // end checkGravity
    
    tLander.checkKeys = function(){

        if (keysDown[K_UP]){
            fuel -= 5;
                this.addVector(0, 0.3);
                this.blinkOrNot(this.imgUp);
                this.falling = true;
        }
        
        else if (keysDown[K_LEFT]){
            fuel -= 1;
                this.addVector(90, 0.1);
                this.blinkOrNot(this.imgLeft);

        } // end if
        
        else if (keysDown[K_RIGHT]){
            fuel -= 1;
                this.addVector(270, 0.1);
                this.blinkOrNot(this.imgRight);

        }  else {
                this.blinkOrNot(this.imgDefault);

        }// end if
        
    }; // end checkKeys
    
    
    tLander.showStats = function(){
        //displays stats
        output = "DX: " + Math.round(this.dx * 10) + "<br />";
        output += "DY: " + Math.round(this.dy * 10) + "<br />";
        output += "ALT: " + Math.round(525 - this.y) + "<br />";
        output += "MSG: " + message + "<br />";
        output += "LIFE: " + lander.life + "<br />";
        output += "FUEL: " + fuel;
        
        stats.innerHTML = output;
    }; // end showStats
    
    tLander.checkLanding = function(){
      if (this.falling){
        if (this.y +(this.height/2)> platform.y+(platform.height/2) && this.y +(this.height/2)< platform.y+(platform.height/2)+(platform.height/2)){
          if (this.x < platform.x + 10){
            if (this.x > platform.x - 10){
              if (this.dx < 0.2){
                if (this.dx > -0.2){
                  if (this.dy < 2){
                    message = "Nice Landing!";
                    this.setSpeed(0);
                    this.falling = false;
                    scene.stop();                        
                    if (spaceImages.length) {
                        $('nav').show();
                        $('html').css('background-image', 'url(' + spaceImages.shift() + ')');
                        this.setRandomPosition();
                        platform.setRandomPosition();
                        this.immortable = true;
                        this.falling = true; 
                    } else {
                        alert("Congratulations!");
                    }
                  } else {
                    message = "too much vertical speed";
                  } // end if
                } else {
                    message = "too fast to left";
                } // end if
              } else {
                message = "too fast to right";
              } // end if                    
            } // end 'x too big' if
          } // end 'x too small' if
        } // end 'y not big enough' if
      } // end 'are we falling?' if
    }; // end checkLanding
            
    tLander.setRandomPosition();
    return tLander;
} // end Lander constructor

function Platform(){
    tPlatform = new Sprite(scene, "img/lander/r-typesheet28.gif", (window.innerWidth+window.innerHeight)/25, (window.innerWidth+window.innerHeight)/125);
    tPlatform.setSpeed(0);
    tPlatform.setRandomPosition = function(){
        x = Math.random() * scene.width;
    this.setPosition(x,scene.height*0.9);
    };
    tPlatform.setRandomPosition();
    return tPlatform;
} // end platform constructor

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
        lander.setX(lander.x/myResizeDivider);
        lander.setY(lander.y/myResizeDivider);

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