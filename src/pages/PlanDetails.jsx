
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlans, getUsers } from "../utils/storage";

function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const plan = getPlans().find(
    (item) => String(item.id) === id
  );

  if (!plan) {
    return (
      <div className="page-section">
        <h2>Plan not found</h2>
        <button onClick={() => navigate("/plans")}>
          Back to Plans
        </button>
      </div>
    );
  }

  const users = getUsers();

  const subscribers = users.filter(
    (user) => user.plan === plan.name
  );

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h2>Plan Details</h2>
          <p>View pricing and subscription information.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate(`/plans/${plan.id}/edit`)}
        >
          Edit Plan
        </button>
      </div>

      <div className="panel">
        <div className="details-grid">
          <div>
            <span>Plan Name</span>
            <h3>{plan.name}</h3>
          </div>

          <div>
            <span>Price</span>
            <h3>
              ₹{Number(plan.price).toLocaleString("en-IN")}
            </h3>
          </div>

          <div>
            <span>Billing Cycle</span>
            <h3>{plan.billing}</h3>
          </div>

          <div>
            <span>Status</span>
            <h3>{plan.status}</h3>
          </div>

          <div>
            <span>Total Subscribers</span>
            <h3>{subscribers.length}</h3>
          </div>

          <div>
            <span>Estimated Monthly Revenue</span>
            <h3>
              ₹
              {(
                plan.billing === "Monthly"
                  ? Number(plan.price) * subscribers.length
                  : 0
              ).toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="form-group">
          <span>Description</span>
          <p>{plan.description}</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("/plans")}
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
}

export default PlanDetails;
