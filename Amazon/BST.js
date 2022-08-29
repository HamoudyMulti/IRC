class Node{
    constructor(value){
      this.left = null;
      this.right = null;
      this.value = value;
    }
  }
    
  class BinarySearchTree {
    constructor(){
      this.root = null;
    }
  
    insert(value){
      if(!this.root){
        this.root = new Node(value);
        return this;
      }
  
      let currNode = this.root;
      while(true){
        if(value <= currNode.value){
          if(!currNode.left){
            currNode.left = new Node(value);
            return this;
          } else{
            currNode = currNode.left;
          }
        } else {
          if(!currNode.right){
            currNode.right = new Node(value);
            return this;
          } else{
            currNode = currNode.right;
          }
        }
      }
      
    }
  
    lookup(value){
      let currNode = this.root;
      while(currNode){
        if(value == currNode.value){
          return currNode;
        } else if(value < currNode.value){
          currNode = currNode.left;
        } else {
          currNode = currNode.right;
        }
      }
  
      return null;
    }
  
    breadthFirstSearch(){
      let currNode = this.root;
      let list = [];
      let queue = [];
  
      queue.push(currNode);
  
      while(queue.length > 0){
        currNode = queue.shift();
        list.push(currNode.value);
        if(currNode.left){
          queue.push(currNode.left);
        }
        if(currNode.right){
          queue.push(currNode.right);
        }
      }
  [1,2,3,4,5,null,6,null,7,null,null,null,null,null,null]
      return list;
    }
  
    DFSInorder(){
      return this.DFSInorderHelper(this.root,[]);
    }
  
    DFSInorderHelper(node,list){
      let currNode = node;
      
      list.push(currNode.value);
      if(currNode.left){
        this.DFSInorderHelper(currNode.left,list);
      }
      if(currNode.right){
        this.DFSInorderHelper(currNode.right,list);
      }
      
      return list;
    }
  
  
  }
  
  function traverse(node) {
    const tree = { value: node.value };
    tree.left = node.left === null ? null : traverse(node.left);
    tree.right = node.right === null ? null : traverse(node.right);
    return tree;
  }
  
  
  const tree = new BinarySearchTree();
  tree.insert(9);
  tree.insert(4);
  tree.insert(6);
  tree.insert(20);
  tree.insert(170);
  tree.insert(15);
  tree.insert(1);
  // console.log(JSON.stringify(traverse(tree.root)));
  
  let arr = [];
  console.log(traverse(tree.root));
  
  console.log(tree.DFSInorder());
  