
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import UserForm from "./pages/UserForm.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import Plans from "./pages/Plans.jsx";
import PlanForm from "./pages/PlanForm.jsx";
import PlanDetails from "./pages/PlanDetails.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import SubscriptionForm from "./pages/SubscriptionForm.jsx";
import Analytics from "./pages/Analytics.jsx";
import Customers from "./pages/Customers.jsx";
import CustomerDetails from "./pages/CustomerDetails.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users/:id/edit" element={<UserForm />}/>
          <Route path="plans" element={<Plans />} />
          <Route path="plans/new" element={<PlanForm />} />
          <Route path="plans/:id" element={<PlanDetails />} />
          <Route path="plans/:id/edit" element={<PlanForm />}/>
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="subscriptions/new" element={<SubscriptionForm />}/>
          <Route path="subscriptions/:id/edit" element={<SubscriptionForm />}/>
          <Route path="analytics" element={<Analytics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


