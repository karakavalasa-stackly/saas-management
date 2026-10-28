import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers } from "../utils/storage";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const selectedUser = getUsers().find(
      (item) => String(item.id) === id
    );

    setUser(selectedUser || null);
  }, [id]);

  if (!user) {
    return (
      <section className="panel">
        <h2>User not found</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/users")}
        >
          Back to Users
        </button>
      </section>
    );
  }

  return (
    <section className="panel user-details">
      <button
        className="secondary-btn"
        onClick={() => navigate("/users")}
      >
        ← Back to Users
      </button>

      <div className="user-profile">
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <h2>{user.name}</h2>
        <span className={`status-badge ${user.status.toLowerCase()}`}>
          {user.status}
        </span>
      </div>

      <div className="details-grid">
        <div>
          <span>User ID</span>
          <strong>{user.id}</strong>
        </div>

        <div>
          <span>Email Address</span>
          <strong>{user.email}</strong>
        </div>

        <div>
          <span>Pricing Plan</span>
          <strong>{user.plan}</strong>
        </div>

        <div>
          <span>Joined Date</span>
          <strong>{user.joinedDate || "Not available"}</strong>
        </div>
      </div>

      <button
        className="primary-btn"
        onClick={() => navigate(`/users/${user.id}/edit`)}
      >
        Edit User
      </button>
    </section>
  );
}

export default UserDetails;