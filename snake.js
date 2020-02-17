const step = 20;
const width = 800;
const height = 600;
const initialFr = 8;

let snake, direction, foodX, foodY, directionQueue, directionMap;

function restart() {
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

function setup() {
    createCanvas(width, height);
    textSize(18);
    restart();
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
    return snake.filter( (s, index) => {
        if(ignoreHead && index === 0) {
            return false;
        }
        return s.x === x && s.y === y;
    }).length > 0;
}
  
function draw() {
    frameRate(floor(snake.length / 10) + initialFr);
    background(40);
    fill('red');
    rect(foodX, foodY, step, step);
    fill('white');

    for (let index = 0; index < snake.length; index++) {
        const e = snake[index];
        let posX = constrain(e.x, 0, width - step);
        let posY = constrain(e.y, 0, height - step);
        rect(posX, posY, step, step); 

        for (let di = 0; di < directionQueue.length; di++) {
            const dItem = directionQueue[di];
            if (dItem.x === e.x & dItem.y === e.y) {
                e.d = dItem.d;
                if (index === snake.length - 1) {
                    directionQueue.splice(di, 1);
                }
            }
        }
        nextPosition(e);
    }

    let headX = snake[0].x;
    let headY = snake[0].y;
    
    if (isSnakeBody(headX, headY, true)) {
        //TODO show gameover and score
        restart();
    }
    
    if (int(dist(headX, headY, foodX, foodY)) === 0) {
        let add = {x: headX, y: headY, d: direction};
        nextPosition(add);
        snake.unshift(add);
        food();
    }   
    
    text("score: " + snake.length, 725, 20);
}