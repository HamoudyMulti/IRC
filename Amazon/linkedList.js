// let myLinkedList = {
//   head: {
//     value: 10,
//     next: {
//       value:5,
//       next:{
//         value:16,
//         next:null
        
//       }
//     }
//   }
// }

class LinkedList{
    constructor(value){
        this.head = {
          value: value,
          next: null
        }
        this.tail = this.head;
        this.length = 1;
    }
  
    append(value){
      
      const obj = {
        value:value,
        next:null
      };
      
      this.tail.next = obj;
      this.tail = obj;
      this.length++;
      return this;
    }
  
    prepend(value){
      const obj ={
        value:value,
        next: this.head
      }
  
      this.head = obj;
      this.length++;
      return this;
    }
    
    printList(){
      let currentNode = this.head;
      let arr = [];
      while(currentNode != null) {
        arr.push(currentNode.value);
        currentNode = currentNode.next;
      }
      return arr;
    }
  
    insert(index,value){
      if(index>= this.length){
        return this.append(value);
        
      }
      let currentNode = this.head;
      let previousNode = this.head;
      while(index>0){
        previousNode = currentNode;
        currentNode = currentNode.next;
        index--;
      }
      let obj = {
        value:value,
        next:currentNode
      };
      previousNode.next = obj;
      return currentNode;
    }
  
    remove(index){
      let currentNode = this.head;
      let previousNode = this.head;
      while(index>0){
        previousNode = currentNode;
        currentNode = currentNode.next;
        index--;
      }
      
      previousNode.next = currentNode.next;
      return currentNode;
    }
  
    reverse(){
      let prev = null;
      let curr = this.head;
  
      while(current){
        let future = current.next;
        curr.next = prev;
        prev = curr;
        curr = future;
      }
  
      curr.next = prev;
      this.head=curr;
  
      return this;
    }
    
  }
  
  const myLinkedList = new LinkedList(1);
  // myLinkedList.append(5);
  myLinkedList.append(2);
  myLinkedList.append(3);
  myLinkedList.append(4);
  myLinkedList.append(5);
  myLinkedList.append(6);
  
  console.log(myLinkedList.printList());
  console.log(myLinkedList.reverse());
  console.log(myLinkedList.printList());
  