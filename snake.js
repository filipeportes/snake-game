const step = 20;
const width = 800;
const height = 600;
const initialFr = 8;

let gameover, snake, direction, foodX, foodY, directionQueue, directionMap;

function setup() {
    createCanvas(width, height);
    textSize(18);
    gameover = false;
    snake = [];
    directionQueue = [];
    direction = RIGHT_ARROW;
    directionMap = new Map();
    directionMap.set(RIGHT_ARROW, {move: e => e.x += step, isValid: d => d === UP_ARROW || d === DOWN_ARROW});
    directionMap.set(LEFT_ARROW, {move: e => e.x -= step, isValid: d => d === UP_ARROW || d === DOWN_ARROW});
    directionMap.set(UP_ARROW, {move: e => e.y -= step, isValid: d => d === RIGHT_ARROW || d === LEFT_ARROW});
    directionMap.set(DOWN_ARROW, {move: e => e.y += step, isValid: d => d === RIGHT_ARROW || d === LEFT_ARROW});
    snake.push({x: step * 2, y: 0, d: RIGHT_ARROW}, {x: step, y: 0, d: RIGHT_ARROW}, {x: 0, y: 0, d: RIGHT_ARROW});
    food();
}

function keyPressed() {
    if (directionMap.get(direction).isValid(keyCode)) {
        direction = keyCode;
        directionQueue.push({x: snake[0].x, y: snake[0].y, d: direction});
    }
}

function nextPosition(e) {
    directionMap.get(e.d).move(e);
}

function food() {
    foodX = floor(random(0, (width / step))) * step;
    foodY = floor(random(0, (height / step))) * step;
    if (isSnakeBody(foodX, foodY)) {
        food();
    }
}

function isSnakeBody(x, y, ignoreHead = false) {
    return snake.some( (s, index) => {
        if(ignoreHead && index === 0) {
            return false;
        }
        return s.x === x && s.y === y;
    });
}

function isOut(x, y) {
    return x < 0 || x > width - step || y < 0 || y > height - step;
}
  
function draw() {
    if (gameover) {
        text("GAME OVER", width / 2 - 50, height / 2);
        text("score: " + snake.length, width / 2 - 30, height / 2 + 20);
        return;
    }

    frameRate(floor(snake.length / 10) + initialFr);
    background(40);
    fill('red');
    rect(foodX, foodY, step, step);
    fill('white');
    snake.forEach((e, index) => {
        rect(e.x, e.y, step, step); 

        for (let dIndex = 0; dIndex < directionQueue.length; dIndex++) {
            const dItem = directionQueue[dIndex];
            if (dItem.x === e.x & dItem.y === e.y) {
                e.d = dItem.d;
                if (index === snake.length - 1) {
                    directionQueue.splice(dIndex, 1);
                }
            }
        }
        nextPosition(e);
    });

    let headX = snake[0].x;
    let headY = snake[0].y;
    gameover = isSnakeBody(headX, headY, true) || isOut(headX, headY);
    if (int(dist(headX, headY, foodX, foodY)) === 0) {
        let add = {x: headX, y: headY, d: direction};
        nextPosition(add);
        snake.unshift(add);
        food();
    }

    text("score: " + snake.length, 725, 20);
}