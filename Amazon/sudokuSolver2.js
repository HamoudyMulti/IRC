/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
 var solveSudoku = function(board) {
    
    let rows = new Array(board.length).fill(0).map(()=>[]);
    let cols = new Array(board.length).fill(0).map(()=>[]);
    let subBox = new Array(board.length).fill(0).map(()=>[]);

    
    for(let i=0;i<board.length;i++){
        for(let j=0;j<board[0].length;j++){
            if(board[i][j] != "."){
                let box_index = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                subBox[box_index].push(board[i][j]);
                rows[i].push(board[i][j]);
                cols[j].push(board[i][j]);
            }
        }
    }
    
    console.log(rows);
    console.log(cols);
    console.log(subBox);
    
    // helperSolveSudoku(board,numbersSet,0,0,subBox);
   
};


const helperSolveSudoku = (board,numbersSet,row,col,subBox) => {
    
    if(col == board[0].length){
        return helperSolveSudoku(board,numbersSet,row+1,0,subBox);
    }
    
    if(row == board.length){
        console.log('yes');
        console.log(board);
        return board;
    }
    
    if(board[row][col] == "."){
        let scanRow = new Set();
        let scanCol = new Set();
        for(let i=0;i<board.length;i++){
            if(board[row][i] != "."){
                scanRow.add(board[row][i]);
            }
            if(board[i][col] != "."){
                scanCol.add(board[i][col]);
            }
            
        }
        
        let box_index = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        let box = new Set([...subBox[box_index]]);
        
        
        let unionSets = new Set([...scanRow,...scanCol,...box]);
        
        let numbersToChoose = new Set([...numbersSet].filter(x => !unionSets.has(x)));
        numbersToChoose = [...numbersToChoose];
        for(let i=0;i<numbersToChoose.length;i++){
            board[row][col] = numbersToChoose[i];
            helperSolveSudoku(board,numbersSet,row,col+1,subBox);
            board[row][col] = ".";
        }
            
        
        
    } else {
        helperSolveSudoku(board,numbersSet,row,col+1,subBox);
    }
    
    
    
    
    
}