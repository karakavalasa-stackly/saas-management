import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers, saveUsers, getPlans } from "../utils/storage";

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "Basic",
    status: "Active",
    joinedDate: new Date().toISOString().slice(0, 10)
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setPlans(getPlans());

    if (isEdit) {
      const user = getUsers().find(
        (item) => String(item.id) === id
      );

      if (user) {
        setForm({ ...user });
      } else {
        setError("User not found.");
      }
    }
  }, [id, isEdit]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter the user's name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const users = getUsers();

    const duplicate = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() &&
        String(user.id) !== id
    );

    if (duplicate) {
      setError("This email address already exists.");
      return;
    }

    let updatedUsers;

    if (isEdit) {
      updatedUsers = users.map((user) =>
        String(user.id) === id
          ? { ...user, ...form, name: form.name.trim(), email: form.email.trim() }
          : user
      );
    } else {
      updatedUsers = [
        ...users,
        {
          ...form,
          id: Date.now(),
          name: form.name.trim(),
          email: form.email.trim()
        }
      ];
    }

    saveUsers(updatedUsers);
    navigate("/users");
  }

  return (
    <section className="panel user-form-page">
      <button
        className="secondary-btn"
        type="button"
        onClick={() => navigate("/users")}
      >
        ← Back to Users
      </button>

      <h2>{isEdit ? "Edit User" : "Add New User"}</h2>
      <p className="panel-subtitle">
        Enter the user details below.
      </p>

      <form className="user-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </label>

        <label>
          Email Address
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </label>

        <label>
          Pricing Plan
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name}
              </option>
            ))}
            {plans.length === 0 && <option>Basic</option>}
          </select>
        </label>

        <label>
          User Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <label>
          Joined Date
          <input
            type="date"
            name="joinedDate"
            value={form.joinedDate || ""}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button className="primary-btn" type="submit">
            {isEdit ? "Save Changes" : "Create User"}
          </button>

          <button
            className="secondary-btn"
            type="button"
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default UserForm;