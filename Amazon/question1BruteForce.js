var twoSum = function(arr, target) {
   

    for (let i=0; i<arr.length;i++){
      for(let j=i+1;j<arr.length;j++){
          if(arr[i] + arr[j] == target){
            return [i,j];
          }
      }
    }
  
    return null;
  };
  
  
  const arr = [1,2,3,4];
  
  console.log(arr);
  
  console.log(twoSum(arr,7));