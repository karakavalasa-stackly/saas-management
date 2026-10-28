
import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">
        SaaS<span>Pro</span>
      </h2>

      <p className="menu-title">MAIN MENU</p>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/users" className="nav-item">
          <span className="nav-icon">👥</span>
          <span>Users</span>
        </NavLink>

        <NavLink to="/plans" className="nav-item">
          <span className="nav-icon">💳</span>
          <span>Pricing Plans</span>
        </NavLink>

        <NavLink to="/subscriptions" className="nav-item">
          <span className="nav-icon">📋</span>
          <span>Subscriptions</span>
        </NavLink>
        <NavLink to="/analytics" className="nav-item">
            <span className="nav-icon">📈</span>
           <span>Analytics</span>
       </NavLink>
       <NavLink to="/customers" className="nav-item">
            <span className="nav-icon">👤</span>
             <span>Customers</span>
       </NavLink>
      </nav>


      <div className="sidebar-footer">⚙️ Settings</div>
    </aside>
  );
}

export default Sidebar;
