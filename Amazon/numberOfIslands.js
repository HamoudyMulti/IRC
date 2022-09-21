const directions = [
    [-1, 0], //up
    [0, 1], //right
    [1, 0], //down
    [0, -1] //left
  ]
  
  
  const dfs = function(matrix, row, col) {
    if(row < 0 || col < 0 || row >= matrix.length || col >= matrix[0].length || matrix[row][col] == "0") return;
  
    matrix[row][col] = "0";
  
    for(let i = 0; i < directions.length; i++) {
      const currentDir = directions[i];
      dfs(matrix, row + currentDir[0], col + currentDir[1]);
    }
  
  }
  
  var numIslands = function(grid) {
    let count = 0;
    for(let i=0;i<grid.length;i++){
      for(let j=0;j<grid[0].length;j++){
        if(grid[i][j] == "1"){
          count++;
          dfs(grid, i, j);
        }
      }
    }
    return count;
  };