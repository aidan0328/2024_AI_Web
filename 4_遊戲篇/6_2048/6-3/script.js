let grid = [];
let score = 0;
let size = 4; // 預設大小
let cellSize = 80; // 預設方塊大小
let cellMargin = 15; // 方塊間距

function initializeGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    
    // 根據大小設置網格的類名
    container.className = `grid-container size-${size}`;
    
    // 更新方塊大小
    switch(size) {
        case 3: cellSize = 100; break;
        case 4: cellSize = 80; break;
        case 5: cellSize = 65; break;
        case 6: cellSize = 55; break;
        case 8: cellSize = 45; break;
    }

    // 創建網格
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'grid-row';
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function changeGridSize() {
    size = parseInt(document.getElementById('gridSize').value);
    newGame();
}

function newGame() {
    grid = Array(size).fill().map(() => Array(size).fill(0));
    score = 0;
    document.getElementById('score').textContent = score;
    initializeGrid();
    addNewTile();
    addNewTile();
    updateGrid();
}

function createTile(row, col, value) {
    const container = document.querySelector('.grid-container');
    const tile = document.createElement('div');
    tile.className = `tile tile-${value}`;
    tile.textContent = value;
    
    const left = col * (cellSize + cellMargin) + cellMargin;
    const top = row * (cellSize + cellMargin) + cellMargin;
    
    tile.style.left = `${left}px`;
    tile.style.top = `${top}px`;
    
    container.appendChild(tile);
}

function addNewTile() {
    let available = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
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
    const tiles = container.getElementsByClassName('tile');
    while(tiles.length > 0) {
        tiles[0].remove();
    }
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] !== 0) {
                createTile(i, j, grid[i][j]);
            }
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

document.addEventListener('keydown', function(event) {
    let moved = false;
    
    switch(event.key) {
        case 'ArrowUp': moved = moveUp(); break;
        case 'ArrowDown': moved = moveDown(); break;
        case 'ArrowLeft': moved = moveLeft(); break;
        case 'ArrowRight': moved = moveRight(); break;
    }
    
    if (moved) {
        addNewTile();
        updateGrid();
        document.getElementById('score').textContent = score;
        
        if (isGameOver()) {
            alert('遊戲結束！');
        }
    }
});

function moveLeft() {
    let moved = false;
    for (let i = 0; i < size; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        let newRow = row.concat(Array(size - row.length).fill(0));
        if (newRow.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = newRow;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < size; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j - 1, 1);
                moved = true;
            }
        }
        let newRow = Array(size - row.length).fill(0).concat(row);
        if (newRow.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = newRow;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < size; j++) {
        let column = [];
        for (let i = 0; i < size; i++) {
            if (grid[i][j] !== 0) column.push(grid[i][j]);
        }
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i + 1, 1);
                moved = true;
            }
        }
        let newColumn = column.concat(Array(size - column.length).fill(0));
        for (let i = 0; i < size; i++) {
            if (grid[i][j] !== newColumn[i]) moved = true;
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < size; j++) {
        let column = [];
        for (let i = 0; i < size; i++) {
            if (grid[i][j] !== 0) column.push(grid[i][j]);
        }
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i - 1, 1);
                moved = true;
            }
        }
        let newColumn = Array(size - column.length).fill(0).concat(column);
        for (let i = 0; i < size; i++) {
            if (grid[i][j] !== newColumn[i]) moved = true;
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

function isGameOver() {
    // 檢查是否還有空格
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    
    // 檢查是否還有可以合併的相鄰數字
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 1; j++) {
            if (grid[i][j] === grid[i][j + 1]) return false;
        }
    }
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size - 1; i++) {
            if (grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    
    return true;
}

// 初始化遊戲
newGame();