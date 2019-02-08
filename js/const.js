// This sectin contains some game constants. 
let GAME_WIDTH = window.innerWidth - (window.innerWidth/2);
let GAME_HEIGHT = window.innerHeight - (window.innerWidth/6);

// These two constants keep us from using "magic numbers" in our code
let LEFT_ARROW_CODE = 37
let UP_ARROW_CODE = 38
let RIGHT_ARROW_CODE = 39
let DOWN_ARROW_CODE = 40
let SPACE_CODE = 32
let A_CODE = 65
let W_CODE = 87
let D_CODE = 68
let S_CODE = 83

// These two constants allow us to DRY
let MOVE_LEFT = "left"
let MOVE_UP = "up"
let MOVE_RIGHT = "right"
let MOVE_DOWN = "down"

let MOVE_LEFT_FLG = false;
let MOVE_UP_FLG = false;
let MOVE_RIGHT_FLG = false;
let MOVE_DOWN_FLG = false;

let GAME_PLAYED = false;
let RUNNING = false;
let GAME_SCORE = 0;
let HIGH_SCORE = 0;

let ENEMY_WIDTH = 64
let ENEMY_HEIGHT = 95
let MAX_ENEMIES = 3

let BANANA_WIDTH = 35
let BANANA_HEIGHT = 35
let BANANA_FIRED = false;
let BANANA_DIR = MOVE_DOWN;

let CHILI_WIDTH = 48
let CHILI_HEIGHT = 34

let PLAYER_WIDTH = 60
let PLAYER_HEIGHT = 60
let PLAYER_STEP = 5

let OFFSET = 10


// Preload game images
let imageFilenames = ["Kodos.png", "MOHNkee.gif", "banana.gif", "chili.gif", "explosion.gif",
                      "fireballD.gif", "fireballL.gif", "fireballR.gif", "fireballU.gif"]
let images = {}

imageFilenames.forEach(function(imgName) {
  let img = document.createElement("img")
  img.src = "images/" + imgName
  images[imgName] = img
})

