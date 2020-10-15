var bikeManImg, parkImg, trashcanImg, fireHydrantImg, benchImg, lightningBoltImg;
var bikeMan, trashcan, fireHydrant, bench, lightningBolt, ground, groundIMG;
var obstaclesGroup;
var invisGround;
var score = 0;
var PLAY = 1, END = 0, gameState = PLAY;
var collidedBiker;
var gameOver, restart;
var gameOverImg, restartImg;
var thrusters, thrustersImg;
var bikeThrusters, bikeFlash;
var powerState = "noPower";
var boltGroup, rocketGroup;
var gameTitle, gameTitleImg;

function preload()
{
  bikeManImg = loadAnimation("images/Bike1.png", "images/Bike2.png", "images/Bike3.png");
  groundIMG = loadImage("images/ground.png");
  parkImg = loadImage("images/Park.png");
  trashcanImg = loadImage("images/trashcan.png");
  lightningBoltImg = loadImage("images/lightningBolt.png");
  benchImg = loadImage("images/Bench.png");
  fireHydrantImg = loadImage("images/fireHydrant.png");
  collidedBiker = loadImage("images/collidedBiker.png");
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  thrustersImg = loadImage("images/thrusters.png");
  bikeThrusters = loadImage("images/Bike1Thruster.png");
  bikeFlash = loadImage("images/bike1Flash.png");
  gameTitleImg = loadImage("images/gameTitle.png");
}

function setup() 
{
  createCanvas(windowWidth, windowHeight - 20);

  bikeMan = createSprite(50, height - 300, 50, 50);
  bikeMan.addAnimation("bikeMan", bikeManImg);
  bikeMan.addAnimation("collidedBiker", collidedBiker);
  bikeMan.addAnimation("bikeFlash", bikeFlash);
  bikeMan.addAnimation("bikeThrusters", bikeThrusters);
  bikeMan.scale = 1.25;

  ground = createSprite(100, height - 260, width*2, 10);
  ground.x = ground.width/4;

  invisGround = createSprite(40, height - 250, width*2, 10);
  invisGround.visible = false;

  gameOver = createSprite(width/2,height/3 - 80);
  restart = createSprite(width/2,height/3 + 130);
  gameTitle = createSprite(width/2, height/4)
  
  gameOver.addImage("gameOver", gameOverImg);

  restart.addImage("restart", restartImg);
  restart.scale = 0.5;

  gameTitle.addImage("gameTitle", gameTitleImg);

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup = new Group();
  boltGroup = new Group();
  rocketGroup = new Group();
}

function draw() 
{
  background(parkImg);  

  fill("black");
  textSize(36);
  text ("Distance Travelled:" + Math.round(score), width - 380, height/3 - 100);
  
  if(gameState === PLAY)
  {

    score = score + 0.1

    bikeMan.collide(invisGround);

  if(keyDown("space") && bikeMan.y > 392)
  {
    bikeMan.velocityY = -21;
  }

  bikeMan.velocityY = bikeMan.velocityY + 1;

  ground.velocityX = -10;

  if(ground.x < 0)
  {
    ground.x = ground.width/4;
  }

  spawnObstacles();

  if(obstaclesGroup.isTouching(bikeMan))
  {
    gameState = END;
  }

  spawnPower();

  if(boltGroup.isTouching(bikeMan))
  {
    bikeMan.changeAnimation("bikeFlash", bikeFlash);
    lightningBolt.destroy();
    powerState = "flash";
  }

  if(powerState === "flash")
  {
    score = score + 1;
    if(obstaclesGroup.isTouching(bikeMan))
    {
      noPower();
    }
  }

  /*if(rocketGroup.isTouching(bikeMan))
  {
    //console.log("itworks");
    bikeMan.changeAnimation("bikeThrusters", bikeThrusters);
    thrusters.destroy();
    powerState = "thrusters";
    bikeMan.velocityY = bikeMan.velocityY + 2;
  }

  if(powerState === "thrusters")
  {
    bikeMan.velocityY = -20.5;
  }*/

  }

  obstaclesGroup.collide(invisGround);

  if(gameState === END)
  {
    bikeMan.velocityY = 0;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);

    bikeMan.changeAnimation("collidedBiker", collidedBiker);

    obstaclesGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;
    gameTitle.visible = false;

    if(mousePressedOver(restart) || touches.length > 0) 
    {
     reset();
    }
  }

  drawSprites();
}

function spawnObstacles() 
{
  if(frameCount % 100 === 0) 
  {
    var obstacle = createSprite(1200,height/2 + 60,10,40);
    obstacle.velocityX = -(6 + score/100*3);
    
    var rand = Math.round(random(1,3));

    obstacle.scale = 0.75;
              
    switch(rand)
    {
      case 1: obstacle.addImage("obstacle1", benchImg);
      //obstacle.setCollider("rectangle", 0, 0, 140, 60);
      obstacle.scale = 0.337;
      obstacle.y = height/2 + 75;
      //obstacle.debug = true;
      obstacle.setCollider("rectangle", 0, 0, 315, 165);
      break;
        
      case 2: obstacle.addImage("obstacle2", fireHydrantImg); 
      obstacle.scale = 0.15;
      obstacle.y = height/2 + 70;
      break;
      
      case 3: obstacle.addImage("obstacle3", trashcanImg);
      obstacle.y = height/2 + 70;
      obstacle.scale = 0.85; 
      break;
      
      default: break;
    }
    
    obstacle.lifetime = 200;
    obstaclesGroup.add(obstacle);
  }
}

function spawnPower()
{
  if(frameCount % 725 === 0)
  {
    console.log("itprobablyworks?")
    var rand = Math.round(random(1,2));
    /*shield = createSprite(1220, height/2 + 75, 30, 56);
    shield.addImage("shield",shieldImg);
    shield.velocityX = -(6 + score/100*3);*/

    switch (rand) 
    {
      case 1 : lightningBolt = createSprite(1220, height/2 + 75, 30, 56);
      lightningBolt.addImage("lightningBolt",lightningBoltImg);
      lightningBolt.velocityX = -(6 + score/100*3);
      lightningBolt.scale = 0.389;
      lightningBolt.lifetime = 200;
      boltGroup.add(lightningBolt);
      break;

      case 2 : lightningBolt = createSprite(1220, height/2 + 75, 30, 56);
      lightningBolt.addImage("lightningBolt",lightningBoltImg);
      lightningBolt.velocityX = -(6 + score/100*3);
      lightningBolt.scale = 0.389;
      lightningBolt.lifetime = 200;
      boltGroup.add(lightningBolt);
      break;

      default : break;
    }
  }
}

function reset()
{
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  gameTitle.visible = true;

  obstaclesGroup.destroyEach();
  
  bikeMan.changeAnimation("bikeMan",bikeManImg);
  
  score = 0;

  powerState = "noPower";
}

function noPower()
{
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  bikeMan.changeAnimation("bikeMan",bikeManImg);

  powerState = "noPower";
}