const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let isJumping = false;
let score = 0;
let isGameOver = false;

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
    let moveInterval = setInterval(() => {
        if (position <= -20) {
            position = 580;
            if (!isGameOver) score += 10;
            scoreDisplay.textContent = `分數: ${score}`;
        }
        if (isGameOver) {
            clearInterval(moveInterval);
            return;
        }
        position -= 10;
        cactus.style.left = position + 'px';
        checkCollision();
    }, 50);
}

// 碰撞檢測
function checkCollision() {
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));

    if (cactusLeft < 50 && cactusLeft > 0 && dinoBottom < 40) {
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

// 開始遊戲
moveCactus(); 