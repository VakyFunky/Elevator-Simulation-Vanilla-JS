let currentLevel = document.getElementsByClassName('current');
let insideCurrentLevel = document.getElementById('inside-current');
let inner_doors = document.getElementsByClassName('inner-doors')


// notifications 
let closeDoors = document.getElementsByClassName('closing');
let openDoors = document.getElementsByClassName('opening');
let movingUp = document.getElementsByClassName('moving_up');
let movingDown = document.getElementsByClassName('moving_down')

// inner notifications
let inside_open = document.getElementById('inside_opening');
let inside_close = document.getElementById('inside_closing');
let inside_movingUp = document.getElementById('inside_up');
let inside_movingDown = document.getElementById('inside_down');


export default class UI {

    static setCurrentLevel(level) {
        Array.prototype.forEach.call(currentLevel, current => {
            current.innerText = level;
            current.classList.remove('green');
            current.classList.add('red')
        })

        // document.getElementById(`inside-current`)level_4-current

        // document.getElementById(`inner_${level}`).classList.remove('btn-active');
    }


    // set doors open or closed

    static setDoorsOpen(open, level) {
        let outer_doors = document.getElementsByClassName(`door-${level}`);
        let notification_outer = document.getElementById(`opening_${level}`);

        if (open === true) {
            Array.prototype.forEach.call(inner_doors, door => {
                door.classList.remove('closed-doors');
                door.classList.add('opened-doors');
            })
            Array.prototype.forEach.call(outer_doors, door => {
                door.classList.remove('closed-doors');
                door.classList.add('opened-doors');
            })
            // outer current 
            document.getElementById(`level_${level}-current`).classList.remove('red');
            document.getElementById(`level_${level}-current`).classList.add('green');
            // outer notifications
            Array.prototype.forEach.call(movingUp, up =>{
                up.style.display = 'none';
            })
            Array.prototype.forEach.call(movingDown, down=>{
                down.style.display = 'none';
            })
            // doors closing notification
            Array.prototype.forEach.call(closeDoors, close => {
                close.style.display = 'flex';
            })
            // doors opening notification
            document.getElementById(`closing_${level}`).style.display = 'none';
            document.getElementById(`opening_${level}`).style.display = 'flex';
            // notifications
            // inside
            inside_open.style.display = 'flex';
            inside_close.style.display = 'none';
            inside_movingDown.style.display = 'none';
            inside_movingUp.style.display = 'none';

            insideCurrentLevel.classList.remove('red');
            insideCurrentLevel.classList.add('green')
        }

        if (open === false) {
            Array.prototype.forEach.call(inner_doors, door => {
                door.classList.remove('opened-doors');
                door.classList.add('closed-doors');
            })

            console.log(outer_doors)
            Array.prototype.forEach.call(outer_doors, door => {
                door.classList.remove('opened-doors');
                door.classList.add('closed-doors');
            })
            // doors closing notification
            // inside
            inside_open.style.display = 'none';
            inside_close.style.display = 'flex';
            insideCurrentLevel.classList.remove('gree');
            insideCurrentLevel.classList.add('red')
            // outside
            document.getElementById(`opening_${level}`).style.display = 'none';
            Array.prototype.forEach.call(closeDoors, close => {
                close.style.display = 'flex';
            })
            document.getElementById(`level_${level}-current`).classList.remove('green');
            document.getElementById(`level_${level}-current`).classList.add('red');
        }
    }

    // moving up or down
    static moving(level, direction) {

        Array.prototype.forEach.call(currentLevel, current => {
            current.innerText = level;
            current.classList.remove('green');
            current.classList.add('red')
        })
        Array.prototype.forEach.call(closeDoors, close => {
            close.style.display = 'none';
        })
        if (direction === 'up') {
            Array.prototype.forEach.call(movingUp, up =>{
                up.style.display = 'flex';
            })
            console.log('uuuuuuuuuuuuuuuuuuuuuuuuuup')
        }
        if (direction === 'down') {
            Array.prototype.forEach.call(movingDown, down=>{
                down.style.display = 'flex';
            })
            console.log('down')
        }
    }
}