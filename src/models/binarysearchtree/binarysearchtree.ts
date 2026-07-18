import type { TreeNode } from "../binarytree/TreeNode";
import { height } from "../binarytree/utils";

export function insert(root: TreeNode | null, data: number): TreeNode {
  if (!root) {
    return {
      data: data,
      left: null,
      right: null,
    };
  }
  //move to the right subtree
  if (root.data < data) {
    root.right = insert(root.right, data);
  }
  //move to the left subtree
  else if (root.data >= data) {
    root.left = insert(root.left, data);
  }
  return root;
}

export function isBalanced(root: TreeNode | null): boolean {
  return checkBalance(root) != -1;
}

function checkBalance(root: TreeNode | null): number {
  if (root == null) {
    return 0;
  }
  let lh = checkBalance(root.left);
  if (lh === -1) {
    return -1;
  }
  let rh = checkBalance(root.right);
  if (rh === -1) {
    return -1;
  }

  if (Math.abs(lh - rh) > 1) {
    return -1;
  }
  return 1 + Math.max(lh, rh);
}

export function treeBias(root: TreeNode | null): string {
  if (!root) {
    return "balanced";
  }
  let lh = root.left ? height(root, root.left) : 0;
  let rh = root.right ? height(root, root.right) : 0;

  if (lh - rh > 0) {
    return "left";
  } else if (rh - lh > 0) {
    return "right";
  }
  return "balanced";
}

export function balanceFactor(root: TreeNode | null): number {
  if (!root) {
    return 0;
  }
  let lh = root.left ? height(root, root.left) : 0;
  let rh = root.right ? height(root, root.right) : 0;

  return lh - rh;
}

export function computeBalanceFactor(
  root: TreeNode | null,
): Map<TreeNode, number> {
  const factors = new Map<TreeNode, number>();
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;

    const lh = dfs(node.left);
    const rh = dfs(node.right);

    factors.set(node, lh - rh);

    return 1 + Math.max(lh, rh);
  }
  dfs(root);
  return factors;
}
