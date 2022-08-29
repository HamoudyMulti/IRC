const findKthLargest = (nums,k) => {
    let index = quickSort(nums,0,nums.length-1,nums.length-k);
    return nums[index];
  }
  
  const quickSort = (arr,left,right,k) => {
    if(left<right){
      let partitionIndex = partition(arr,left,right);
      
      if(k == partitionIndex){
        return partitionIndex;
      }
      if(k < partitionIndex){
        return quickSort(arr,left,partitionIndex-1,k);
      }
      if(k > partitionIndex){
        return quickSort(arr,partitionIndex+1,right,k);
      }
    }
    // if(left == right){
    //   return left;
    // }
    
  }
  
  const partition = (arr,left,right) => {
    let pivot = arr[right];
    let i=left;
    let j=left;
    while(j<right){
      if(arr[j]<=pivot){
        swap(arr,i,j);
        i++;
        j++;
      } else {
        j++;
      }
    }
  
    swap(arr,i,j);
    return i;
  }
  
  
  const swap = (arr,i,j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  
  
  const arr = [5,6,2,4,3];
  console.log(findKthLargest(arr,1));