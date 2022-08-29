var searchRange = function(nums, target) {

    let index = binarySearch(nums,0,nums.length-1,target);
    if(index == -1) return [-1,-1];
    let startPos = index;
    let endPos = index;
    let resStart;
    let resStop;
  
    while((resStart = binarySearch(nums,0,startPos-1,target)) != -1){
      startPos = resStart;
    }
    while((resStop = binarySearch(nums,endPos+1,nums.length-1,target)) != -1){
      endPos = resStop;
    }
  
  
    return [startPos,endPos];
  };
  
  
  
  const binarySearch = (arr,left,right,target) => {
  
  
    while(left <= right){
      middle = Math.floor((left+right) / 2);
  
      if(target == arr[middle]){
        return middle;
      }
      if(target < arr[middle]){
        right = middle - 1;
      }
    
      if(target > arr[middle]){
        left = middle+1;
      }
    }
    return -1;
    
    
  }
  
  
  
  const arr = [0,0,0,1,2,3]
  
  console.log(searchRange(arr,0));