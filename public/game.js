let hero = {
    top: 600,
    left: 575
};

let ok = false;
let lives = 3;
let score = 0;
let missiles = [];
let enemies = [
    { left: 200, top: 50},
    { left: 300, top: 50},
    { left: 400, top: 50},
    { left: 500, top: 50},
    { left: 600, top: 50},
    { left: 700, top: 50},
    { left: 800, top: 50},
    { left: 900, top: 50},
    { left: 200, top: 125},
    { left: 300, top: 125},
    { left: 400, top: 125},
    { left: 500, top: 125},
    { left: 600, top: 125},
    { left: 700, top: 125},
    { left: 800, top: 125},
    { left: 900, top: 125}
];
let enemyMissiles = [];

const initialEnemies = enemies.slice();
document.getElementById("score").textContent += '0';
document.getElementById("lives").textContent += lives;

for(let enemy = 0; enemy < enemies.length; enemy++) {
    enemies[enemy].initialTop = enemies[enemy].top;
}

let map = {};
let lastFiredMissile = new Date();
let missileDelay = 500;
let currentTime;
map[32] = true;

checkMissileDelayFire = () => {
    return ((currentTime.getTime() - lastFiredMissile.getTime()) > missileDelay);
};

fireAndUpdateLastFiredMissile = () => {
    lastFiredMissile = new Date();
    missiles.push({ 
        top: hero.top - 30, 
        left: hero.left + 20
    });
    drawMissiles();
};

document.onkeydown = (event) => {
    let keyCode = event.keyCode;
    map[keyCode] = true;
    if(map[83] === false) {
        if(map[37] === true) {
            if(hero.left > 20)
                hero.left = hero.left - 15;
            drawHero();
        }
        else if(map[39] === true) {
            if(hero.left < 1120)
                hero.left = hero.left + 15;
            drawHero();
        }
    }
    if(map[39] === true && map[83] === true) {
        if(hero.left > 20)
            hero.left = hero.left + 8;

        if(checkMissileDelayFire()) {
            fireAndUpdateLastFiredMissile();
        }
        drawHero();
    }
    if(map[83] === true && map[37] === true) {
        if(hero.left < 1120)
            hero.left = hero.left - 8;

        if(checkMissileDelayFire()) {
            fireAndUpdateLastFiredMissile();
        }
        drawHero();
    }
    if(map[83] === true) {
        if(checkMissileDelayFire()) {
            fireAndUpdateLastFiredMissile();
        }
    }
};

document.onkeyup = (event) => {
    let keyCode = event.keyCode;
    map[keyCode] = false;
};

drawHero = () => {
    document.getElementById('hero').style.left = hero.left + "px";
};

drawMissiles = () => {
    document.getElementById('missiles').innerHTML = "";
    for(let missile = 0; missile < missiles.length; missile++) {
            document.getElementById('missiles').innerHTML += `<div class='missile1' style='left:${missiles[missile].left}px; top:${missiles[missile].top}px'></div>`;
    }
};

moveMissiles = () => {
    for(let missile = 0; missile < missiles.length; missile++) {
        missiles[missile].top = missiles[missile].top - 40;
    }
};

drawEnemies = () => {
    document.getElementById('enemies').innerHTML = "";
    for(let enemy = 0; enemy < enemies.length; enemy++) {
        document.getElementById('enemies').innerHTML += `<div class='enemy' style='left:${enemies[enemy].left}px; top:${enemies[enemy].top}px'></div>`
    }
};

detectBulletEnemyColission = () => {
    for(let enemy = 0; enemy < enemies.length; enemy++) {
        for(let missile = 0; missile < missiles.length; missile++) {
            if((missiles[missile].top <= (enemies[enemy].top + 50)) && (missiles[missile].left >= enemies[enemy].left && missiles[missile].left <= (enemies[enemy].left + 50))) {
                missiles.splice(missile, 1);
                enemies.splice(enemy, 1);
                updateScore();
            }
        }
    }
};

detectBulletDestroy = () => {
    for(let missile = 0; missile < missiles.length; missile++) {
        if(missiles[missile].top <= -50) {
            missiles.splice(missile, 1);
        }
    }
};

detectEnemyBulletDestroy = () => {
    for(let missile = 0; missile < enemyMissiles.length; missile++) {
        if(enemyMissiles[missile].top >= hero.top - 150 && enemyMissiles[missile].left >= hero.left && enemyMissiles[missile].left <= hero.left + 50) {
            enemyMissiles.splice(missile, 1);
            lives--;
            document.getElementById("lives").textContent = `Lives: ${lives}`;
        }
    }
    for(let missile = 0; missile < enemyMissiles.length; missile++) {
        if(enemyMissiles[missile].top >= hero.top - 50) {
            enemyMissiles.splice(missile, 1);
        }
    }
};

updateScore = () => {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
};

moveEnemies = () => {
    for(let enemy = 0; enemy < enemies.length; enemy++) {
        if(enemies[enemy].top - enemies[enemy].initialTop >= 70 && ok === 0) ok = 1;
        if(enemies[enemy].top - enemies[enemy].initialTop <= -100) ok = 0;
        if(ok === 0) {
            enemies[enemy].top += 3;
        }
        else {
            enemies[enemy].top -= 3;
        }
    }
};

enemiesShoot = () => {
    for(let enemy = 0; enemy < enemies.length; enemy++) {
        let rand = Math.floor(Math.random() * 1001);
        if(rand < 5) 
            fireEnemyMissile(enemies[enemy]);
    }
};

fireEnemyMissile = (enemy) => {
    enemyMissiles.push({ 
        top: enemy.top, 
        left: enemy.left + 20
    });
    drawEnemyMissiles();
};

drawEnemyMissiles = () => {
    document.getElementById('enemyMissiles').innerHTML = "";
    for(let missile = 0; missile < enemyMissiles.length; missile++) {
            document.getElementById('enemyMissiles').innerHTML += `<div class='missile1' style='left:${enemyMissiles[missile].left}px; top:${enemyMissiles[missile].top}px'></div>`;
    }
};

moveEnemyMissiles = () => {
    for(let missile = 0; missile < enemyMissiles.length; missile++) {
        enemyMissiles[missile].top = enemyMissiles[missile].top + 10;
    }
};

resetGame = () => {
    lives = 3;
    score = 0;
    window.enemies = [];
    enemies = Array.from(initialEnemies);
    for(let enemy = 0; enemy < enemies.length; enemy++) {
        enemies[enemy].top = enemies[enemy].initialTop;
    }
    document.getElementById("background").style = initialBackground;
    document.getElementById("hero").style.visibility = "visible";
    document.getElementById("score").style.visibility = "visible";
    document.getElementById("lives").style.visibility = "visible";
    document.getElementById("lives").textContent = `Lives: ${lives}`;
    document.getElementById("tryAgain").remove();
    gameLoop();
};

let initialBackground = document.getElementById("background").style;

checkGameOver = () => {
    if(lives === 0) {
        clearTimeout(timeoutID);
        let backgroundStyle = document.getElementById("background").style;
        backgroundStyle.backgroundImage = "url(assets/gameover.jpg)";
        backgroundStyle.backgroundRepeat = "no-repeat";
        backgroundStyle.backgroundSize = "auto";
        backgroundStyle.backgroundPosition = "center";
        backgroundStyle.display = "flex";
        backgroundStyle.alignItems = "center";
        backgroundStyle.justifyItems = "center";
        enemies = [];
        enemyMissiles = [];
        drawEnemies();
        drawEnemyMissiles();
        document.getElementById("hero").style.visibility = "hidden";
        document.getElementById("score").style.visibility = "hidden";
        document.getElementById("lives").style.visibility = "hidden";
        let tryAgain = document.createElement("a");
        let tryAgainText = document.createTextNode("Try Again");
        tryAgain.style.color = "white";
        tryAgain.href = "#";
        tryAgain.style.zIndex = "2";
        tryAgain.style.fontSize = "4em";
        tryAgain.style.marginTop = "200px";
        tryAgain.style.fontFamily = "arcade";
        tryAgain.id = "tryAgain";
        tryAgain.appendChild(tryAgainText);
        enemies = Array.from(initialEnemies);
        document.querySelector("#background").appendChild(tryAgain);
        document.querySelector("#tryAgain").addEventListener('click', (event) => {
            event.preventDefault();
            resetGame();
        });
    }
};

let timeoutID;
gameLoop = () => {
    timeoutID = setTimeout(gameLoop, 20);
    detectBulletEnemyColission();
    detectBulletDestroy();
    detectEnemyBulletDestroy();
    moveMissiles();
    drawMissiles();
    drawEnemies();
    moveEnemies();
    enemiesShoot();
    drawEnemyMissiles();
    moveEnemyMissiles();
    checkGameOver();
    currentTime = new Date();
};

gameLoop();