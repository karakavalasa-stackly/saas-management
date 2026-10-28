
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, getPlans } from "../utils/storage";

const STORAGE_KEY = "saasSubscriptions";

const defaultSubscriptions = [
  {
    id: 1,
    customer: "Ananya Sharma",
    email: "ananya@example.com",
    plan: "Pro",
    status: "Active",
    startDate: "2026-10-01",
    renewalDate: "2026-11-01",
  },
  {
    id: 2,
    customer: "Rahul Kumar",
    email: "rahul@example.com",
    plan: "Basic",
    status: "Pending",
    startDate: "2026-10-02",
    renewalDate: "2026-11-02",
  },
  {
    id: 3,
    customer: "Priya Reddy",
    email: "priya@example.com",
    plan: "Enterprise",
    status: "Cancelled",
    startDate: "2026-09-01",
    renewalDate: "2026-10-01",
  },
];

function getSubscriptions() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) return JSON.parse(saved);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSubscriptions));
  return defaultSubscriptions;
}

function saveSubscriptions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function Subscriptions() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setSubscriptions(getSubscriptions());
  }, []);

  function updateStatus(subscription) {
    const nextStatus =
      subscription.status === "Active" ? "Cancelled" : "Active";

    const updated = subscriptions.map((item) =>
      item.id === subscription.id
        ? { ...item, status: nextStatus }
        : item
    );

    setSubscriptions(updated);
    saveSubscriptions(updated);
  }

  const filteredSubscriptions = subscriptions.filter((item) => {
    const matchesSearch =
      `${item.customer} ${item.email} ${item.plan}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubscriptions.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h2>Subscription Management</h2>
          <p>Manage customer subscriptions and renewal dates.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/subscriptions/new")}
        >
          + Add Subscription
        </button>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <input
            type="search"
            placeholder="Search customer or plan..."
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => handleStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Renewal Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedSubscriptions.length > 0 ? (
                paginatedSubscriptions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.customer}</strong>
                      <p>{item.email}</p>
                    </td>

                    <td>{item.plan}</td>

                    <td>
                      <span
                        className={`status-badge ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>{item.startDate}</td>
                    <td>{item.renewalDate}</td>

                    
                  <td>
                   <div className="action-buttons">
                 <button
                  onClick={() =>
                      navigate(`/subscriptions/${item.id}/edit`)
                   }
                   >
                             Edit
                  </button>

                <button onClick={() => updateStatus(item)}>
                {item.status === "Active" ? "Cancel" : "Activate"}
             </button>
            </div>
           </td>
 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No subscriptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;
