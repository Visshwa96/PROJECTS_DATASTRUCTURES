document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const movesDiv = document.getElementById('moves');
    
    const boardSize = 8;
    const knightMoves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];

    // Create the board
    const board = [];
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            const square = document.createElement('div');
            square.classList.add('square', (i + j) % 2 === 0 ? 'white' : 'black');
            chessboard.appendChild(square);
            board[i][j] = square;
        }
    }

    // Function to move the knight
    const moveKnight = (x, y) => {
        board[x][y].classList.add('knight');
        setTimeout(() => {
            board[x][y].classList.remove('knight');
        }, 500);
    }

    // Print moves
    const printMove = (move) => {
        const moveText = `Move to (${move[0] + 1}, ${move[1] + 1})`;
        const moveElement = document.createElement('div');
        moveElement.textContent = moveText;
        movesDiv.appendChild(moveElement);
    }

    // Check if position is valid
    const isValid = (x, y, board) => {
        return (x >= 0 && y >= 0 && x < boardSize && y < boardSize && board[x][y] === -1);
    }

    // Function to get the degree of the position
    const getDegree = (x, y, board) => {
        let count = 0;
        for (let i = 0; i < knightMoves.length; i++) {
            const nx = x + knightMoves[i][0];
            const ny = y + knightMoves[i][1];
            if (isValid(nx, ny, board)) {
                count++;
            }
        }
        return count;
    }

    // Function to get the next move based on Warnsdorff's rule
    const getNextMove = (x, y, board) => {
        let minDegreeIndex = -1;
        let minDegree = boardSize + 1;
        let nextX, nextY;

        for (let i = 0; i < knightMoves.length; i++) {
            const nx = x + knightMoves[i][0];
            const ny = y + knightMoves[i][1];
            const degree = getDegree(nx, ny, board);
            if (isValid(nx, ny, board) && degree < minDegree) {
                minDegreeIndex = i;
                minDegree = degree;
                nextX = nx;
                nextY = ny;
            }
        }

        return minDegreeIndex !== -1 ? [nextX, nextY] : null;
    }

    // Perform Knight's Tour using Warnsdorff's rule
    const performKnightsTour = (startX, startY) => {
        const path = [];
        const visited = Array.from({ length: boardSize }, () => Array(boardSize).fill(-1));
        let x = startX;
        let y = startY;
        visited[x][y] = 0;
        path.push([x, y]);

        for (let i = 1; i < boardSize * boardSize; i++) {
            const nextMove = getNextMove(x, y, visited);
            if (nextMove === null) {
                console.error('Failed to find a valid move');
                return null;
            }
            x = nextMove[0];
            y = nextMove[1];
            visited[x][y] = i;
            path.push([x, y]);
        }

        return path;
    }

    // Knight's initial position
    const startX = 0;
    const startY = 0;

    // Start the Knight's Tour
    const path = performKnightsTour(startX, startY);

    if (path !== null) {
        // Animate the knight's path
        let moveIndex = 0;
        const interval = setInterval(() => {
            if (moveIndex >= path.length) {
                clearInterval(interval);
                return;
            }
            const [x, y] = path[moveIndex];
            moveKnight(x, y);
            printMove([x, y]);
            moveIndex++;
        }, 500);
    }
});
