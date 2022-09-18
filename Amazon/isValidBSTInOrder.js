/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
 let prev = null;
 var isValidBST = function(root) {
     prev=null;
     let bool =  isValidBSTHelper(root);
     return bool;
 };
 
 const isValidBSTHelper = (node) => {
     if(node.left){
         if(!isValidBSTHelper(node.left)){
             return false;
         }
     }
     
     if(prev!=null && prev>=node.val){
         return false;
     }
     
     prev = node.val;
     
     
     if(node.right){
         if(!isValidBSTHelper(node.right)){
             return false;
         }
     }
     
     return true;
 }