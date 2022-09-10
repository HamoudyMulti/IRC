/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
 var canFinish = function(numCourses, prerequisites) {
    let adjacencyList = new Array(numCourses).fill(0).map(e => []);
    for (let i=0;i<prerequisites.length;i++){
        adjacencyList[prerequisites[i][1]].push(prerequisites[i][0]);
    }
    
    let visited = new Set();
    for(let i=0;i<numCourses;i++){
        if(!helperCanFinish(adjacencyList,[i],new Set())){
            return false;
        }
    }
    
    return true;
};

const helperCanFinish = (adjacencyList,queue,seen) => {
    
    let first = queue[0];
    while(queue.length > 0){
        let vertex = queue.shift();
        
        seen.add(vertex);
        let connectedVertices = adjacencyList[vertex];
        for(let i=0;i<connectedVertices.length;i++){
            if(connectedVertices[i] == first){
                return false;
            }
            if(!seen.has(connectedVertices[i])){
                queue.push(connectedVertices[i]);
            }
        }
    }
    
    return true;
    
}