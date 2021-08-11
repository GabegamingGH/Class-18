var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage
var obstacles
var obstacle1
var obstacle2
var obstacle3
var obstacle4
var obstacle5
var PLAY = 1
var END = 0
var gamestate = PLAY
var score = 0
var cloudGroup
var obstacleGroup
var restart, restart_image
var gameOver, gameOver_image
var highScore = 0
var checkpointSound
var dieSound
var jumpSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png")

  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")

  restart_image = loadImage("restart.png")
  gameOver_image = loadImage("gameOver.png")

  checkpointSound = loadSound("checkpoint.mp3")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
}

function setup() {

  createCanvas(windowWidth,windowHeight)
  
  //create a trex sprite
  trex = createSprite(50,height - 70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.debug = false
  trex.setCollider("circle",0,0,35)
  //create a ground sprite
  ground = createSprite(width/2,height - 10,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  restart = createSprite(width/2,height/2,50,50)
  gameOver = createSprite(width/2,height/2 + 30,50,25)
  restart.addImage(restart_image)
  gameOver.addImage(gameOver_image)
  ground.debug = false
  
  //creating invisible ground
  invisibleGround = createSprite(width/2,height - 10,width,5);
  invisibleGround.visible = false;
  invisibleGround.debug = false
  
  //generate random numbers
  var rand =  Math.round(random(1,100))
  console.log(rand)

  obstacleGroup = new Group()
  cloudGroup = new Group()
}

function draw() {{
  //set background color
  background(255);
  text(score,500,20)
  text("HI "+highScore,400,20)
  score = score+Math.round(frameCount/120)
  console.log(trex.y)
  }
  if(gamestate === PLAY){
    ground.velocityX = -4;
    
    if(score%500 === 0&&score>0){
       checkpointSound.play()
    }

    if(touches.length>0|| keyDown("space")&& trex.y >= height - 30) {
      trex.velocityY = -12;
      jumpSound.play()
      touches = []
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    spawnClouds()
  
    spawnObstacles()
    gameOver.visible = false
    restart.visible = false
    if(trex.isTouching(obstacleGroup)){
      gamestate = END
      dieSound.play()
    }
  }
  else if(gamestate === END){
    ground.velocityX = 0
    obstacleGroup.setVelocityXEach(0)
    cloudGroup.setVelocityXEach(0)
    obstacleGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)
    trex.changeAnimation("collided",trex_collided)
    trex.velocityY = 0
    restart.scale = 0.5
    if (score>highScore){
      highScore = score
    }
    score = 0
    gameOver.visible = true
    restart.visible = true
    if(keyDown("space")){
      gamestate = PLAY
      score = 0
      trex.changeAnimation("running",trex_running)
      obstacleGroup.destroyEach()
      cloudGroup.destroyEach()
      gameOver.visible = false
      restart.visible = false
    }
    
  }

  // jump when the space key is pressed

  

  

  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  //Spawn Clouds

  drawSprites();
}

//function to spawn the clouds
function spawnClouds(){
 // write your code here 
 if (frameCount%60===0){
 clouds = createSprite(550,Math.round(random(0,height - 10)),60,50)
 clouds.velocityX = -5
 clouds.addImage(cloudImage)
 clouds.depth = trex.depth
 trex.depth = trex.depth+1
 clouds.lifetime=120
 cloudGroup.add(clouds)
 }
}

function spawnObstacles(){
  if (frameCount%60===0){
 obstacles = createSprite(width + 30,height - 25,20,50)
 obstacles.velocityX = -4
 obstacles.lifetime=380
 obstacles.scale = 0.55
 var rand = Math.round(random(1,5))
 switch(rand){
   case 1:obstacles.addImage(obstacle1)
   break;
   case 2:obstacles.addImage(obstacle2)
   break;
   case 3:obstacles.addImage(obstacle3)
   break;
   case 4:obstacles.addImage(obstacle4)
   break;
   case 5:obstacles.addImage(obstacle5)
   break;
   default:break
 }
 obstacleGroup.add(obstacles)
  }
}