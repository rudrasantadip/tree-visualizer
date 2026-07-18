import { useState } from "react";
import type { TreeNode } from "../models/binarytree/TreeNode";
import { insert } from "../models/binarytree/utils";
import TreeVisualizer from "../components/visualizer/binarytree/TreeVisualizer";
import "./css/BinaryTree.css";

const NODE_COLORS = [
  { value: "#8B1A3A", label: "Burgundy" },
  { value: "#185FA5", label: "Blue" },
  { value: "#0F6E56", label: "Teal" },
  { value: "#633806", label: "Amber" },
  { value: "#444441", label: "Slate" },
] as const;

export default function BinaryTree() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [value, setValue] = useState("");
  const [nodeColor, setNodeColor] = useState<string>(NODE_COLORS[0].value);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleInsert();
  };

  const handleClear = () => {
    setRoot(null);
    setValue("");
  };

  return (
    <div className="bt-page">
      <div className="bt-header">
        <h1 className="bt-title">Binary Tree</h1>
        <p className="bt-subtitle">Insert comma-separated integers to build and explore the tree.</p>
      </div>

      <div className="bt-controls">
        <input
          className="bt-input"
          type="text"
          placeholder="e.g. 50, 30, 70, 20, 40"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="bt-btn bt-btn-primary" onClick={handleInsert}>
          Insert
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

      <div className="bt-canvas">
        <TreeVisualizer root={root} nodeColor={nodeColor} />
      </div>
    </div>
  );
}