/**
 * @param {number[]} cost
 * @return {number}
 */
 var minCostClimbingStairs = function(cost) {
    let n = cost.length;
    let memoize = new Array(cost.length);
    return Math.min(minCost(cost,n-1,memoize),minCost(cost,n-2,memoize)); 
};

const minCost = (cost,i,memoize) => {
    if(i<0){
        return 0;
    }
    if(i==0 || i==1){
        return cost[i];
    }
    if(memoize[i]){
        return memoize[i];
    }
    
    memoize[i] = cost[i]+Math.min(minCost(cost,i-1,memoize),minCost(cost,i-2,memoize));
    return memoize[i];
    
    
}