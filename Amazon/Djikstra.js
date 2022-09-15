



var networkDelayTime = function(times, n, k) {
    let adjacencyList = new Array(n+1).fill(0).map(()=>[]); 
    let traversedMinList = new Array(n+1).fill(Infinity); 
    
    
    traversedMinList[k] = 0;
    let PQ = new PriorityQueue((a,b) => traversedMinList[a] < traversedMinList[b]);
    PQ.push(k);
    
    
    for(let i=0;i<times.length;i++){   
        let v1 = times[i][0];
        let v2 = times[i][1];
        let weight = times[i][2];
        
        adjacencyList[v1].push([v2,weight]);
    }
    
    

    while(!PQ.isEmpty()){  
        let vertex = PQ.pop();
        let currWeight = traversedMinList[vertex];
        let connectedVertices = adjacencyList[vertex];
        
        for(let i=0;i<connectedVertices.length;i++){ 
            let v2 = connectedVertices[i][0];
            let weight = connectedVertices[i][1];
            if(currWeight + weight < traversedMinList[v2]){
                traversedMinList[v2] = currWeight + weight;
                PQ.push(v2);
            }
        }
    }
    
    let max = -Infinity;
    for(let i=1;i<traversedMinList.length;i++){
        max = Math.max(max,traversedMinList[i]);
    }
    
    if(max == -Infinity || max == Infinity){
        return -1;
    } else {
        return max;
    }
    
};














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

