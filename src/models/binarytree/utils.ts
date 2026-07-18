import type { TreeNode } from "./TreeNode";
import { Queue } from "../queue/Queue";


export function insert(root: TreeNode | null, data: number): TreeNode {
  if (!root) {
    return {
      data: data,
      left: null,
      right: null,
    };
  }

  const queue = new Queue<TreeNode | null>();
  queue.enqueue(root);

  while (!queue.isEmpty()) {
    const node = queue.dequeue()!;
    
      if (node.left == null) {
        node.left = { data: data, left: null, right: null };
        return root;
      }else{
        queue.enqueue(node.left);
      }

      if(node.right==null){
        node.right={data:data,left:null,right:null};
        return root;
      }else{
        queue.enqueue(node.right);
      }
    }

  return root;
}

export function depth(root:TreeNode | null,target:TreeNode) : number{
    if(root===null){
        return -1;
    }
    
    let d:number=-1;
    if(root==target || ((d=depth(root.left,target))>=0) || (d=depth(root.right,target))>=0){
        return d+1;
    }
    return d;
}

export function height(root:TreeNode|null, target:TreeNode):number{
    let res ={value:-1};
    heightHelper(root,target,res);
    return res.value;
}

export function countNodes(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

export function diameter(node:TreeNode | null):number{
  let dim={val:0};
  diameterHelper(node,dim);
  return dim.val;
}


//helper functions

// helper function to find the height
function heightHelper(root:TreeNode|null,target:TreeNode,height:{value:number}) : number
{
    if(root==null){
        return -1;
    }
    let lh:number = heightHelper(root.left,target,height);
    let rh:number = heightHelper(root.right,target,height);
    
    const ans = Math.max(lh,rh)+1;
    if(root===target){
        height.value=ans;
    }
    return ans;
}

//helper function to find diameter
function diameterHelper(root:TreeNode | null , diameter:{val:number}) : number{
  if(root===null){
    return 0;
  }
  let lh = diameterHelper(root.left,diameter);
  let rh = diameterHelper(root.right,diameter);
  diameter.val=Math.max(diameter.val,lh+rh);
  return 1+Math.max(rh,lh);
}
