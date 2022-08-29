const quickSort = (arr) => {
    if(arr.length == 0 || arr.length == 1){
      return arr;
    }
  
    let pivot = arr[arr.length-1];
    let i=0;
    let j=0;
    while(j<arr.length-1){
      if(arr[j]<pivot){
        swap(arr,i,j);
        i++;
        j++;
      } else {
        j++;
      }
    }
  
    swap(arr,i,j);
    let left = arr.slice(0,i);
    let right = arr.slice(i+1);
    
    return quickSort(left).concat(arr[i]).concat(quickSort(right));
  }
  
  
  
  const swap = (arr,i,j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  
  
  const arr = [2,7,8,6,4,1,9,3,5,10,11,54,32,44,56,12,23,23,23,22,30];
  console.log(quickSort(arr));