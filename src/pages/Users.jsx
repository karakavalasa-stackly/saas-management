import React, { useEffect, useState } from "react";
import { getUsers, saveUsers } from "../utils/storage";
import { useNavigate } from "react-router-dom";
function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "Basic",
    status: "Active",
    joinedDate: new Date().toISOString().slice(0, 10)
  });
  const [error, setError] = useState("");

  const pageSize = 5;

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  function openAddForm() {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      plan: "Basic",
      status: "Active",
      joinedDate: new Date().toISOString().slice(0, 10)
    });
    setError("");
    setShowForm(true);
  }

  function openEditForm(user) {
    setEditingId(user.id);
    setForm({ ...user });
    setError("");
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a name and a valid email address.");
      return;
    }

    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() &&
        user.id !== editingId
    );

    if (duplicateEmail) {
      setError("This email is already registered.");
      return;
    }

    let updatedUsers;

    if (editingId !== null) {
      updatedUsers = users.map((user) =>
        user.id === editingId ? { ...form, name: form.name.trim(), email: form.email.trim() } : user
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

    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setShowForm(false);
    setError("");
  }

  function handleDelete(user) {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    const updatedUsers = users.filter((item) => item.id !== user.id);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.name} ${user.email} ${user.plan}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>User Management</h2>
          <p className="panel-subtitle">Create, search, edit and manage users.</p>
        </div>
       <button
            className="primary-btn"
            onClick={() => navigate("/users/new")}>
           + Add User
       </button>
      </div>

      <div className="filter-row">
        <input
          className="search-input"
          type="search"
          placeholder="Search name, email or plan..."
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={handleSubmit}>
          <h3>{editingId !== null ? "Edit User" : "Add User"}</h3>

          <label>
            Full Name
            <input name="name" value={form.name} onChange={updateField} />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} />
          </label>

          <label>
            Pricing Plan
            <select name="plan" value={form.plan} onChange={updateField}>
              <option>Basic</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={updateField}>
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="primary-btn" type="submit">
              Save User
            </button>
            <button className="secondary-btn" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.plan}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
           <div className="table-actions">
            <button
                className="secondary-btn"
                onClick={() => navigate(`/users/${user.id}`)}
             > View
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate(`/users/${user.id}/edit`)}
          >
                 Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(user)}
            >
                 Delete
            </button>
        </div>
        </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="empty-message">No users found.</p>
        )}
      </div>

      <div className="pagination">
        <span>Page {page} of {totalPages}</span>
        <div>
          <button
            className="secondary-btn"
            disabled={page === 1}
            onClick={() => setPage((previous) => previous - 1)}
          >
            Previous
          </button>
          <button
            className="secondary-btn"
            disabled={page === totalPages}
            onClick={() => setPage((previous) => previous + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default Users;