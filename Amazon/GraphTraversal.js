
function BFSGraphAdjacencyList(){
    const adjacencyList = 
    [
      [1,3],
      [0],
      [3,8],
      [0,2,4,5],
      [3,6],
      [3],
      [4,7],
      [6],
      [2],
    ];
    
    
    let queue = [0];
    let answer = [];
    let seen = new Map();
    
    while(queue.length > 0){
      let currentVertex = queue.shift();
      seen.set(currentVertex,true);
      answer.push(currentVertex);
      let vertexConnections = adjacencyList[currentVertex];
      for(let i=0;i<vertexConnections.length;i++){
        if(!seen.get(vertexConnections[i])){
          queue.push(vertexConnections[i]);
        }
      }
    }
    
  }
  
  function BFSGraphAdjacencyMatrix(){
    const adjacencyList = 
    [
      [0,1,0,1,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,0,1],
      [1,0,1,0,1,1,0,0,0],
      [0,0,0,1,0,0,1,0,0],
      [0,0,0,1,0,0,0,0,0],
      [0,0,0,0,1,0,0,1,0],
      [0,0,0,0,0,0,1,0,0],
      [0,0,1,0,0,0,0,0,0],
    ];
  
  
    let queue = [0];
    let answer = [];
    let seen = new Map();
  
    while(queue.length > 0){
      let currentVertex = queue.shift();
      answer.push(currentVertex);
      seen.set(currentVertex,true);
      let vertexConnections = adjacencyList[currentVertex];
      for (let i=0;i<vertexConnections.length;i++){
        if(vertexConnections[i] == 1 && !seen.get(i)){
          queue.push(i);
        }
      }
  
      console.log('queue',queue);
      console.log('answer',answer);
      console.log('----------');
      
    }
  
    console.log(answer);
    
  }
  
  
  function DFSGraphAdjacencyList(adjacencyList){
  
    let seen = new Map();
  
    let answer = [];
    helperDFSGraphAdjacencyList(adjacencyList,0,answer,seen)
    
    console.log(answer)
    
  }
  
  function helperDFSGraphAdjacencyList(adjacencyList,vertex,answer,seen){
    seen.set(vertex,true);
    answer.push(vertex);
    for(let i=0;i<adjacencyList[vertex].length;i++){
      let number = adjacencyList[vertex][i];
      if(!seen.get(number)){
        helperDFSGraphAdjacencyList(adjacencyList,number,answer,seen);
      }
    }
  }
  
  
  
  
  function DFSGraphAdjacencyMatrix(adjacencyMatrix){
  
    let seen = new Map();
    let answer = [];
  
    helperDFSGraphAdjacencyMatrix(adjacencyMatrix,0,answer,seen)
    
    console.log(answer)
    
  }
  
  function helperDFSGraphAdjacencyMatrix(adjacencyMatrix,vertex,answer,seen){
    answer.push(vertex);
    seen.set(vertex,true);
  
    let connectedVertices = adjacencyMatrix[vertex];
    for(let i=0;i<connectedVertices.length;i++){
      if(connectedVertices[i] == 1 && !seen.get(i)){
        helperDFSGraphAdjacencyMatrix(adjacencyMatrix,i,answer,seen);
      }
    }
  }
  
   const adjacencyList = 
    [
      [1,3],
      [0],
      [3,8],
      [0,4,5,2],
      [3,6],
      [3],
      [4,7],
      [6],
      [2],
    ];
  
  // DFSGraphAdjacencyList(adjacencyList);
  
  
  const adjacencyMatrix = 
    [
      [0,1,0,1,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,0,1],
      [1,0,1,0,1,1,0,0,0],
      [0,0,0,1,0,0,1,0,0],
      [0,0,0,1,0,0,0,0,0],
      [0,0,0,0,1,0,0,1,0],
      [0,0,0,0,0,0,1,0,0],
      [0,0,1,0,0,0,0,0,0],
    ];
  
  DFSGraphAdjacencyMatrix(adjacencyMatrix);