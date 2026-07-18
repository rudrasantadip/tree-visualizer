import { useState, useRef, useCallback, useId } from "react";
import type { TreeNode } from "../../../models/binarytree/TreeNode";
import {
  depth as getDepth,
  height as getHeight,
  countNodes,
  diameter,
} from "../../../models/binarytree/utils";
import {
  computeBalanceFactor,
  isBalanced,
  treeBias,
} from "../../../models/binarysearchtree/binarysearchtree";
import "../binarytree/TreeVisualizer.css";

interface TreeVisualizerProps {
  root: TreeNode | null;
  nodeColor?: string;
}

interface HoveredInfo {
  value: number;
  depth: number;
  height: number;
  bFactor: number;
}

// ─── Color utilities ──────────────────────────────────────────────────────────

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

//  Gradients

function NodeGradients({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <radialGradient
        id={`nodeGrad-${id}`}
        cx="35%"
        cy="30%"
        r="65%"
        fx="35%"
        fy="30%"
      >
        <stop offset="0%" stopColor={lighten(color, 0.5)} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
      <radialGradient
        id={`nodeGradHover-${id}`}
        cx="35%"
        cy="30%"
        r="65%"
        fx="35%"
        fy="30%"
      >
        <stop offset="0%" stopColor={lighten(color, 0.65)} />
        <stop offset="100%" stopColor={lighten(color, 0.15)} />
      </radialGradient>
      <radialGradient id={`shimmer-${id}`} cx="30%" cy="25%" r="40%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
    </defs>
  );
}

// ─── Node element

function TreeNodeEl({
  node,
  x,
  y,
  gap,
  gradId,
  color,
  onHover,
  onLeave,
  balancedFactors,
}: {
  node: TreeNode;
  x: number;
  y: number;
  gap: number;
  gradId: string;
  color: string;
  onHover: (node: TreeNode) => void;
  onLeave: () => void;
  balancedFactors: Map<TreeNode, number>;
}) {
  const [hovered, setHovered] = useState(false);
  const R = 28;
  const nextGap = gap / 2;
  const label = String(node.data);
  const fontSize = label.length > 3 ? 11 : label.length > 2 ? 13 : 15;
  const displayLabel = label.length > 5 ? label.slice(0, 4) + "…" : label;
  const bf = balancedFactors.get(node) ?? 0;
  const isUnbalanced = Math.abs(bf) > 1;

  const handleEnter = () => {
    setHovered(true);
    onHover(node);
  };
  const handleLeave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <g>
      {node.left && (
        <line
          x1={x}
          y1={y}
          x2={x - gap}
          y2={y + 90}
          stroke="#D8D8D4"
          strokeWidth={1.5}
        />
      )}
      {node.right && (
        <line
          x1={x}
          y1={y}
          x2={x + gap}
          y2={y + 90}
          stroke="#D8D8D4"
          strokeWidth={1.5}
        />
      )}
      {node.left && (
        <TreeNodeEl
          node={node.left}
          x={x - gap}
          y={y + 90}
          gap={nextGap}
          gradId={gradId}
          color={color}
          onHover={onHover}
          onLeave={onLeave}
          balancedFactors={balancedFactors}
        />
      )}
      {node.right && (
        <TreeNodeEl
          node={node.right}
          x={x + gap}
          y={y + 90}
          gap={nextGap}
          gradId={gradId}
          color={color}
          onHover={onHover}
          onLeave={onLeave}
          balancedFactors={balancedFactors}
        />
      )}
      <ellipse
        cx={x}
        cy={y + R + 5}
        rx={R * 0.75}
        ry={5}
        fill="rgba(0,0,0,0.07)"
      />
      <circle
        cx={x}
        cy={y}
        r={hovered ? R + 3 : R}
        fill={
          isUnbalanced
            ? "#dc2626"
            : hovered
              ? `url(#nodeGradHover-${gradId})`
              : `url(#nodeGrad-${gradId})`
        }
        stroke={isUnbalanced ? "#991b1b" : color}
        strokeWidth={1.5}
        style={{ transition: "r 120ms cubic-bezier(.34,1.56,.64,1)" }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      />
      <circle
        cx={x - R * 0.25}
        cy={y - R * 0.28}
        r={R * 0.42}
        fill={`url(#shimmer-${gradId})`}
        pointerEvents="none"
      />
      fill=
      {isUnbalanced
        ? "#dc2626"
        : hovered
          ? `url(#nodeGradHover-${gradId})`
          : `url(#nodeGrad-${gradId})`}
      stroke={isUnbalanced ? "#991b1b" : color}
      <text
        x={x}
        y={y + fontSize * 0.38}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill="#fff"
        pointerEvents="none"
        fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
        letterSpacing="-0.5"
      >
        {displayLabel}
      </text>
    </g>
  );
}

export default function BinarySearchTreeVisualizer({
  root,
  nodeColor = "#8B1A3A",
}: TreeVisualizerProps) {
  const [hovered, setHovered] = useState<HoveredInfo | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  const totalHeight = getHeight(root, root!);
  const totalNodes = countNodes(root);
  const dim = diameter(root);
  const balanced = isBalanced(root);
  const balancedFactors = computeBalanceFactor(root);
  const svgW = Math.max(900, Math.pow(2, totalHeight) * 72);
  const svgH = Math.max(200, totalHeight * 100 + 60);

  const handleHover = useCallback(
    (node: TreeNode) => {
      if (!root) return;
      setHovered({
        value: node.data,
        depth: getDepth(root, node),
        height: getHeight(root, node),
        bFactor: balancedFactors.get(node) ?? 0,
      });
    },
    [root],
  );

  const handleLeave = useCallback(() => setHovered(null), []);

  if (!root) {
    return (
      <div className="tv-empty">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M12 3v4M8 7H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4M16 7h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4M8 11v2a4 4 0 0 0 8 0v-2M6 17h2M16 17h2M12 17v4" />
        </svg>
        <p>Insert values to visualize the tree</p>
      </div>
    );
  }

  return (
    <div className="tv-wrap" ref={wrapRef}>
      {/* Stats badge — top right */}
      <div className="tv-stats">
        {hovered ? (
          // Per-node info when hovering
          <>
            <div className="tv-stat">
              <span className="tv-stat-val">{hovered.value}</span>
              <span className="tv-stat-label">Value</span>
            </div>
            <div className="tv-stat-divider" />
            <div className="tv-stat">
              <span className="tv-stat-val">{hovered.height}</span>
              <span className="tv-stat-label">Height</span>
            </div>
            <div className="tv-stat-divider" />
            <div className="tv-stat">
              <span className="tv-stat-val">{hovered.depth}</span>
              <span className="tv-stat-label">Depth</span>
            </div>
            <div className="tv-stat-divider" />
            <div className="tv-stat">
              <span className="tv-stat-val">{hovered.bFactor}</span>
              <span className="tv-stat-label">Balanced Factor</span>
            </div>
          </>
        ) : (
          // Tree-wide summary by default
          <>
            <div className="tv-stat">
              <span className="tv-stat-val">{totalHeight}</span>
              <span className="tv-stat-label">Height</span>
            </div>
            <div className="tv-stat-divider" />
            <div className="tv-stat">
              <span className="tv-stat-val">{totalHeight - 1}</span>
              <span className="tv-stat-label">Max Depth</span>
            </div>
            <div className="tv-stat-divider" />
            <div className="tv-stat">
              <span className="tv-stat-val">{totalNodes}</span>
              <span className="tv-stat-label">Nodes</span>
            </div>
            <div className="tv-stat-divider" />
            <div className="tv-stat">
              <span className="tv-stat-val">{dim}</span>
              <span className="tv-stat-label">Diameter</span>
            </div>
            <div className="tv-stat-divider" />
            <div className="tv-stat">
              <span className="tv-stat-val">{balanced ? "Yes" : "No"}</span>
              <span className="tv-stat-label">Balanced</span>
            </div>
            <div className="tv-stat-divider" />
          </>
        )}
      </div>

      {/* bias portion for showing the warning sign */}
      {(() => {
        const bias = treeBias(root);
        if (bias === "balanced") return null;
        return (
          <div
            className={`tv-bias-badge tv-bias-badge--${bias}`}
            title={
              bias === "left"
                ? "Left-heavy: left subtree is taller"
                : "Right-heavy: right subtree is taller"
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {bias === "left" ? "Left-heavy <-" : "Right-heavy ->"}
          </div>
        );
      })()}

      <div className="tv-scroll">
        <svg
          width={svgW}
          height={svgH}
          style={{ display: "block" }}
          aria-label="Binary tree visualization"
        >
          <NodeGradients id={uid} color={nodeColor} />
          <TreeNodeEl
            node={root}
            x={svgW / 2}
            y={50}
            gap={svgW / 4}
            gradId={uid}
            color={nodeColor}
            onHover={handleHover}
            onLeave={handleLeave}
            balancedFactors={balancedFactors}
          />
        </svg>
      </div>
    </div>
  );
}
