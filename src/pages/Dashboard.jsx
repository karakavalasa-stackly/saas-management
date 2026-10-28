import React, { useEffect, useState } from "react";
import { getUsers, getPlans } from "../utils/storage";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const loadData = () => {
      setUsers(getUsers());
      setPlans(getPlans());
    };

    loadData();

    window.addEventListener("saasUsersUpdated", loadData);
    window.addEventListener("saasPlansUpdated", loadData);

    return () => {
      window.removeEventListener("saasUsersUpdated", loadData);
      window.removeEventListener("saasPlansUpdated", loadData);
    };
  }, []);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const stats = [
    { title: "Total Users", value: users.length, icon: "👥" },
    { title: "Active Users", value: activeUsers, icon: "✅" },
    {
      title: "Monthly Revenue",
      value: "₹" + users
        .filter((user) => user.status === "Active")
        .reduce((total, user) => {
          const plan = plans.find((item) => item.name === user.plan);
          return total + (plan ? Number(plan.price) : 0);
        }, 0).toLocaleString("en-IN"),
      icon: "💰"
    },
    { title: "Total Plans", value: plans.length, icon: "📦" }
  ];

  const planStats = plans.map((plan) => ({
    ...plan,
    subscribers: users.filter(
      (user) => user.plan === plan.name && user.status === "Active"
    ).length
  }));

  const maxSubscribers = Math.max(
    1,
    ...planStats.map((plan) => plan.subscribers)
  );

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Monitor users, plans and estimated monthly revenue.</p>
        </div>
        <span className="date-label">SaaS Analytics</span>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.title}>
            <div className="stat-top">
              <span>{item.title}</span>
              <span className="stat-icon">{item.icon}</span>
            </div>
            <h2>{item.value}</h2>
            <p className="stat-caption">Current overview</p>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        <section className="panel">
          <h3>Subscription Analytics</h3>
          <p className="panel-subtitle">Active users by pricing plan</p>

          {planStats.map((plan) => (
            <div className="subscription-item" key={plan.id}>
              <div className="subscription-info">
                <span>{plan.name}</span>
                <strong>{plan.subscribers} users</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(plan.subscribers / maxSubscribers) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}

          {plans.length === 0 && <p>No plans available.</p>}
        </section>

        <section className="panel">
          <h3>Revenue Overview</h3>
          <p className="panel-subtitle">Estimated monthly revenue</p>

          <div className="revenue-bars">
            {planStats.map((plan) => (
              <div className="revenue-column" key={plan.id}>
                <div
                  className="revenue-bar"
                  style={{
                    height: `${Math.max(
                      8,
                      (plan.subscribers / maxSubscribers) * 100
                    )}%`
                  }}
                />
                <span>{plan.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <h3>Recent Users</h3>
        <p className="panel-subtitle">Registered customers</p>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.plan}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="empty-message">No users available.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;