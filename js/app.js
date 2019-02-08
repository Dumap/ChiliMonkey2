

/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
*/
class Engine {
  constructor(element) {
    this.root = element
    // Setup the player
    this.player = new Player(this.root)
    //this.info = new Text();

    // Setup enemies, making sure there are always three
    this.setupEnemies()

    // Since gameLoop will be called out of context, bind it once here.
    this.gameLoop = this.gameLoop.bind(this)
  }

  /*
     The game allows for 5 horizontal slots where an enemy can be present.
     At any point in time there can be at most MAX_ENEMIES enemies otherwise the game would be impossible
     */
  setupEnemies() {
    if (!this.enemies) {
      this.enemies = []
    }

    while (
      this.enemies.filter(function() {
        return true
      }).length < MAX_ENEMIES
    ) {
      this.addEnemy()
    }
  }

  // This method finds a random spot where there is no enemy, and puts one in there
  addEnemy() {
    let enemySpots = GAME_WIDTH / ENEMY_WIDTH

    let enemySpot = undefined
    // Keep looping until we find a free enemy spot at random
    while (typeof enemySpot == 'undefined' || this.enemies[enemySpot]) {
      enemySpot = Math.floor(Math.random() * enemySpots);
    }

    this.enemies[enemySpot] = new Enemy(this.root, enemySpot * ENEMY_WIDTH)
  }

  // This method kicks off the game
  start() {
    GAME_PLAYED = true;
    this.lastFrame = Date.now()

    function keydownHandler(e) {
      if (e.keyCode === LEFT_ARROW_CODE) {
        MOVE_LEFT_FLG = true;
        BANANA_DIR = MOVE_LEFT;
      } else if (e.keyCode === UP_ARROW_CODE) {
        MOVE_UP_FLG = true;
        BANANA_DIR = MOVE_UP;
      }else if (e.keyCode === RIGHT_ARROW_CODE) {
        MOVE_RIGHT_FLG = true;
        BANANA_DIR = MOVE_RIGHT;
      }else if (e.keyCode === DOWN_ARROW_CODE) {
        MOVE_DOWN_FLG = true;
        BANANA_DIR = MOVE_DOWN;
      }else if (e.keyCode === SPACE_CODE){
        BANANA_FIRED = true;
      }else if (e.keyCode === A_CODE){
        BANANA_DIR = MOVE_LEFT;
        BANANA_FIRED = true;
      }else if (e.keyCode === W_CODE){
        BANANA_DIR = MOVE_UP;
        BANANA_FIRED = true;
      }else if (e.keyCode === D_CODE){
        BANANA_DIR = MOVE_RIGHT;
        BANANA_FIRED = true;
      }else if (e.keyCode === S_CODE){
        BANANA_DIR = MOVE_DOWN;
        BANANA_FIRED = true;
      }
    }
    function keyupHandler(e) {
      if (e.keyCode === LEFT_ARROW_CODE) {
        MOVE_LEFT_FLG = false;
      } else if (e.keyCode === UP_ARROW_CODE) {
        MOVE_UP_FLG = false;
      }else if (e.keyCode === RIGHT_ARROW_CODE) {
        MOVE_RIGHT_FLG = false;
      }else if (e.keyCode === DOWN_ARROW_CODE) {
        MOVE_DOWN_FLG = false;
      }
    }

    function checkMovement(){
      if(MOVE_LEFT_FLG){
        this.player.move(MOVE_LEFT);
      }else if(MOVE_UP_FLG){
        this.player.move(MOVE_UP);
      }else if(MOVE_RIGHT_FLG){
        this.player.move(MOVE_RIGHT);
      }else if(MOVE_DOWN_FLG){
        this.player.move(MOVE_DOWN);
      }
    }

    keydownHandler = keydownHandler.bind(this);
    keyupHandler = keyupHandler.bind(this);
    checkMovement = checkMovement.bind(this);

    // Listen for keyboard left/right and update the player
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("keyup", keyupHandler);

    setInterval(checkMovement, 10)

    this.gameLoop()
  }

  /*
    This is the core of the game engine. The `gameLoop` function gets called ~60 times per second
    During each execution of the function, we will update the positions of all game entities
    It's also at this point that we will check for any collisions between the game entities
    Collisions will often indicate either a player death or an enemy kill

    In order to allow the game objects to self-determine their behaviors, gameLoop will call the `update` method of each entity
    To account for the fact that we don't always have 60 frames per second, gameLoop will send a time delta argument to `update`
    You should use this parameter to scale your update appropriately
   */

  gameLoop() {
    // Check how long it's been since last frame
    let currentFrame = Date.now()
    let timeDiff = currentFrame - this.lastFrame

    // Call update on all enemies
    this.enemies.forEach(function(enemy) {
      enemy.update(timeDiff);
    })

    // Draw everything!
    //this.ctx.drawImage(images["stars.png"], 0, 0); // draw the star bg
    function renderEnemy(enemy) {
      enemy.render(this.ctx)
    }
    renderEnemy = renderEnemy.bind(this)
    this.enemies.forEach(renderEnemy) // draw the enemies
    this.player.render(this.ctx) // draw the player

    // Check if any enemies should die
    this.enemies.forEach((enemy, enemyIdx) => {
      if (enemy.y > GAME_HEIGHT) {
        this.enemies[enemyIdx].destroy()
        delete this.enemies[enemyIdx]
      }
    })
    this.setupEnemies()
  
    // chili

    if(this.chili){
      this.chili.update(timeDiff);
      this.chili.render(this.ctx);
      if(this.isCatchChili()){
        this.chili.burst()
        delete this.chili;
        GAME_SCORE += 500;
        if(GAME_SCORE > HIGH_SCORE){HIGH_SCORE = GAME_SCORE}
        score.update(GAME_SCORE, HIGH_SCORE);
      }else if(this.chili.y > GAME_HEIGHT){
        this.chili.destroy()
        delete this.chili;
      }
    }

    let randomChiliNum = Math.floor(Math.random() * 1000) + 1;
    if((!this.chili) && randomChiliNum == 13){
      let chiliW = GAME_WIDTH / CHILI_WIDTH;
      console.log("chiliW " + chiliW);
      let chiliX = Math.floor(Math.random() * chiliW) + 1;
      console.log("chiliX " + chiliX);
      this.chili = new Chili(this.root, chiliX  * CHILI_WIDTH);
      this.chili.render(this.ctx);
    }

    // fire banana

    if((!this.banana) && BANANA_FIRED){
      let bananaY = this.player.y;
      let bananaX = this.player.x;
      if(BANANA_DIR == MOVE_DOWN){
        bananaY = bananaY + PLAYER_HEIGHT;
      }else if(BANANA_DIR == MOVE_RIGHT){
        bananaY = bananaY + PLAYER_HEIGHT;
        //bananaX = bananaX + PLAYER_WIDTH;
      }else if(BANANA_DIR == MOVE_LEFT){
        bananaY = bananaY + PLAYER_HEIGHT;
        
      }
      this.banana = new Banana(this.root, bananaX, bananaY, BANANA_DIR);
      this.banana.render(this.ctx);
      BANANA_FIRED = false;
    }

    if(this.banana){
      this.banana.update(timeDiff);
      this.banana.render(this.ctx);
      if(this.isEnemyDead()){
        this.banana.destroy();
        delete this.banana;
      }else if(this.banana.y > GAME_HEIGHT+50 || this.banana.y < -100 || this.banana.x > GAME_WIDTH+300 || this.banana.x < -300){
        this.banana.destroy();
        delete this.banana;
      }
    }

    // Check if player is dead
    if (this.isPlayerDead()) {
      this.player.expolde();
      // If they are dead, then it's game over!
      var audio = new Audio('sounds/mars_attacks.mp3');
      audio.play();
      modal.showDied();
      localStorage.setItem("highscore", HIGH_SCORE);
    } else {
      // Set the time marker and redraw
      this.lastFrame = Date.now()
      setTimeout(this.gameLoop, 5)
    }
  }

  isEnemyDead(){
    let retVal = false;
    this.enemies.forEach((enemy, enemyIdx) => {
      let bananaObj = {x: this.banana.x+OFFSET, y: this.banana.y+OFFSET, width: BANANA_WIDTH-OFFSET, height: BANANA_HEIGHT-OFFSET}
      let enemyObj = {x: enemy.x+OFFSET, y: enemy.y+OFFSET, width: ENEMY_WIDTH-5, height: ENEMY_HEIGHT-OFFSET}
      
      if (bananaObj.x < enemyObj.x + enemyObj.width &&
          bananaObj.x + bananaObj.width > enemyObj.x &&
          bananaObj.y < enemyObj.y + enemyObj.height &&
          bananaObj.height + bananaObj.y > enemyObj.y) {
          retVal = true;
          enemy.expolde();
          delete this.enemies[enemyIdx];
          GAME_SCORE += 100;
          if(GAME_SCORE > HIGH_SCORE){HIGH_SCORE = GAME_SCORE}
          score.update(GAME_SCORE, HIGH_SCORE);
      }
    }) 
    return retVal;
  }

  isPlayerDead(){
    let retVal = false;
    this.enemies.forEach((enemy, enemyIdx) => {
      let playerObj = {x: this.player.x+OFFSET, y: this.player.y+OFFSET, width: PLAYER_WIDTH-OFFSET, height: PLAYER_HEIGHT-OFFSET}
      let enemyObj = {x: enemy.x+OFFSET, y: enemy.y+OFFSET, width: ENEMY_WIDTH-5, height: ENEMY_HEIGHT-OFFSET}
      
      if (playerObj.x < enemyObj.x + enemyObj.width &&
          playerObj.x + playerObj.width > enemyObj.x &&
          playerObj.y < enemyObj.y + enemyObj.height &&
          playerObj.height + playerObj.y > enemyObj.y) {
          retVal = true;
          enemy.expolde();
          delete this.enemies[enemyIdx];
      }
    }) 
    return retVal;
  }

  isCatchChili(){
    let retVal = false;
      let playerObj = {x: this.player.x+OFFSET, y: this.player.y+OFFSET, width: PLAYER_WIDTH-OFFSET, height: PLAYER_HEIGHT-OFFSET}
      let chiliObj = {x: this.chili.x+OFFSET, y: this.chili.y+OFFSET, width: CHILI_WIDTH-5, height: CHILI_HEIGHT-OFFSET}
      
      if (playerObj.x < chiliObj.x + chiliObj.width &&
          playerObj.x + playerObj.width > chiliObj.x &&
          playerObj.y < chiliObj.y + chiliObj.height &&
          playerObj.height + playerObj.y > chiliObj.y) {
          retVal = true;
      }
    return retVal;
  }

}

// This section will start the game
let body = document.querySelector('body');
let modal = new Text();
let score = new Score();
score.hide();
modal.showStart();

modal.sgbtn.addEventListener('click', function() {
  mainStart();
});

body.addEventListener('keypress', keypress, false);

function keypress() {
  if(!RUNNING && event.keyCode == 13){
    mainStart();
  }
}

function mainStart(){
  if(GAME_PLAYED){
    delete gameEngine;
    document.getElementById("app").innerHTML = "";
  }
  modal.hide();
  GAME_SCORE = 0;
  if(localStorage.getItem("highscore") > 0){
    HIGH_SCORE = localStorage.getItem("highscore");
  }
  MOVE_LEFT_FLG = false;
  MOVE_UP_FLG = false;
  MOVE_RIGHT_FLG = false;
  MOVE_DOWN_FLG = false;
  BANANA_FIRED = false;
  BANANA_DIR = MOVE_DOWN;
  var audio = new Audio('http://soundbible.com/mp3/gibbon-monkey-daniel_simon.mp3');
  audio.play();
  
  let gameEngine = new Engine(document.getElementById("app"));
  RUNNING = true;
  gameEngine.start();
  score.update(GAME_SCORE, HIGH_SCORE);
  score.show();
}

