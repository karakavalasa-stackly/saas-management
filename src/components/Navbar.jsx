import React from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const titles = {
    "/": "Dashboard",
    "/users": "User Management",
    "/plans": "Pricing Plans",
    "/subscriptions": "Subscriptions Management"
  };

  return (
    <header className="navbar">
      <div>
        <h2>{titles[location.pathname] || "Dashboard"}</h2>
        <p>Manage your SaaS business in one place.</p>
      </div>

      <div className="navbar-profile">
        <span>🔔</span>
        <div className="avatar">AD</div>
        <div>
          <strong>Admin User</strong>
          <small>Administrator</small>
        </div>
      </div>
    </header>
  );
}

export default Navbar;