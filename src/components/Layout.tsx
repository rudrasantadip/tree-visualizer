import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/SideBar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}