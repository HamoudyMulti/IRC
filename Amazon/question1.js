function twoSum(arr1,target){

    const sortedArray = [...arr1].sort();
    let index1;
    let index2;
    
    for(let i=0;i<sortedArray.length;i++){
        const index = sortedArray.findIndex(item => target - item == sortedArray[i]);
        if(index!= -1){
          index1 = i;
          index2 = index;
          break;
        }
    }
  
    
    index1 = arr1.findIndex(e => e == sortedArray[index1]);
    index2 = arr1.findIndex(e => e == sortedArray[index2]);
  
    
  
  
    if(index1!= -1 && index2!= -1){
      return [index1,index2];
    } else {
      return null;
      
    }
  
    
  }
  
  
  const arr1 = [1,3,2,4];  
  //           [1,2,3,4]  //2,3
  
  
  
  console.log(twoSum(arr1,4));
  
  
  