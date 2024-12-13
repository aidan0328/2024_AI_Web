const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const speedDisplay = document.getElementById('speed');
const bird = document.getElementById('bird');

let isJumping = false;
let score = 0;
let isGameOver = false;
let baseSpeed = 10;
let speedMultiplier = 1;
let cactusCount = 0;
let birdActive = false;
let baseSpeedMultiplier = 1;

// 跳躍功能
function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        let upTime = 0;
        let jumpInterval = setInterval(() => {
            let position = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
            
            // 上升階段 (15 個時間單位)
            if (upTime < 15) {
                position += 10;
                upTime++;
            } 
            // 下降階段
            else {
                position -= 10;
            }
            
            // 設置恐龍位置
            dino.style.bottom = position + 'px';
            
            // 確保恐龍回到地面時停止
            if (position <= 0) {
                clearInterval(jumpInterval);
                isJumping = false;
                dino.style.bottom = '0';
            }
        }, 20);
    }
}

// 仙人掌移動
function moveCactus() {
    let position = 580;
    
    // 隨機選擇仙人掌類型
    const cactusType = Math.random() < 0.5 ? 'cactus-1' : 'cactus-2';
    cactus.className = cactusType;
    
    let moveInterval = setInterval(() => {
        if (position <= -40) { // 考慮最大寬度
            position = 580;
            if (!isGameOver) {
                score += 10;
                cactusCount++;
                
                // 每跳過3個仙人掌增加基礎速度
                if (cactusCount % 3 === 0) {
                    baseSpeedMultiplier *= 1.2;
                    // 有機會出現飛鳥
                    if (Math.random() < 0.5 && !birdActive) {
                        birdActive = true;
                        moveBird();
                    }
                }
                
                // 隨機改變速度
                randomizeSpeed();
                
                const newCactusType = Math.random() < 0.5 ? 'cactus-1' : 'cactus-2';
                cactus.className = newCactusType;
            }
            scoreDisplay.textContent = `分數: ${score}`;
        }
        if (isGameOver) {
            clearInterval(moveInterval);
            return;
        }
        position -= (baseSpeed * speedMultiplier);
        cactus.style.left = position + 'px';
        checkCactusCollision();
    }, 50);
}

// 碰撞檢測
function checkCactusCollision() {
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));
    const dinoLeft = parseInt(window.getComputedStyle(dino).getPropertyValue('left'));
    const cactusWidth = parseInt(window.getComputedStyle(cactus).getPropertyValue('width'));
    
    if (cactusLeft < (dinoLeft + 40) && cactusLeft > (dinoLeft - cactusWidth) && dinoBottom < 35) {
        gameOver();
    }
}

// 遊戲結束
function gameOver() {
    isGameOver = true;
    gameOverDisplay.classList.remove('hidden');
}

// 重新開始遊戲
function resetGame() {
    if (isGameOver) {
        isGameOver = false;
        score = 0;
        cactusCount = 0;
        speedMultiplier = 1;
        baseSpeedMultiplier = 1;
        birdActive = false;
        bird.style.display = 'none';
        speedDisplay.textContent = `速度: ${speedMultiplier.toFixed(1)}x`;
        scoreDisplay.textContent = `分數: ${score}`;
        gameOverDisplay.classList.add('hidden');
        cactus.style.left = '580px';
        moveCactus();
    }
}

// 事件監聽
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

document.addEventListener('click', resetGame);

// 飛鳥移動函數
function moveBird() {
    let position = 580;
    bird.style.display = 'block';
    
    let moveInterval = setInterval(() => {
        if (position <= -46) {
            bird.style.display = 'none';
            clearInterval(moveInterval);
            birdActive = false;
            if (!isGameOver) score += 15; // 躲過飛鳥得分較高
            scoreDisplay.textContent = `分數: ${score}`;
        }
        if (isGameOver) {
            clearInterval(moveInterval);
            return;
        }
        position -= (baseSpeed * speedMultiplier * 1.2); // 飛鳥比仙人掌快一點
        bird.style.left = position + 'px';
        checkBirdCollision();
    }, 50);
}

// 隨機改變速度
function randomizeSpeed() {
    if (!isGameOver) {
        speedMultiplier = (Math.random() * 0.5 + 0.8) * baseSpeedMultiplier;
        speedDisplay.textContent = `速度: ${speedMultiplier.toFixed(1)}x`;
    }
}

// 檢測飛鳥碰撞
function checkBirdCollision() {
    if (!birdActive) return;
    
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    const birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue('left'));
    const dinoLeft = parseInt(window.getComputedStyle(dino).getPropertyValue('left'));
    
    // 飛鳥的碰撞範圍
    if (birdLeft < (dinoLeft + 40) && birdLeft > (dinoLeft - 46) && 
        dinoBottom > 50 && dinoBottom < 112) {
        gameOver();
    }
}

// 開始遊戲
moveCactus(); 