/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
 var canFinish = function(numCourses, prerequisites) {
    let adjacencyList = new Array(numCourses).fill(0).map(e => []);
        
    for(let i=0;i<prerequisites.length;i++){
        adjacencyList[prerequisites[i][1]].push(prerequisites[i][0]);
    }

    for(let i=0;i<adjacencyList.length;i++){
        let traversedVertices = helperCanFinish(adjacencyList, prerequisites, i, new Map());
        if(!traversedVertices){
            return false;
        }

        
    }
    
    return true;
    
};


const helperCanFinish = (adjacencyList, prerequisites,vertex, map) => {
    
    map.set(vertex,true);
    let connectedVertices = adjacencyList[vertex];
    let condition = true;
    for(let i=0;i<connectedVertices.length;i++){
        if(map.get(connectedVertices[i])){
            return false;
        } else {
            condition = condition && helperCanFinish(adjacencyList, prerequisites, connectedVertices[i], map);
        }
        
    }
    
    map.set(vertex,false);
    
    
    
    return condition;
}