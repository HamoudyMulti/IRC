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
    
    let DFSseen = new Set();
    let seen = new Set();
    for(let i=0;i<numCourses;i++){
        if(!helperCanFinish(adjacencyList, i, DFSseen,seen)) {
            return false;
        }
    }
    
    return true;
};


const helperCanFinish = (adjacencyList, vertex, DFSseen,seen) => {
    if(DFSseen.has(vertex)){
        return false;        
    }
    
    if(seen.has(vertex)){
        return true;        
    }
    
    seen.add(vertex);
    DFSseen.add(vertex);
    
    
    let connectedVertices = adjacencyList[vertex];
    let condition = true;
    
    for(let i=0;i<connectedVertices.length;i++){
        let res = helperCanFinish(adjacencyList,connectedVertices[i],DFSseen,seen);
        condition = condition && res;
    }
    
    DFSseen.delete(vertex);
    
    
    return condition;
}