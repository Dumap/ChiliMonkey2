// This section is where you will be doing most of your coding

class Entity {
  render(ctx) {
    this.domElement.style.left = this.x + "px"
    this.domElement.style.top = this.y + "px"
  }
  expolde(){
      this.root.removeChild(this.domElement);
      var audio = new Audio('https://www.shockwave-sound.com/sound-effects/explosion-sounds/Explo%20Classic.wav');
      audio.play();
      let img = document.createElement("img")
      img.src = "images/explosion.gif"
      img.style.position = "absolute"
      img.style.left = this.x + "px"
      img.style.top = this.y + "px"
      img.style.zIndex = 5
      this.root.appendChild(img)
      setTimeout(function(){
        img.parentNode.removeChild(img);
      }, 500);
  }
}
class Enemy extends Entity{
  constructor(root, xPos) {
    super();
    this.root = root
    this.x = xPos
    this.y = -ENEMY_HEIGHT
    let img = document.createElement("img")
    img.src = "images/Kodos.png"
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = 5
    root.appendChild(img)

    this.domElement = img
    // Each enemy should have a different speed
    this.speed = Math.random() / 2 + 0.05;
    
  }

  update(timeDiff) {
    this.y = this.y + timeDiff * this.speed
  }

  destroy() {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement)
  }
}
  
class Banana extends Entity{
  constructor(root, xPos, yPos, direction) {
    super();
    this.root = root
    this.x = xPos
    this.y = yPos-BANANA_HEIGHT
    this.direction = direction;
    this.destroyed = false;
    let img = document.createElement("img")
    if(direction === MOVE_LEFT){
      img.src = "images/fireballL.gif"
    }else if(direction === MOVE_RIGHT){
      img.src = "images/fireballR.gif"
    }else if(direction === MOVE_UP){
      img.src = "images/fireballU.gif"
    }else{
      img.src = "images/fireballD.gif"
    }
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = 5
    root.appendChild(img)

    this.domElement = img
    this.speed = 0.5
  }

  update(timeDiff) {
      if (this.direction === MOVE_LEFT) {
          this.x = this.x - timeDiff * this.speed
        } else if (this.direction === MOVE_UP) {
          this.y = this.y - timeDiff * this.speed
        } else if (this.direction === MOVE_RIGHT) {
          this.x = this.x + timeDiff * this.speed
        } else if (this.direction === MOVE_DOWN) {
          this.y = this.y + timeDiff * this.speed
        }
  }

  destroy() {
      if(!this.destroyed){
          this.root.removeChild(this.domElement);
          this.destroyed = true;
      }
  }
}
  
class Chili extends Entity{
  constructor(root, xPos) {
    super();
    this.root = root;
    this.x = xPos;
    this.y = -CHILI_HEIGHT;
    let img = document.createElement("img");
    img.src = "images/chili.gif";
    img.style.position = "absolute";
    img.style.left = this.x + "px";
    img.style.top = this.y + "px";
    img.style.zIndex = 5;
    root.appendChild(img);

    this.domElement = img

    this.speed = 0.5
  }

  update(timeDiff) {
    this.y = this.y + timeDiff * this.speed
  }

  destroy() {
        this.root.removeChild(this.domElement)
  }

  burst(){
      this.root.removeChild(this.domElement);
      var audio = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-01.mp3');
      audio.play();
      let img = document.createElement("img")
      img.src = "images/stars.gif"
      img.style.position = "absolute"
      img.style.left = this.x + "px"
      img.style.top = this.y + "px"
      img.style.zIndex = 5
      this.root.appendChild(img)
      setTimeout(function(){
        img.parentNode.removeChild(img);
      }, 500);
  }
}
  
class Player extends Entity{
  constructor(root) {
    super();
    this.root = root
    this.x = 2 * PLAYER_WIDTH
    this.y = GAME_HEIGHT - PLAYER_HEIGHT - 10

    let img = document.createElement("img")
    img.src = "images/MOHNkee.gif"
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = "10"

    root.appendChild(img)

    this.domElement = img
  }

  // This method is called by the game engine when left/right arrows are pressed
  move(direction) {
    if (direction === MOVE_LEFT && this.x > 0) {
      this.x = this.x - PLAYER_STEP
    } else if (direction === MOVE_UP && this.y > 0) {
      this.y = this.y - PLAYER_STEP
    } else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - PLAYER_STEP) {
      this.x = this.x + PLAYER_STEP
    } else if (direction === MOVE_DOWN && this.y < GAME_HEIGHT - PLAYER_STEP) {
      this.y = this.y + PLAYER_STEP
    }
  }
}
  
class Text {
  constructor() {
    let body = document.querySelector('body');
    this.divMyModal = document.createElement("div");
    this.divMyModal.id = 'myModal';
    this.divMyModal.className = 'modal';
    this.divMyModalContent = document.createElement("div");
    this.sgbtn = document.createElement("button");
    body.appendChild(this.divMyModal);
  }
  showDied() {
    this.divMyModalContent.className = 'modal-content';
    let pModal = document.createElement("P");
    let pText1 = document.createTextNode("You died!");
    let br = document.createElement("br");
    let img = document.createElement("img")
    img.src = "images/martiann.png"
    pModal.appendChild(pText1);
    pModal.appendChild(br);
    this.sgbtn.innerText = "Play Again?";
    this.divMyModalContent.appendChild(img);
    this.divMyModalContent.appendChild(pModal);
    this.sgbtn.id = 'modalReStartBtn';
    this.divMyModalContent.appendChild(this.sgbtn);
    this.divMyModal.appendChild(this.divMyModalContent);
    this.divMyModal.style.display = "block";
    RUNNING = false;
  }
  showStart() {
      this.divMyModalContent.className = 'modal-content-start';
      let pModal1 = document.createElement("P");
      let pText1 = document.createTextNode("The Earth has been invaded by aliens and humans have been wiped out! Only the fierce Chilimonkeys stand in the way of the conquering aliens...");
      let pModal2 = document.createElement("P");
      let pText2 = document.createTextNode("Use the arrow keys to move your monkey. Use the A, W, D and S keys to fling your flaming feces. And don't forget to eat the chilies for extra points.");
      let br = document.createElement("br");
      pModal1.appendChild(pText1);
      pModal1.appendChild(br);
      pModal2.appendChild(pText2);
      pModal2.appendChild(br);
      this.divMyModalContent.appendChild(pModal1);
      this.divMyModalContent.appendChild(pModal2);
      this.sgbtn.innerText = "Start Game";
      this.sgbtn.id = 'modalStartBtn';
      this.divMyModalContent.appendChild(this.sgbtn);
      this.divMyModal.appendChild(this.divMyModalContent);
      this.divMyModal.style.display = "block";

    }
  // hide modal
  hide() {
    this.divMyModal.style.display = "none";
    this.divMyModalContent.innerHTML = "";
    this.divMyModal.removeChild(this.divMyModalContent);
    this.divMyModal.innerHTML = "";
  }
}
  
class Score {
  constructor() {
    this.score = document.querySelector('#score');
    let title = document.createElement("h2");
    title.innerText = "SCORE";
    let p = document.createElement("P");
    this.txt1 = document.createTextNode("Your score: 0");
    this.txt2 = document.createTextNode("High score: 0");
    let br = document.createElement("br");
    p.appendChild(this.txt1);
    p.appendChild(br);
    p.appendChild(this.txt2);
    this.score.appendChild(title);
    this.score.appendChild(p);
  }
  update(score, highScore) {
    console.log("updating score");
    this.txt1.nodeValue = "Your score: " + score;
    this.txt2.nodeValue = "High score: " + highScore;
  }
  hide() {
    this.score.style.display = "none";
  }
  show() {
    this.score.style.display = "inline-block";
  }
}
  