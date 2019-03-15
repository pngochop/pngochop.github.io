function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (theY,tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }
    this.startY = theY; // change all animation position // when action
    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet, 
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * 1, //scaleBy
                  this.frameHeight * 1);//scaleBy
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    Entity.prototype.draw.call(this);
}

function BlockThingy(game) {
    Entity.call(this, game, 400, 0);
    this.radius = 200;
}

BlockThingy.prototype = new Entity();
BlockThingy.prototype.constructor = Background;

BlockThingy.prototype.update = function () { }

BlockThingy.prototype.draw = function (ctx) {
    
}

//    console.log(Heroes.Abaddon.primaryAttribute);
//console.log(Heroes.Alchemist.attributeGains.agility);
//x, y for direction.. or change by enum
function Swordsman(game) {//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/swordman.png"), 0, 325, 53.2, 95, 0.05, 1, true, true);   
    this.walkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/swordman.png"), 53.2, 325, 53.2, 95, 0.05, 5, false, true);
    this.attackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/swordman.png"), 0, 405, 53, 55, 0.12, 10, false, true);
    this.jumping = false;
    this.walking = false;
    this.attacking = false;
    this.directionX = 1;
    this.directionY = 1;
    this.direction = 'E';
    this.radius = 100;
    this.ground = 400;
    this.travelSpeed = 8; 
    Entity.call(this, game, 200, 400);
}

Swordsman.prototype = new Entity();
Swordsman.prototype.constructor = Swordsman;
const getDirectionXY = (direction) => {
    //North direction
    if (direction == 1) return [0, -4];
    //South direction
    if (direction == 2) return [0, 4];
    //East direction
    if (direction == 3) return [4, 0];
    //West direction
    if (direction == 4) return [-4, 0];
}

const getDirection = (direction) => {
    //North direction
    if (direction == 1) return 'N';
    //South direction
    if (direction == 2) return 'S';
    //East direction
    if (direction == 3) return 'E';
    //West direction
    if (direction == 4) return 'W';
}
const getTravelSpeed = (direction) => {
    //North direction
    if (direction == 1) return [-8, 0];
    //South direction
    if (direction == 2) return [8, 0];
    //East direction
    if (direction == 3) return [0, 8];
    //West direction
    if (direction == 4) return [0, -8];
}
Swordsman.prototype.update = function () {
    if (this.game.Walk) {
        this.walking = true;
        this.directionX = getDirectionXY(this.game.Direction)[0];
        this.directionY = getDirectionXY(this.game.Direction)[1];
        this.direction = getDirection(this.game.Direction);
        this.travelSpeed = getTravelSpeed(this.game.Direction)[0];
        //left move
        this.game.origin.x += getTravelSpeed(this.game.Direction)[1]; //-8
        this.game.origin.y += getTravelSpeed(this.game.Direction)[0];
        this.game.ctx.translate(-getTravelSpeed(this.game.Direction)[1], -getTravelSpeed(this.game.Direction)[0]);  // Screen-in-world movement. +8
        this.game.ctx.save();
        //up
        //this.game.origin.y -= this.travelSpeed;
        //this.game.ctx.translate(0, this.travelSpeed);  // Screen-in-world movement.
    }
    if (this.walking) {
        if (this.walkAnimation.isDone()) {
            this.walkAnimation.elapsedTime = 0;
            this.walking = false;
        }
 
        this.x += this.directionX;
        this.y += this.directionY;
    }
    if (this.game.A) this.attacking = true;
    if (this.attacking) {
        if (this.attackAnimation.isDone()) {
            this.attackAnimation.elapsedTime = 0;
            this.attacking = false;
        }        
    }
    Entity.prototype.update.call(this);
    
}
var characterDirection = 325;

Swordsman.prototype.draw = function (ctx) {
    var changedX = 1;
    var changedY = 1;
    if (this.walking) {
        switch (this.direction) {
            case 'E': //direction
                changedX = 11;
                changedY = 0;
                characterDirection = 325;
                break;
            case 'W':
                changedX = -11;
                changedY = 0;
                characterDirection = 220;
                break;
            case 'S':
                changedX = 0;
                changedY = 11;
                characterDirection = 0;
                break;
            default:
                changedX = 0;
                changedY = -1;
                characterDirection = 110;
                break;
        }

        this.walkAnimation.drawFrame(characterDirection, this.game.clockTick, ctx, this.x + changedX, this.y + changedY);
        
    } else if (this.attacking) {
        this.attackAnimation.drawFrame(435,this.game.clockTick, ctx, this.x, this.y);
    }
    else {        
        this.animation.drawFrame(characterDirection,this.game.clockTick, ctx, this.x, this.y); // x, y position
    }

    Entity.prototype.draw.call(this);
}

function Flame(game) {//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/fire4_64_0.png"), 0, 325, 64, 64, 0.5, 10, true, true);
    this.jumping = false;
    this.walking = false;
    this.attacking = false;
    this.directionX = 1;
    this.directionY = 1;
    this.direction = 'E';
    this.radius = 100;
    this.ground = 400;
    this.travelSpeed = 8; 
	this.life = 1;
    Entity.call(this, game, 200, 400);
}

Flame.prototype = new Entity();
Flame.prototype.constructor = Flame;
Flame.prototype.update = function () {
	
	A=A+.05 // Increase angle adding .1 each time. Change direction by subtracting.
	c=Math.cos(A)
	s=Math.sin(A)
	this.x=(R0*c)+Character.x; // new x coordinates
	this.y=(R0*s)+Character.y + 15; // new y coordinates
	
    Entity.prototype.update.call(this);
    
}
var R0=90 // Radius
var A=0 // Rads. 1 degree = 3.14150/180 radians
Flame.prototype.draw = function (ctx) {
	 

    this.animation.drawFrame(characterDirection,this.game.clockTick, ctx, this.x, this.y); // x, y position

    Entity.prototype.draw.call(this);
	
	lightTimeCurrent++;
  if (lightTimeCurrent >= lightTimeTotal) {
    createLightning();
    lightTimeCurrent = 0;
    lightTimeTotal = 200;  //rand(100, 200)
  }
  drawLightning();
	
}
function random(min, max) {
  return Math.random() * (max - min + 1) + min;
}
function createLightning() {
  var x = random(100, 800 - 100) + Character.x - 200;
  var y = random(0, 800 / 4) + Character.y - 400;

  var createCount = random(1, 3);
  for (var i = 0; i < createCount; i++) {
    single = {
      x: x,
      y: y,
      xRange: random(5, 30),
      yRange: random(10, 25),
      path: [{
        x: x,
        y: y
      }],
      pathLimit: random(40, 55)
    };
    lightning.push(single);
  }
};
function drawLightning() {
  for (var i = 0; i < lightning.length; i++) {
    var light = lightning[i];

    light.path.push({
      x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
      y: light.path[light.path.length - 1].y + (random(0, light.yRange))
    });

    if (light.path.length > light.pathLimit) {
      lightning.splice(i, 1);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, .1)';
    ctx.lineWidth = 3;
    if (random(0, 15) === 0) {
      ctx.lineWidth = 6;
    }
    if (random(0, 30) === 0) {
      ctx.lineWidth = 8;
    }

    ctx.beginPath();
    ctx.moveTo(light.x, light.y);
    for (var pc = 0; pc < light.path.length; pc++) {
      ctx.lineTo(light.path[pc].x, light.path[pc].y);
    }
    if (Math.floor(random(0, 30)) === 1) { //to fos apo piso
      ctx.fillStyle = 'rgba(255, 255, 255, ' + random(1, 3) / 100 + ')';
      ctx.fillRect(0, 0, 800, 800);
    }
    ctx.lineJoin = 'miter';
    ctx.stroke();
  }
};
// the "main" code begins here
var Character;
var ctx;
var lightning = [];
var lightTimeCurrent = 0;
var lightTimeTotal = 0;
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/swordman.png");
ASSET_MANAGER.queueDownload("./img/fire4_64_0.png");
ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctxx = canvas.getContext('2d');
	ctx = ctxx;
    var gameEngine = new GameEngine();
    var blockthingy = new BlockThingy(gameEngine); // Testing.
    var bg = new Background(gameEngine);
    var swordsman = new Swordsman(gameEngine);
	var flame = new Flame(gameEngine);
	
	Character = swordsman;
    gameEngine.addEntity(bg);
    gameEngine.addEntity(swordsman);
    	
    gameEngine.addEntity(blockthingy);
gameEngine.addEntity(flame);	
    gameEngine.init(ctxx);
    gameEngine.start();
});
