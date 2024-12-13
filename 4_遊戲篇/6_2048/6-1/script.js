let grid = Array(4).fill().map(() => Array(4).fill(0));
let score = 0;

function newGame() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    document.getElementById('score').textContent = score;
    addNewTile();
    addNewTile();
    updateGrid();
}

function addNewTile() {
    let available = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                available.push({x: i, y: j});
            }
        }
    }
    if (available.length > 0) {
        let randomCell = available[Math.floor(Math.random() * available.length)];
        grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateGrid() {
    const container = document.querySelector('.grid-container');
    const cells = container.getElementsByClassName('grid-cell');
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const value = grid[i][j];
            const cell = cells[i * 4 + j];
            cell.textContent = value || '';
            cell.style.backgroundColor = getTileColor(value);
        }
    }
}

function getTileColor(value) {
    const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
}

document.addEventListener('keydown', handleInput);

function handleInput(event) {
    let moved = false;
    
    switch(event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    
    if (moved) {
        addNewTile();
        updateGrid();
        document.getElementById('score').textContent = score;
        
        if (isGameOver()) {
            alert('遊戲結束！');
        }
    }
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        let newRow = row.concat(Array(4 - row.length).fill(0));
        if (newRow.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = newRow;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j - 1, 1);
                moved = true;
            }
        }
        let newRow = Array(4 - row.length).fill(0).concat(row);
        if (newRow.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = newRow;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== 0) {
                column.push(grid[i][j]);
            }
        }
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i + 1, 1);
                moved = true;
            }
        }
        let newColumn = column.concat(Array(4 - column.length).fill(0));
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== 0) {
                column.push(grid[i][j]);
            }
        }
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i - 1, 1);
                moved = true;
            }
        }
        let newColumn = Array(4 - column.length).fill(0).concat(column);
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

function isGameOver() {
    // 檢查是否還有空格
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    
    // 檢查是否還有可以合併的相鄰數字
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === grid[i][j + 1]) return false;
        }
    }
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 3; i++) {
            if (grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    
    return true;
}

// 開始新遊戲
newGame();