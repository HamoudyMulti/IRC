/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
 var solveSudoku = function(board) {
    let numbersSet = new Set(['1','2','3','4','5','6','7','8','9']);
    helperSolveSudoku(board,numbersSet,0,2);
};


const helperSolveSudoku = (board,numbersSet,row,col) => {
    
    
    if(board[row][col] == ".") {
        let rowSet = new Set();
        let colSet = new Set();
        for(let i=0;i<board.length;i++){
            if(board[i][col] != "."){
                rowSet.add(board[i][col]);
            }
        }
        for(let i=0;i<board[0].length;i++){
            if(board[row][i] != "."){
                colSet.add(board[row][i]);
            }
        }
        
        let calculatedSetRow = new Set([...numbersSet].filter(e => !rowSet.has(e)));
        let calculatedSetCol = new Set([...numbersSet].filter(e => !colSet.has(e)));
        let availableOptions = new Set([...calculatedSetRow].filter(e => calculatedSetCol.has(e)));
        availableOptions= [...availableOptions];
        for(let i=0;i<availableOptions.length;i++){
            board[row][col] = availableOptions[i];
            
        }
        
        
    }
    
    // if(col<board[0].length-1){
    //     return helperSolveSudoku(board,numbersSet,row,col+1)
    // } else {
    //     if(row<board.length-1){
    //         return helperSolveSudoku(board,numbersSet,row+1,0)
    //     } else {
    //         if(board[row][col] != '.'){
    //             return board;
    //         }
    //     }
    // }
    
    
    
}