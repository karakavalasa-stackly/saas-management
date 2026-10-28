
import React, { useEffect, useState } from "react";

const SUBSCRIPTION_KEY = "saasSubscriptions";

function Analytics() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const savedSubscriptions = JSON.parse(
      localStorage.getItem(SUBSCRIPTION_KEY) || "[]"
    );
    const savedPlans = JSON.parse(
      localStorage.getItem("saasPlans") || "null"
    );

    setSubscriptions(savedSubscriptions);
    setPlans(
      savedPlans || [
        { id: 1, name: "Basic", price: 499, billing: "Monthly" },
        { id: 2, name: "Pro", price: 999, billing: "Monthly" },
        { id: 3, name: "Enterprise", price: 2499, billing: "Monthly" },
      ]
    );
  }, []);

  const activeSubscriptions = subscriptions.filter(
    (item) => item.status === "Active"
  );

  const pendingSubscriptions = subscriptions.filter(
    (item) => item.status === "Pending"
  );

  const cancelledSubscriptions = subscriptions.filter(
    (item) => item.status === "Cancelled"
  );

  const estimatedMonthlyRevenue = activeSubscriptions.reduce(
    (total, subscription) => {
      const plan = plans.find(
        (item) => item.name === subscription.plan
      );

      if (!plan) return total;

      const monthlyPrice =
        plan.billing === "Yearly"
          ? Number(plan.price) / 12
          : plan.billing === "Weekly"
          ? Number(plan.price) * 52 / 12
          : Number(plan.price);

      return total + monthlyPrice;
    },
    0
  );

  const maxCount = Math.max(
    1,
    ...plans.map(
      (plan) =>
        activeSubscriptions.filter(
          (item) => item.plan === plan.name
        ).length
    )
  );

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h2>Usage & Revenue Analytics</h2>
          <p>Monitor subscriptions and estimated revenue.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <p>Total Subscriptions</p>
          <h2>{subscriptions.length}</h2>
        </div>

        <div className="analytics-card">
          <p>Active Subscriptions</p>
          <h2>{activeSubscriptions.length}</h2>
        </div>

        <div className="analytics-card">
          <p>Pending Subscriptions</p>
          <h2>{pendingSubscriptions.length}</h2>
        </div>

        <div className="analytics-card">
          <p>Cancelled Subscriptions</p>
          <h2>{cancelledSubscriptions.length}</h2>
        </div>

        <div className="analytics-card revenue-card">
          <p>Estimated Monthly Revenue</p>
          <h2>
            ₹
            {estimatedMonthlyRevenue.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>
      </div>

      <div className="panel analytics-panel">
        <h3>Active Subscriptions by Plan</h3>

        {plans.map((plan) => {
          const count = activeSubscriptions.filter(
            (item) => item.plan === plan.name
          ).length;

          return (
            <div className="chart-row" key={plan.id}>
              <div className="chart-label">
                <span>{plan.name}</span>
                <strong>{count}</strong>
              </div>

              <div className="chart-track">
                <div
                  className="chart-bar"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {subscriptions.length === 0 && (
          <p>No subscription data available yet.</p>
        )}
      </div>
    </div>
  );
}

export default Analytics;
