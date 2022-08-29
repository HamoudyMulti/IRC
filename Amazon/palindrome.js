var isPalindrome = function(s) {
    s= s.replace(/[^A-Za-z0-9]/g,'').toLowerCase();
    console.log(s);
    let p1=0;
    let p2=s.length-1;
  
    let middle = Math.floor(s.length/2);
    if(s.length%2 == 0){
      middle--;
    }
  
    let deletedCharactersCount = 1;
    while(p1<=middle){
      if(s[p1]!=s[p2]){
        if(deletedCharactersCount >= 1){
          deletedCharactersCount--;
        } else{
          return false;
        }
      }
      p1++;
      p2--;
    }
    return true;
    
  };
  
  
  let s = "race a car"
  
  console.log(isPalindrome(s));