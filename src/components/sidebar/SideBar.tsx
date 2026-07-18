import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  ChevronRight,
  Binary,
  Network,
  GitBranch,
  GitFork,
  GitMerge,
  ArrowRight,
  ArrowLeftRight,
  Share2,
  Route,
  SortDesc,
  Search,
} from "lucide-react";
import "./Sidebar.css";

const SECTIONS = {
  trees: true,
  linkedLists: false,
  graphs: false,
  algorithms: false,
} as const;

type SectionKey = keyof typeof SECTIONS;

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>(SECTIONS);

  const toggle = (key: SectionKey) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const close = () => setMobileOpen(false);

  const link = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={close} />
      )}

      <aside className={`sidebar${mobileOpen ? " mobile-open" : ""}`}>
        <div className="logo">
          <span className="logo-dot" />
          DSALAB
        </div>

        <nav className="nav">
          <NavLink to="/" className={link} onClick={close}>
            <Home size={15} />
            Home
          </NavLink>

          <Section
            label="Trees"
            open={expanded.trees}
            onToggle={() => toggle("trees")}
          >
            <NavLink to="/binarytree" className={link} onClick={close}>
              <Binary size={15} />
              Binary Tree
            </NavLink>
            <NavLink to="/bst" className={link} onClick={close}>
              <Network size={15} />
              BST
            </NavLink>
            <NavLink to="/avl" className={link} onClick={close}>
              <GitFork size={15} />
              AVL Tree
            </NavLink>
            <NavLink to="/redblack" className={link} onClick={close}>
              <GitMerge size={15} />
              Red-Black Tree
            </NavLink>
          </Section>

          <Section
            label="Linked Lists"
            open={expanded.linkedLists}
            onToggle={() => toggle("linkedLists")}
          >
            <NavLink to="/singly-linked-list" className={link} onClick={close}>
              <ArrowRight size={15} />
              Singly
            </NavLink>
            <NavLink to="/doubly-linked-list" className={link} onClick={close}>
              <ArrowLeftRight size={15} />
              Doubly
            </NavLink>
          </Section>

          <Section
            label="Graphs"
            open={expanded.graphs}
            onToggle={() => toggle("graphs")}
          >
            <NavLink to="/graph" className={link} onClick={close}>
              <Share2 size={15} />
              Graph
            </NavLink>
            <NavLink to="/dfs" className={link} onClick={close}>
              <Route size={15} />
              DFS
            </NavLink>
            <NavLink to="/bfs" className={link} onClick={close}>
              <GitBranch size={15} />
              BFS
            </NavLink>
          </Section>

          <Section
            label="Algorithms"
            open={expanded.algorithms}
            onToggle={() => toggle("algorithms")}
          >
            <NavLink to="/sorting" className={link} onClick={close}>
              <SortDesc size={15} />
              Sorting
            </NavLink>
            <NavLink to="/searching" className={link} onClick={close}>
              <Search size={15} />
              Searching
            </NavLink>
          </Section>
        </nav>
      </aside>
    </>
  );
}

function Section({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="nav-section">
      <button
        className={`section-btn${open ? " open" : ""}`}
        onClick={onToggle}
      >
        <span>{label}</span>
        <ChevronRight size={13} className="chev" />
      </button>
      <div className={`section-items${open ? " open" : ""}`}>
        {children}
      </div>
    </div>
  );
}