// models/avltree/avltree.ts
import type { TreeNode } from "../binarytree/TreeNode";
import { height } from "../binarytree/utils";

// ─── Internal helpers ──────────────────────────────────────────────────────

// Local subtree height (node itself, no root needed — cheap enough for
// visualizer-scale trees). Empty subtree = 0.
function nodeHeight(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right));
}

function getBalance(node: TreeNode | null): number {
  if (!node) return 0;
  return nodeHeight(node.left) - nodeHeight(node.right);
}

function rotateRight(y: TreeNode): TreeNode {
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  return x;
}

function rotateLeft(x: TreeNode): TreeNode {
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  return y;
}

function rebalance(node: TreeNode): TreeNode {
  const balance = getBalance(node);

  // Left heavy
  if (balance > 1) {
    if (getBalance(node.left) < 0) {
      // LR case
      node.left = rotateLeft(node.left!);
    }
    // LL case
    return rotateRight(node);
  }

  // Right heavy
  if (balance < -1) {
    if (getBalance(node.right) > 0) {
      // RL case
      node.right = rotateRight(node.right!);
    }
    // RR case
    return rotateLeft(node);
  }

  return node;
}

// ─── Public API ────────────────────────────────────────────────────────────

export function insert(root: TreeNode | null, data: number): TreeNode {
  if (!root) {
    return {
      data: data,
      left: null,
      right: null,
    };
  }

  // move to the right subtree
  if (root.data < data) {
    root.right = insert(root.right, data);
  }
  // move to the left subtree
  else if (root.data >= data) {
    root.left = insert(root.left, data);
  }

  return rebalance(root);
}

export function deleteNode(root: TreeNode | null, data: number): TreeNode | null {
  if (!root) return null;

  if (data < root.data) {
    root.left = deleteNode(root.left, data);
  } else if (data > root.data) {
    root.right = deleteNode(root.right, data);
  } else {
    // found the node to delete
    if (!root.left || !root.right) {
      root = root.left ?? root.right;
    } else {
      // two children: replace with in-order successor (min of right subtree)
      let succ = root.right;
      while (succ.left) {
        succ = succ.left;
      }
      root.data = succ.data;
      root.right = deleteNode(root.right, succ.data);
    }
  }

  if (!root) return null;

  return rebalance(root);
}

export function isBalanced(root: TreeNode | null): boolean {
  return checkBalance(root) !== -1;
}

function checkBalance(root: TreeNode | null): number {
  if (root == null) {
    return 0;
  }
  const lh = checkBalance(root.left);
  if (lh === -1) return -1;

  const rh = checkBalance(root.right);
  if (rh === -1) return -1;

  if (Math.abs(lh - rh) > 1) return -1;

  return 1 + Math.max(lh, rh);
}

export function treeBias(root: TreeNode | null): string {
  if (!root) {
    return "balanced";
  }
  const lh = root.left ? height(root, root.left) : 0;
  const rh = root.right ? height(root, root.right) : 0;

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
  const lh = root.left ? height(root, root.left) : 0;
  const rh = root.right ? height(root, root.right) : 0;

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