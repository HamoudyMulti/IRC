function twoSum(arr,target){

    const obj = {};
  
    for (let i=0; i<arr.length;i++){
      if(obj[arr[i]] >= 0){
        return [i,obj[arr[i]]];
      } else {
        obj[target-arr[i]] = i;
      }
  
      
    }
  
    return null;
  }
  
  const arr = [1,3,2,4];
  console.log(arr);
  console.log(twoSum(arr,3));
  
  
  const result=
  {
    6: {
      number:1,
      index:0
    },
    4:{
      number:3,
      index:1,
    },
    5:{
      number:2,
      index:2,
    },
    3:{
      number:4,
      index:3
    }
  }
  
  