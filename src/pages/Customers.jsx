
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../utils/storage";

const SUBSCRIPTION_KEY = "saasSubscriptions";

function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const users = getUsers();
    const subscriptions = JSON.parse(
      localStorage.getItem(SUBSCRIPTION_KEY) || "[]"
    );

    const customerList = users.map((user) => {
      const userSubscriptions = subscriptions.filter(
        (item) => item.email === user.email
      );

      const activeSubscription = userSubscriptions.find(
        (item) => item.status === "Active"
      );

      return {
        ...user,
        subscriptionCount: userSubscriptions.length,
        currentPlan: activeSubscription
          ? activeSubscription.plan
          : user.plan || "No active plan",
        subscriptionStatus: activeSubscription
          ? "Active"
          : userSubscriptions.some(
              (item) => item.status === "Pending"
            )
          ? "Pending"
          : userSubscriptions.length > 0
          ? "Cancelled"
          : "No Subscription",
      };
    });

    setCustomers(customerList);
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      `${customer.name} ${customer.email} ${customer.currentPlan}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      customer.subscriptionStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
   <div className="page-section customer-page">
      <div className="section-heading">
        <div>
          <h2>Customer Management</h2>
          <p>View customers and their subscription information.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <p>Total Customers</p>
          <h2>{customers.length}</h2>
        </div>

        <div className="analytics-card">
          <p>Active Customers</p>
          <h2>
            {
              customers.filter(
                (item) => item.subscriptionStatus === "Active"
              ).length
            }
          </h2>
        </div>

        <div className="analytics-card">
          <p>Customers with No Subscription</p>
          <h2>
            {
              customers.filter(
                (item) =>
                  item.subscriptionStatus === "No Subscription"
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <input
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No Subscription">No Subscription</option>
          </select>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Current Plan</th>
                <th>Subscriptions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                      <p>{customer.email}</p>
                    </td>

                    <td>{customer.currentPlan}</td>
                    <td>{customer.subscriptionCount}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          customer.subscriptionStatus
                            .toLowerCase()
                            .replaceAll(" ", "-")
                        }`}
                      >
                        {customer.subscriptionStatus}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          navigate(`/customers/${customer.id}`)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;
