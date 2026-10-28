const USERS_KEY = "saasUsers";
const PLANS_KEY = "saasPlans";

const defaultUsers = [
  {
    id: 1,
    name: "Ananya Sharma",
    email: "ananya@example.com",
    plan: "Pro",
    status: "Active",
    joinedDate: "2026-10-01"
  },
  {
    id: 2,
    name: "Rahul Kumar",
    email: "rahul@example.com",
    plan: "Basic",
    status: "Active",
    joinedDate: "2026-10-02"
  },
  {
    id: 3,
    name: "Priya Reddy",
    email: "priya@example.com",
    plan: "Enterprise",
    status: "Pending",
    joinedDate: "2026-10-03"
  },
  {
    id: 4,
    name: "Arjun Mehta",
    email: "arjun@example.com",
    plan: "Pro",
    status: "Inactive",
    joinedDate: "2026-10-04"
  },
  {
    id: 5,
    name: "Sneha Patel",
    email: "sneha@example.com",
    plan: "Basic",
    status: "Active",
    joinedDate: "2026-10-05"
  }
];

const defaultPlans = [
  {
    id: 1,
    name: "Basic",
    price: 499,
    billing: "Monthly",
    description: "Essential features for individuals.",
    status: "Active"
  },
  {
    id: 2,
    name: "Pro",
    price: 999,
    billing: "Monthly",
    description: "Advanced tools for growing teams.",
    status: "Active"
  },
  {
    id: 3,
    name: "Enterprise",
    price: 2499,
    billing: "Monthly",
    description: "Complete tools for large businesses.",
    status: "Active"
  }
];

export const getUsers = () => {
  const saved = localStorage.getItem(USERS_KEY);
  return saved ? JSON.parse(saved) : defaultUsers;
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event("saasUsersUpdated"));
};

export const getPlans = () => {
  const saved = localStorage.getItem(PLANS_KEY);
  return saved ? JSON.parse(saved) : defaultPlans;
};

export const savePlans = (plans) => {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  window.dispatchEvent(new Event("saasPlansUpdated"));
};