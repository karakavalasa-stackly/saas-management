
import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { getPlans, savePlans } from "../utils/storage";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Plans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [deletePlan, setDeletePlan] = useState(null);

  const closeToast = useCallback(() => {
    setToast({ message: "", type: "success" });
  }, []);

  useEffect(() => {
    setPlans(getPlans());
  }, []);

  function handleDelete(plan) {
    setDeletePlan(plan);
  }

  function confirmDelete() {
    if (!deletePlan) return;

    const updatedPlans = plans.filter(
      (item) => item.id !== deletePlan.id
    );

    savePlans(updatedPlans);
    setPlans(updatedPlans);

    setToast({
      message: `${deletePlan.name} plan deleted successfully!`,
      type: "success",
    });

    setDeletePlan(null);
  }

  const filteredPlans = plans.filter((plan) =>
    `${plan.name} ${plan.description} ${plan.billing} ${plan.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h2>Pricing Plans</h2>
          <p>Manage your subscription pricing plans.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/plans/new")}
        >
          + Add Plan
        </button>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <input
            type="search"
            placeholder="Search plans..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Billing</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <strong>{plan.name}</strong>
                      <p>{plan.description}</p>
                    </td>

                    <td>
                      ₹{Number(plan.price).toLocaleString("en-IN")}
                    </td>

                    <td>{plan.billing}</td>

                    <td>
                      <span
                        className={`status-badge ${plan.status.toLowerCase()}`}
                      >
                        {plan.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            navigate(`/plans/${plan.id}`)
                          }
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/plans/${plan.id}/edit`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(plan)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    {search
                      ? "No plans match your search."
                      : "No plans available. Add your first plan."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <ConfirmDialog
        open={Boolean(deletePlan)}
        title="Delete Pricing Plan?"
        message={
          deletePlan
            ? `Are you sure you want to delete the "${deletePlan.name}" plan?`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeletePlan(null)}
      />
    </div>
  );
}

export default Plans;

