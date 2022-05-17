import UI from "./Ui.js";

const LEVEL_TIMEOUT = 3000;
const DOOR_TIMEOUT = 1500;

const DIRECTION_UP = 'up';
const DIRECTION_DOWN = 'down';

const TYPE_INNER = 'inner';
const TYPE_OUTER = 'outer';

let state = {
    currentLevel: 3,
    nextLevel: 0,
    open: true,
    moving: false,
    direction: false
};

let innerRequests = [];
let outerRequests = [];

// dom
UI.setCurrentLevel(state.currentLevel);
UI.setDoorsOpen(state.open, state.currentLevel);

let btns = document.getElementsByClassName('btn');
Array.prototype.forEach.call(btns, btn => {
    btn.addEventListener('click', newRequest)
})


// get new request

function newRequest(e) {

    let requestedLevel = parseInt(e.target.id.charAt(e.target.id.length - 1));

    if (state.currentLevel != requestedLevel) {

        if (e.target.id.includes(TYPE_INNER)) {
            innerRequests.push({
                'requestedLevel': parseInt(e.target.id.charAt(e.target.id.length - 1)),
                'direction': state.currentLevel < requestedLevel ? DIRECTION_UP : DIRECTION_DOWN
            });
        }

        if (e.target.id.includes(TYPE_OUTER)) {
            outerRequests.push({
                'requestedLevel': parseInt(e.target.id.charAt(e.target.id.length - 1)),
                'direction': state.currentLevel < requestedLevel ? DIRECTION_UP : DIRECTION_DOWN,
                'wantedDirection': e.target.id.includes('up') ? DIRECTION_UP : DIRECTION_DOWN
            });
        }
    }

    outerRequests.sort((a, b) => {
        if (a.direction === b.direction) {
            return a.requestedLevel - b.requestedLevel
        }
    })
}


// sort inner requests

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


// sort outer requests

function sortOuterRequests() {

    outerRequests[0].direction = state.currentLevel < outerRequests[0]['requestedLevel'] ? DIRECTION_UP : DIRECTION_DOWN;

    if (outerRequests.length) {

        if (outerRequests[0]['direction'] === DIRECTION_UP) {
            if (outerRequests[0]['wantedDirection'] === DIRECTION_UP) {
                outerRequests.sort((a, b) => {
                    if (a.wantedDirection === b.wantedDirection) {
                        return a.requestedLevel - b.requestedLevel
                    }
                })
            } else {
                outerRequests.sort((a, b) => {
                    if (a.wantedDirection === b.wantedDirection) {
                        return b.requestedLevel - a.requestedLevel
                    }
                })
            }
        }

        if (outerRequests[0]['direction'] === DIRECTION_DOWN) {
            if (outerRequests[0]['wantedDirection'] === DIRECTION_UP) {
                outerRequests.sort((a, b) => {
                    if (a.wantedDirection === b.wantedDirection) {
                        return a.requestedLevel - b.requestedLevel
                    }
                })
            } else {
                outerRequests.sort((a, b) => {
                    if (a.wantedDirection === b.wantedDirection) {
                        return b.requestedLevel - a.requestedLevel
                    }
                })
            }
        }
    }
}


// find out if the elevator needs to stop / is there outer request for the current level

function btwStop(level, direction) {

    let toStop = outerRequests.filter(req => (req.wantedDirection === direction && req.requestedLevel === level));

    if (toStop.length) {
        outerRequests.forEach(req => {
            if (req.wantedDirection === direction && req.requestedLevel === level) {
                outerRequests.splice(req, 1)
            }
        })

    }

    return toStop.length ? true : false;
}


// main func

function move() {

    let intervalID = setInterval(() => {

        if (innerRequests.length && state.moving === false ||
            (innerRequests.length && state.moving === true &&
                state.direction === innerRequests[0].direction)) {
            sortInnerRequests();
            console.log(innerRequests)
            state.nextLevel = innerRequests[0].requestedLevel;
            state.direction = innerRequests[0].direction;
            if (state.open === true) {
                state.open = false;
                state.moving = true
                UI.setDoorsOpen(false, state.currentLevel);
            }
            console.log(state)
            setTimeout(() => {
                state.direction === DIRECTION_UP ? state.currentLevel++ : state.currentLevel--;
                UI.moving(state.currentLevel, state.direction);
                let toStop = btwStop(state.currentLevel, state.direction);
                if (toStop === true) {
                    clearInterval(intervalID)
                    state.open = true;
                    state.moving = false;
                    UI.setDoorsOpen(true, state.currentLevel);
                    setTimeout(() => {
                        console.log(`otvorena vrata na spratu ${state.currentLevel}`)
                        move()
                    }, DOOR_TIMEOUT);
                }
                if (state.currentLevel === state.nextLevel) {
                    clearInterval(intervalID)
                    innerRequests.shift();
                    state.open = true;
                    state.moving = false;
                    UI.setDoorsOpen(true, state.currentLevel);
                    setTimeout(() => {
                        console.log(`otvorena vrata na spratu ${state.currentLevel}`)
                        move()
                    }, DOOR_TIMEOUT);
                }
            }, DOOR_TIMEOUT);
        }

        if (innerRequests.length === 0 && outerRequests.length) {
            sortOuterRequests();
            state.nextLevel = outerRequests[0].requestedLevel;
            state.direction = outerRequests[0].direction;
            if (state.open === true) {
                state.open = false;
                state.moving = true
                UI.setDoorsOpen(false, state.currentLevel);
            }
            console.log(state)
            setTimeout(() => {
                state.direction === DIRECTION_UP ? state.currentLevel++ : state.currentLevel--;
                UI.moving(state.currentLevel, state.direction);
                if (state.currentLevel === state.nextLevel) {
                    clearInterval(intervalID)
                    outerRequests.shift();
                    state.open = true;
                    state.moving = false;
                    UI.setDoorsOpen(true, state.currentLevel);
                    setTimeout(() => {
                        console.log(`otvorena vrata na spratu ${state.currentLevel}`)
                        move()
                    }, DOOR_TIMEOUT);
                }
            }, DOOR_TIMEOUT);
        }

    }, LEVEL_TIMEOUT);
}




move();