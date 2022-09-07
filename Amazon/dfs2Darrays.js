const grid= [[2,0,1,0,0],[1,1,0,0,2],[0,1,1,1,1],[0,1,0,0,1]];

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
  if(grid.length == 0) return 0;
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



var orangesRotting = function(grid) {
  let queue = [];
  let freshOranges = 0;
  for(let i=0;i<grid.length;i++){
    for(let j=0;j<grid[0].length;j++){
      if(grid[i][j] == 2){
        queue.push([i,j]);
      }
      if(grid[i][j] == 1){
        freshOranges++;
      }
    }
  }
  

  let minutes = 0;

  let currentQueueSize = queue.length;
  while(queue.length > 0){
    if(currentQueueSize === 0) {
      currentQueueSize = queue.length;
      minutes++;
    }
    let length = queue.length;
    let count=0;
    
    let currentPos = queue.shift();
    currentQueueSize--;
    const row = currentPos[0];
    const col = currentPos[1];
  
    
    for(let i = 0; i < directions.length; i++) {
      const currentDir = directions[i];
      const nextRow = row + currentDir[0];
      const nextCol = col + currentDir[1];

      if(nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[0].length) {
        continue;
      }
      
      if(grid[nextRow][nextCol] == 1){
        grid[nextRow][nextCol] = 2;
        freshOranges--;
        queue.push([nextRow,nextCol]);
      }
    }
      
     

  }

  if(freshOranges > 0){
    return -1;
  } else {
    return minutes;
  }
  
};

console.log((grid))
console.log(orangesRotting(grid))
console.log((grid))


