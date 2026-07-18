// pages/AVLTree.tsx
import { useState } from "react";
import type { TreeNode } from "../models/binarytree/TreeNode";
import { insert, deleteNode } from "../models/avltree/avltree";
import AVLTreeVisualizer from "../components/visualizer/avltree/AVLTreeVisualizer";
import "./css/BinaryTree.css";

const NODE_COLORS = [
  { value: "#8B1A3A", label: "Burgundy" },
  { value: "#185FA5", label: "Blue" },
  { value: "#0F6E56", label: "Teal" },
  { value: "#633806", label: "Amber" },
  { value: "#444441", label: "Slate" },
] as const;

export default function AVL() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [value, setValue] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [nodeColor, setNodeColor] = useState<string>(NODE_COLORS[0].value);
  const [error, setError] = useState<string | null>(null);

  const handleInsert = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const vals = trimmed
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v));
    let newRoot = root;
    for (const num of vals) {
      newRoot = insert(newRoot, num);
    }
    setRoot(newRoot ? { ...newRoot } : null);
    setValue("");
    setError(null);
  };

  const handleDelete = () => {
    const trimmed = deleteValue.trim();
    if (!trimmed) return;
    const num = Number(trimmed);
    if (isNaN(num)) return;

    if (!nodeExists(root, num)) {
      setError(`${num} not found in tree`);
      setDeleteValue("");
      return;
    }

    const newRoot = deleteNode(root, num);
    setRoot(newRoot ? { ...newRoot } : null);
    setDeleteValue("");
    setError(null);
  };

  const handleInsertKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleInsert();
  };

  const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleDelete();
  };

  const handleClear = () => {
    setRoot(null);
    setValue("");
    setDeleteValue("");
    setError(null);
  };

  return (
    <div className="bt-page">
      <div className="bt-header">
        <h1 className="bt-title">AVL Tree</h1>
        <p className="bt-subtitle">
          Insert comma-separated integers to build a self-balancing tree.
          Rotations happen automatically on every insert and delete.
        </p>
      </div>

      <div className="bt-controls">
        <input
          className="bt-input"
          type="text"
          placeholder="e.g. 50, 30, 70, 20, 40"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleInsertKeyDown}
        />
        <button className="bt-btn bt-btn-primary" onClick={handleInsert}>
          Insert
        </button>

        <input
          className="bt-input"
          type="text"
          placeholder="value to delete"
          value={deleteValue}
          onChange={(e) => setDeleteValue(e.target.value)}
          onKeyDown={handleDeleteKeyDown}
        />
        <button className="bt-btn bt-btn-danger" onClick={handleDelete}>
          Delete
        </button>

        <button className="bt-btn bt-btn-ghost" onClick={handleClear}>
          Clear
        </button>

        <div className="bt-color-picker">
          <span className="bt-color-label">Node</span>
          {NODE_COLORS.map((c) => (
            <button
              key={c.value}
              className={`bt-swatch${nodeColor === c.value ? " selected" : ""}`}
              style={{ background: c.value }}
              onClick={() => setNodeColor(c.value)}
              title={c.label}
              aria-label={`Set node color to ${c.label}`}
            />
          ))}
        </div>
      </div>

      {error && <p className="bt-error">{error}</p>}

      <div className="bt-canvas">
        <AVLTreeVisualizer root={root} nodeColor={nodeColor} />
      </div>
    </div>
  );
}

// small local helper — not exported from the model since it's UI-only
// (existence check before attempting a delete, so we can show a friendly error)
function nodeExists(root: TreeNode | null, data: number): boolean {
  if (!root) return false;
  if (root.data === data) return true;
  return data < root.data
    ? nodeExists(root.left, data)
    : nodeExists(root.right, data);
}