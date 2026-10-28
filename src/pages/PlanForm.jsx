
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlans, savePlans, getUsers, saveUsers } from "../utils/storage";

function PlanForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    price: "",
    billing: "Monthly",
    description: "",
    status: "Active",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    const plan = getPlans().find(
      (item) => String(item.id) === id
    );

    if (plan) {
      setForm({
        ...plan,
        price: String(plan.price),
      });
    } else {
      setError("Plan not found.");
    }
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);
    const description = form.description.trim();

    if (!name || !form.price || !description) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    const plans = getPlans();

    const duplicate = plans.some(
      (plan) =>
        plan.name.toLowerCase() === name.toLowerCase() &&
        String(plan.id) !== id
    );

    if (duplicate) {
      setError("A plan with this name already exists.");
      return;
    }

    const planData = {
      name,
      price,
      billing: form.billing,
      description,
      status: form.status,
    };

    let updatedPlans;

    if (isEditing) {
      const oldPlan = plans.find(
        (plan) => String(plan.id) === id
      );

      if (!oldPlan) {
        setError("Plan not found.");
        return;
      }

      updatedPlans = plans.map((plan) =>
        String(plan.id) === id
          ? { ...plan, ...planData }
          : plan
      );

      // Update users if the plan name changes.
      if (oldPlan.name !== name) {
        const users = getUsers();

        const updatedUsers = users.map((user) =>
          user.plan === oldPlan.name
            ? { ...user, plan: name }
            : user
        );

        saveUsers(updatedUsers);
      }
    } else {
      updatedPlans = [
        ...plans,
        { ...planData, id: Date.now() },
      ];
    }

    savePlans(updatedPlans);
    navigate("/plans");
  }

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h2>{isEditing ? "Edit Plan" : "Add New Plan"}</h2>
          <p>
            {isEditing
              ? "Update your pricing plan details."
              : "Create a new pricing plan for your customers."}
          </p>
        </div>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Plan Name *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Example: Premium"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹) *</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Example: 1499"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="billing">Billing Cycle</label>
          <select
            id="billing"
            name="billing"
            value={form.billing}
            onChange={handleChange}
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the features of this plan"
            rows="4"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/plans")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            {isEditing ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlanForm;
