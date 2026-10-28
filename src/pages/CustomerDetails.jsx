
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers, getPlans } from "../utils/storage";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = getUsers().find(
    (user) => String(user.id) === id
  );

  const subscriptions = JSON.parse(
    localStorage.getItem("saasSubscriptions") || "[]"
  );

  const plans = getPlans();

  if (!customer) {
    return (
      <div className="page-section">
        <h2>Customer not found</h2>
        <button
          className="secondary-btn"
          onClick={() => navigate("/customers")}
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const customerSubscriptions = subscriptions.filter(
    (item) => item.email === customer.email
  );

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h2>Customer Details</h2>
          <p>View customer profile and subscription history.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("/customers")}
        >
          Back to Customers
        </button>
      </div>

      <div className="panel customer-details-panel">
        <div className="customer-profile">
          <div className="customer-avatar">
            {customer.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{customer.name}</h3>
            <p>{customer.email}</p>
            <span className="status-badge active">
              Customer
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div>
            <span>Customer ID</span>
            <h3>{customer.id}</h3>
          </div>

          <div>
            <span>Current User Plan</span>
            <h3>{customer.plan || "No plan assigned"}</h3>
          </div>

          <div>
            <span>Total Subscriptions</span>
            <h3>{customerSubscriptions.length}</h3>
          </div>

          <div>
            <span>Active Subscriptions</span>
            <h3>
              {
                customerSubscriptions.filter(
                  (item) => item.status === "Active"
                ).length
              }
            </h3>
          </div>
        </div>
      </div>

      <div className="panel customer-history-panel">
        <h3>Subscription History</h3>

        {customerSubscriptions.length > 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Renewal Date</th>
                </tr>
              </thead>

              <tbody>
                {customerSubscriptions.map((subscription) => {
                  const plan = plans.find(
                    (item) => item.name === subscription.plan
                  );

                  return (
                    <tr key={subscription.id}>
                      <td>{subscription.plan}</td>
                      <td>
                        {plan
                          ? `₹${Number(plan.price).toLocaleString("en-IN")}`
                          : "Plan unavailable"}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${subscription.status.toLowerCase()}`}
                        >
                          {subscription.status}
                        </span>
                      </td>
                      <td>{subscription.startDate}</td>
                      <td>{subscription.renewalDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No subscription history available for this customer.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;
