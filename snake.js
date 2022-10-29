// toate sunt '' inafara de una care e 'r' | 'u' | 'd' | 'l'
const cellDimention = 50
const width = Math.floor(window.innerWidth * .9 / cellDimention)
const height = Math.floor(window.innerHeight * .9 / cellDimention)

let difficulty = 70;
let score = 0;

let bodyX = []; // [first after head.... last after head]
let bodyY = [];
let headPosX = 0; // position of the snake head horizontally; -- means left
let headPosY = height - 1; // position of the snake head vertically; -- means up

// mereu una din ele va fi 0 ca se mearga doar in cruce, nu si pe diagonala
let direction = "down";
let directionLastFrame = direction;
let directionX = 0;
let directionY = 1;
let isSecondRender = false
let foodX;
let foodY;
randomizeFoodPosition();

function randomizeFoodPosition() {
  foodX = Math.floor(Math.random() * width);
  foodY = Math.floor(Math.random() * height);
}

function render() {
  let str = `<div style="border: 1px solid black; display: inline-block">`;

  if (!isSecondRender) {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let isBody = false;

        for (let k = 0; k < bodyX.length; k++) {
          if (bodyX[k] === j && bodyY[k] === i) {
            isBody = true;
            break;
          }
        }
        const isFood = foodX == j && foodY == i;
        const isHead = i == headPosY && j == headPosX;

        const content = isHead
          ? `<img width="${cellDimention}px" height="${cellDimention}px" src="Mihai.png">`
          : isFood
            ? `<img width="${cellDimention}px" height="${cellDimention}px" src="shit.png">`
            : isBody
              ? `<img width="${cellDimention}px" height="${cellDimention}px" src="trash.png">`
              : `<img width="${cellDimention}px" height="${cellDimention}px" src="trash.png">`;

        str += `<div data-x=${j} data-y=${i} style="width:${cellDimention}px; height:${cellDimention}px; display: inline-block;">${content}</div>`;
      }
      str += `<br>`;
    }

    document.body.innerHTML = str + `</div><br><span style="font-size: 40px">${score}</span>`;

  } else {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let isBody = false;

        for (let k = 0; k < bodyX.length; k++) {
          if (bodyX[k] === j && bodyY[k] === i) {
            isBody = true;
            break;
          }
        }
        const isFood = foodX == j && foodY == i;
        const isHead = i == headPosY && j == headPosX;

        const src = isHead
          ? "Mihai.png"
          : isFood
            ? "shit.png"
            : isBody
              ? "trash.png"
              : "";

        const element = document.querySelector(`[data-x="${j}"][data-y="${i}"] img`)
        element.src = src
        element.style.display = src ? 'inline' : 'none'
      }
    }
  }

  isSecondRender = true
}

function frame() {
  const initialHeadPosX = headPosX;
  const initialHeadPosY = headPosY;
  const hasBody = bodyX.length > 0;
  // change position of head
  headPosX += directionX;
  headPosY += directionY;

  const isOnFood = headPosX === foodX && headPosY === foodY;

  // change position of body
  bodyX.unshift(initialHeadPosX);
  bodyY.unshift(initialHeadPosY);

  if (!isOnFood) {
    bodyX.pop();
    bodyY.pop();
  }

  if (headPosY === -1) {
    headPosY = height - 1;
  }
  if (headPosY === height) {
    headPosY = 0;
  }
  if (headPosX === width) {
    headPosX = 0;
  }
  if (headPosX === -1) {
    headPosX = width - 1;
  }
  if (isOnFood) {
    score++;
    randomizeFoodPosition();
  }

  let isOnBody = false;
  for (let k = 0; k < bodyX.length; k++) {
    if (bodyX[k] === headPosX && bodyY[k] === headPosY) {
      isOnBody = true;
      break;
    }
  }

  if (isOnBody) {
    alert("🚮 esti gunoi");
    score = 0;
    isUp = false;
    isDown = true;
    isLeft = false;
    isRight = false;

    bodyX = []; // [first after head.... last after head]
    bodyY = [];
    headPosX = 10; // position of the snake head horizontally; -- means left
    headPosY = 10; // position of the snake head vertically; -- means up

    directionX = 0;
    directionY = 1;
  }

  directionLastFrame = direction;

  render(isOnFood);
  setTimeout(frame, difficulty);
}

setTimeout(frame, 0);

function handleKeyDown(e) {
  if (e.key === "w" && directionLastFrame !== "down") {
    directionX = 0;
    directionY = -1;
    direction = "up";
  }

  if (e.key === "a" && directionLastFrame !== "right") {
    directionX = -1;
    directionY = 0;
    direction = "left";
  }

  if (e.key === "s" && directionLastFrame !== "up") {
    directionX = 0;
    directionY = 1;
    direction = "down";
  }

  if (e.key === "d" && directionLastFrame != "left") {
    directionX = 1;
    directionY = 0;
    direction = "right";
  }
}

addEventListener("keydown", handleKeyDown);

{
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  var xDown = null;
  var yDown = null;

  function getTouches(evt) {
    return evt.touches ||             // browser API
      evt.originalEvent.touches; // jQuery
  }

  function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
      if (xDiff > 0) {
        handleKeyDown({ key: 'a' })
      } else {
        handleKeyDown({ key: 'd' })
      }
    } else {
      if (yDiff > 0) {
        handleKeyDown({ key: 'w' })
      } else {
        handleKeyDown({ key: 's' })
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };
}

console.log('has swipe v2'); 