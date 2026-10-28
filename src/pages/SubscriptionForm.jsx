
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlans, getUsers } from "../utils/storage";

const STORAGE_KEY = "saasSubscriptions";

function SubscriptionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer: "",
    email: "",
    plan: "",
    status: "Active",
    startDate: new Date().toISOString().slice(0, 10),
    renewalDate: "",
  });

  useEffect(() => {
    setUsers(getUsers());
    setPlans(getPlans());

    if (isEditing) {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const subscription = saved.find(
        (item) => String(item.id) === id
      );

      if (subscription) {
        setForm({
          customer: subscription.customer,
          email: subscription.email,
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          renewalDate: subscription.renewalDate,
        });
      } else {
        setError("Subscription not found.");
      }
    }
  }, [id, isEditing]);

  function handleCustomerChange(event) {
    const email = event.target.value;
    const user = users.find((item) => item.email === email);

    setForm((previous) => ({
      ...previous,
      customer: user ? user.name : "",
      email: user ? user.email : "",
    }));
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.customer ||
      !form.plan ||
      !form.startDate ||
      !form.renewalDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.renewalDate < form.startDate) {
      setError("Renewal date cannot be before the start date.");
      return;
    }

    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const subscriptionData = { ...form };

    let updated;

    if (isEditing) {
      const exists = saved.some(
        (item) => String(item.id) === id
      );

      if (!exists) {
        setError("Subscription not found.");
        return;
      }

      updated = saved.map((item) =>
        String(item.id) === id
          ? { ...item, ...subscriptionData }
          : item
      );
    } else {
      updated = [
        ...saved,
        { ...subscriptionData, id: Date.now() },
      ];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    navigate("/subscriptions");
  }

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h2>
            {isEditing ? "Edit Subscription" : "Add Subscription"}
          </h2>
          <p>Enter customer and subscription details.</p>
        </div>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Customer *</label>
          <select
            value={form.email}
            onChange={handleCustomerChange}
            required
          >
            <option value="">Select customer</option>
            {users.map((user) => (
              <option key={user.id} value={user.email}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Pricing Plan *</label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            required
          >
            <option value="">Select plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name} - ₹{plan.price}/{plan.billing}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Renewal Date *</label>
          <input
            type="date"
            name="renewalDate"
            value={form.renewalDate}
            min={form.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/subscriptions")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            {isEditing ? "Update Subscription" : "Create Subscription"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubscriptionForm;
