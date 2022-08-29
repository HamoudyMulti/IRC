const grid = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
  ];
  
  const directions = [
    [-1, 0], //up
    [0, 1], //right
    [1, 0], //down
    [0, -1] //left
  ];
  
  const traversalDFS = (grid) => {
    let values = [];
    // let seen = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(false));
  
    dfs(grid,0,0,values);
  
    return values;
  }
  
  const dfs = (grid,row,col,values) => {
  
    if(row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] == "0"){
      return;
    }
  
    values.push(grid[row][col]);
    grid[row][col] == "0";
  
    for(let i=0;i<directions.length;i++){
      const dir = directions[i];
      const addRow = row + dir[0];
      const addCol = col + dir[1];
      dfs(grid,addRow, addCol, values);
    }
  }
  
  var numIslands = function(grid) {
      console.log(grid)
      traversalDFS(grid)
      console.log(grid)
  };
  
  console.log(numIslands(grid))
  
  
  