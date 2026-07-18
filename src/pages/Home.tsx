// pages/Home.tsx
import { Link } from "react-router-dom";
import "./css/Home.css";

function Glyph({
  id,
  color,
  nodes,
  edges,
  delay,
}: {
  id: string;
  color: string;
  nodes: { cx: number; cy: number; r: number; fill?: string; label?: string }[];
  edges: [number, number][];
  delay: number;
}) {
  return (
    <svg
      className="glyph"
      viewBox="0 0 120 90"
      style={{ ["--glyph-delay" as string]: `${delay}ms` }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`glyphGrad-${id}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          className="glyph-edge"
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke={color}
          strokeWidth={1.5}
          style={{ ["--edge-delay" as string]: `${delay + i * 90}ms` }}
        />
      ))}
      {nodes.map((n, i) => (
        <g
          key={i}
          className="glyph-node"
          style={{ ["--node-delay" as string]: `${delay + 120 + i * 90}ms` }}
        >
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.fill ?? color} />
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={`url(#glyphGrad-${id})`} />
        </g>
      ))}
    </svg>
  );
}

const BinaryTreeGlyph = () => (
  <Glyph
    id="bt"
    color="#8B1A3A"
    delay={0}
    nodes={[
      { cx: 60, cy: 18, r: 9 },
      { cx: 30, cy: 50, r: 8 },
      { cx: 90, cy: 50, r: 8 },
      { cx: 15, cy: 78, r: 6.5 },
      { cx: 75, cy: 78, r: 6.5 },
    ]}
    edges={[
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
    ]}
  />
);

const BSTGlyph = () => (
  <Glyph
    id="bst"
    color="#185FA5"
    delay={80}
    nodes={[
      { cx: 60, cy: 18, r: 10 },
      { cx: 28, cy: 50, r: 8 },
      { cx: 92, cy: 50, r: 8 },
      { cx: 44, cy: 78, r: 6.5 },
    ]}
    edges={[
      [0, 1],
      [0, 2],
      [1, 3],
    ]}
  />
);

const AVLGlyph = () => (
  <Glyph
    id="avl"
    color="#0F6E56"
    delay={160}
    nodes={[
      { cx: 60, cy: 22, r: 9.5 },
      { cx: 32, cy: 55, r: 8 },
      { cx: 88, cy: 55, r: 8 },
      { cx: 32, cy: 82, r: 6 },
      { cx: 88, cy: 82, r: 6 },
    ]}
    edges={[
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
    ]}
  />
);

const RedBlackGlyph = () => (
  <Glyph
    id="rb"
    color="#C1272D"
    delay={240}
    nodes={[
      { cx: 60, cy: 18, r: 9, fill: "#1C1B19" },
      { cx: 30, cy: 50, r: 8, fill: "#C1272D" },
      { cx: 90, cy: 50, r: 8, fill: "#C1272D" },
      { cx: 90, cy: 80, r: 6.5, fill: "#1C1B19" },
    ]}
    edges={[
      [0, 1],
      [0, 2],
      [2, 3],
    ]}
  />
);

// ─── Data ──────────────────────────────────────────────────────────────────

interface TreeItem {
  title: string;
  path: string;
  description: string;
  accent: string;
  glyph: React.ComponentType;
}

const TREE_ITEMS: TreeItem[] = [
  {
    title: "Binary Tree",
    path: "/binarytree",
    description: "No ordering rules. Insert anywhere, shape freely.",
    accent: "#8B1A3A",
    glyph: BinaryTreeGlyph,
  },
  {
    title: "BST",
    path: "/bst",
    description: "Ordered by value — left is smaller, right is bigger.",
    accent: "#185FA5",
    glyph: BSTGlyph,
  },
  {
    title: "AVL Tree",
    path: "/avl",
    description: "Rotates on every insert and delete to stay balanced.",
    accent: "#0F6E56",
    glyph: AVLGlyph,
  },
  {
    title: "Red-Black Tree",
    path: "/",
    description: "Balance enforced by color rules, not strict height checks.",
    accent: "#C1272D",
    glyph: RedBlackGlyph,
  },
];

interface CategoryItem {
  title: string;
  path: string;
  description: string;
}

const MORE_CATEGORIES: CategoryItem[] = [
  {
    title: "Linked Lists",
    path: "/linked-lists",
    description: "Singly, doubly, and circular — pointer by pointer.",
  },
  {
    title: "Graphs",
    path: "/graphs",
    description: "Traversals, weights, and paths across nodes and edges.",
  },
  {
    title: "Algorithms",
    path: "/algorithms",
    description: "Sorting and searching, stepped through visually.",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <span className="home-eyebrow">Data Structures Lab</span>
        <h1 className="home-title">
          See how it's <span className="home-title-accent">built</span>,
          <br />
          node by node.
        </h1>
        <p className="home-subtitle">
          Interactive visualizers for trees, lists, and graphs — insert,
          delete, and watch the structure hold itself together.
        </p>
      </div>

      <section className="home-section">
        <div className="home-section-head">
          <h2 className="home-section-title">Trees</h2>
          <span className="home-section-line" />
        </div>
        <div className="home-grid">
          {TREE_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="home-card"
              style={{ ["--card-accent" as string]: item.accent }}
            >
              <item.glyph />
              <div className="home-card-body">
                <h3 className="home-card-title">{item.title}</h3>
                <p className="home-card-desc">{item.description}</p>
              </div>
              <span className="home-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2 className="home-section-title">More structures</h2>
          <span className="home-section-line" />
        </div>
        <div className="home-grid home-grid--compact">
          {MORE_CATEGORIES.map((item) => (
            <Link key={item.path} to={item.path} className="home-card home-card--compact">
              <div className="home-card-body">
                <h3 className="home-card-title">{item.title}</h3>
                <p className="home-card-desc">{item.description}</p>
              </div>
              <span className="home-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}