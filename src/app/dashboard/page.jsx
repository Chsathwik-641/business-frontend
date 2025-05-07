"use client";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./AdminDashboard/page";
import ManagerDashboard from "./ManagerDashboard/page";
import EmployeeDashboard from "./EmployeeDashboard/page";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard user={user} />;

    case "manager":
      return <ManagerDashboard user={user} />;

    case "team-member":
      return <EmployeeDashboard user={user} />;

    default:
      return <div>Unauthorized role.</div>;
  }
};

export default Dashboard;
