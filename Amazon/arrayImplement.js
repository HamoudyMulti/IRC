class MyArray{
  
    constructor() {
      this.length = 0;
      this.data = {};
    }
  
    get(index) {
      return this.data[index];
    }
  
    push(item) {
      this.data[this.length] = item;
      this.length++;
      return this.length;
    }
  
    pop() {
      const lastItem = this.data[this.length-1];
      delete this.data[this.length-1];
      this.length--;
      return lastItem;
    }
  
    delete(index){
      const item = this.data[index];
      
      for(let i=index+1;i<this.length;i++){
        this.data[i-1] = this.data[i];
      }
      delete this.data[this.length - 1];
      this.length--;
  
      
      return item;
    }
  
   
  
    insert(index,item){
      for(let i=this.length;i>index;i--){
        this.data[i] = this.data[i-1];
      }
      this.data[index] = item;
    }
  
    // splice(startIndex,removeItemCount, ...values) {
    //   for(let i = startIndex; i < startIndex + removeItemCount; i++){
    //     this.delete(startIndex);
    //   }
  
    //   for(let i=0; i<values.length;i++){
    //     this.insert(startIndex,values[i]);
    //   }      
      
    // }
    
  }
  
  
  let arr = new MyArray();
  arr.push('a');
  arr.push('b');
  arr.push('c');
  arr.push('d');
  
  console.log(arr);
  // console.log(arr.insert(4,'z'));
  // console.log(arr.splice(1,2,'r','t'));
  console.log(arr);
  
  