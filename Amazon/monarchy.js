class Person{
    constructor(name){
      this._name = name;
      this._alive = true;
    }
  
    getName(){
      return this._name;
    }
  
    isAlive(){
      return this._alive;
    }
  
    kill(){
      this._alive = false;
    }
    
  }
  
  class Monarchy{
    constructor(name){
      let person = new Person(name);
      this._people = new Map();
      this._people.set(name,person);
      this._relationship = new Map();
      this._relationship.set(name,[]);
      this._king = name;
    }
  
    birth(child,name){
      this._checkNameExists(name);
      let newBorn = new Person(child);
      this._people.set(child,newBorn);
      this._relationship.set(child,[]);
      this._relationship.get(name).push(child);
      
    }
  
    death(name){
      this._checkNameExists(name);
      this._people.get(name).kill();
    }
    
  
  
    getOrderOfSuccession(){
      let list = [];
      this._DFS(this._king,list);
      return list;
    }
  
    _DFS(name,list){
      let person = this._people.get(name);
  
      if(person.isAlive()){
        list.push(person.getName());
      }
  
      let descendants = this._relationship.get(name);
      for(let i=0;i<descendants.length;i++){
        this._DFS(descendants[i],list);
      }
  
      return list;
    }
  
  
  
   
  
    _checkNameExists(name){
      if(!this._people.has(name)){
        throw new Error("Name does not exist");
      }
    }
  
    getRelationship(){
      return this._relationship;
    }
  
    getPeople(){
      return this._people;
    }
  
    getKing(){
      return this._king;
    }
  
   
    
  }
  
  
  let tree = new Monarchy("Jake");
  console.log(tree.birth("Catherine","Jake"));
  console.log(tree.birth("Tom","Jake"));
  console.log(tree.birth("Celine","Jake"));
  console.log(tree.birth("Jane","Catherine"));
  console.log(tree.birth("Mark","Catherine"));
  console.log(tree.birth("Farah","Jane"));
  console.log(tree.birth("Peter","Celine"));
  console.log(tree.death("Jake"))
  console.log(tree.death("Catherine"))
  console.log(tree.death("Jane"))
  
  console.log(tree.death("Farah"))
  console.log(tree.death("Celine"))
  console.log(tree.getRelationship())
  console.log(tree.getPeople())
  console.log(tree.getKing())
  console.log(tree.getOrderOfSuccession())
  