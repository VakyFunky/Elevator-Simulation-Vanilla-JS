

const LEVEL_TIMEOUT = 3000; //time to move one floor
const DOOR_TIMEOUT = 5000; //time to wait for inner commands when doors open

const DIRECTION_UP = 'up';
const DIRECTION_DOWN = 'down';

const TYPE_INNER = 'inner';
const TYPE_OUTER = 'outer';

let state = {
    currentLevel: 4,
    nextLevel: 0,
    open: true,
    nextDirection: false,
    direction: false,
    moving: false,
};

let innerRequests = [];
let outerRequests = [];

// dom
let current = document.getElementById('current');
let next = document.getElementById('next');


current.innerText = state.currentLevel;


let btns = document.getElementsByClassName('btn');
Array.prototype.forEach.call(btns, btn => {
    btn.addEventListener('click', newRequest)
})


// 
function newRequest(e) {

    let requestedLevel = parseInt(e.target.id.charAt(e.target.id.length - 1));

    let type;
    let direction;
    let nextDirection;

    if (e.target.id.includes(TYPE_INNER)) {
        type = TYPE_INNER
        direction = state.currentLevel < requestedLevel ? DIRECTION_UP : DIRECTION_DOWN;
    } else {
        type = TYPE_OUTER;
        direction = state.currentLevel < requestedLevel ? DIRECTION_UP : DIRECTION_DOWN;
        nextDirection = e.target.id.includes('up') ? DIRECTION_UP : DIRECTION_DOWN;
    }

    if (state.currentLevel != requestedLevel) {

        if (type === TYPE_INNER) {
            innerRequests.push({
                'requestedLevel': requestedLevel,
                'type': type,
                'direction': direction
            });
        }

        if (type === TYPE_OUTER) {
            outerRequests.push({
                'requestedLevel': requestedLevel,
                'type': type,
                'direction': '',
                'nextDirection': nextDirection
            });
        }
    }

    outerRequests.sort((a, b) => {
        if (a.direction === b.direction) {
            return a.requestedLevel - b.requestedLevel
        }
    })
}


move()


function move() {

    let intervalID = setInterval(() => {

        if (innerRequests.length && state.moving == false) {
            sortInnerRequests();
            console.log(innerRequests[0])
            state.moving = true;
            state.nextLevel = innerRequests[0];
            next.innerText = state.nextLevel.requestedLevel;
            state.direction = state.nextLevel.direction;
            
            
            setTimeout(() => {
                state.currentLevel += (state.nextLevel.direction == DIRECTION_UP ? 1 : -1);
                current.innerText = state.currentLevel;
                let toStop = btwStop(state.currentLevel, state.nextLevel.direction);
                if (toStop === true) {
                    clearInterval(intervalID);
                    setTimeout(() => {
                        move();
                    }, 2000)
                }
                if (state.currentLevel === state.nextLevel.requestedLevel) {
                    clearInterval(intervalID);
                    next.innerText = '';
                    innerRequests.shift()
                    if (innerRequests.length == 0) {
                        state.moving = false;
                        state.direction = false;
                    }
                    setTimeout(() => {
                        move();
                    }, 2000)
                }
            }, 1000)
        }

        else if (outerRequests.length) {
            state.moving = true;
            console.log(outerRequests)
            sortOuterRequests(outerRequests)
            state.nextLevel = outerRequests[0];
            state.direction = outerRequests[0].direction;
            state.nextDirection = outerRequests[0].nextDirection;
            next.innerText = state.nextLevel.requestedLevel;
            console.log(state.direction)

            setTimeout(() => {
                state.currentLevel += (state.currentLevel < state.nextLevel.requestedLevel ? 1 : -1);
                current.innerText = state.currentLevel;

                if (state.currentLevel === state.nextLevel.requestedLevel) {
                    clearInterval(intervalID);
                    next.innerText = '';
                    outerRequests.shift()

                    setTimeout(() => {
                        move();
                    }, 2000)
                }
            }, 1000)
        } else {
            state.moving = false;
            state.direction = false;
        }
    }, 2000);
}



function sortInnerRequests() {
    if (innerRequests.length) {
        if (innerRequests[0]['direction'] === DIRECTION_UP) {
            innerRequests.sort((a, b) => {
                if (a.direction === b.direction) {
                    return a.requestedLevel - b.requestedLevel
                }
            })
        }

        if (innerRequests[0]['direction'] === DIRECTION_DOWN) {
            innerRequests.sort((a, b) => {
                if (a.direction === b.direction) return b.requestedLevel - a.requestedLevel
            })
        }
    }
}



function sortOuterRequests(outerRequests) {

    outerRequests[0].direction = state.currentLevel < outerRequests[0]['requestedLevel'] ? DIRECTION_UP : DIRECTION_DOWN;

    if (outerRequests.length) {
        if (outerRequests[0]['direction'] === DIRECTION_UP) {

            if (outerRequests[0]['nextDirection'] === DIRECTION_UP) {
                outerRequests.sort((a, b) => {
                    if (a.nextDirection === b.nextDirection) {
                        return a.requestedLevel - b.requestedLevel
                    }
                })
            } else {
                outerRequests.sort((a, b) => {
                    if (a.nextDirection === b.nextDirection) {
                        return b.requestedLevel - a.requestedLevel
                    }
                })
            }
        }

        if (outerRequests[0]['direction'] === DIRECTION_DOWN) {

            if (outerRequests[0]['nextDirection'] === DIRECTION_UP) {
                outerRequests.sort((a, b) => {
                    if (a.nextDirection === b.nextDirection) {
                        return a.requestedLevel - b.requestedLevel
                    }
                })
            } else {
                outerRequests.sort((a, b) => {
                    if (a.nextDirection === b.nextDirection) {
                        return b.requestedLevel - a.requestedLevel
                    }
                })
            }
        }
    }
}



function btwStop(level, direction) {

    let toStop = outerRequests.filter(req => (req.nextDirection == direction && req.requestedLevel == level));

    if (toStop.length) {
        outerRequests.forEach(req => {
            if (req.nextDirection == direction && req.requestedLevel == level) {
                outerRequests.splice(req, 1)
            }
        })

    }

    return toStop.length ? true : false;
}






