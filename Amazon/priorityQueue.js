class PriorityQueue{
    constructor(comparator = (a,b) => a > b){
      this._heap = [];
      this._comparator = comparator;
    }
  
    push(number){
      this._heap.push(number);
      this._siftUp();
      
      return this.size();
    }
  
    peek(){
      return this._heap[0];
    }
  
    isEmpty(){
      return this._heap.length === 0;
    }
  
    pop(){
      if(this.size() > 1){
        this._swap(0,this.size()-1);
      }
      let number = this._heap.pop();
      this._siftDown();
      
      return number;
    }
  
    size(){
      return this._heap.length;
    }
  
    _siftUp(){
      let indexAdded = this._heap.length-1;
      while(indexAdded > 0 && this._compare(indexAdded,this._parent(indexAdded)) ){
        this._swap(this._parent(indexAdded),indexAdded);
        indexAdded=this._parent(indexAdded);
      }
    }
  
    _siftDown(){
      let number = 0;
      while(  (this._compare(this._left(number),number) && this._left(number) < this.size())
            || (this._compare(this._right(number),number) && this._right(number) < this.size())  )
      {
          let max;
          if(
            this._right(number) < this.size() && this._compare(this._right(number),this._left(number))
          ){
            max = this._right(number);
          } else {
            max = this._left(number);
          }
  
          this._swap(max,number);
          number = max;
        
      }
    }
  
    _swap(a,b){
      let temp = this._heap[a];
      this._heap[a] = this._heap[b];
      this._heap[b] = temp;
    }
  
    _compare(a,b){
      return this._comparator(this._heap[a],this._heap[b]);
    }
  
    _parent(num){
      return Math.floor((num-1)/2);
    }
  
    _left(num){
      return num*2+1;
    }
  
    _right(num){
      return num*2+2;
    }
  
    
  }
  
  
  
  
  const pq = new PriorityQueue();
  pq.push(15);
  pq.push(12);
  pq.push(50);
  pq.push(7);
  pq.push(40);
  pq.push(22);
  
  
  
  console.log(pq);
  let n = pq.pop();
  console.log(n);
  n = pq.pop();
  console.log(n);
  n = pq.pop();
  console.log(n);
  console.log(pq);
  