/**
 * @param {number[]} height
 * @return {number}
 */
 const trap = (height) => {
  
    let p1 = 0;
    let p2 = height.length-1;
  
    let totalArea = 0;
    let min=0;
    while(p1<p2){
  
      let smaller = Math.min(height[p1],height[p2]);
      if(smaller == height[p1]){
        if(smaller<=min){
          totalArea += min - height[p1];
          p1++;
        } else {
          min = smaller;
          p1++;
        }
      } else {
        if(smaller<=min){
          totalArea += min - height[p2];
          p2--;
        } else {
          min = smaller;
          p2--;
        }
      }
  
      // console.log('smaller',smaller);
      // console.log('min',min);
      
      // console.log('p1',p1,height[p1]);
      // console.log('p2',p2,height[p2]);
  
      
  
      // console.log(totalArea);
      // console.log('---------------');
      
    }
    
  
    
    return totalArea;
  };
  
  const height = 
  [6,4,2,0,3,2,0,3,1,4,5,3,2,7,5,3,0,1,2,1,3,4,6,8,1,3]
  
  console.log(trap(height));
  
  