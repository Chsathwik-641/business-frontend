// src/components/Dashboard/EmployeeDashboard.jsx
import React from "react";

const EmployeeDashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome Employee {user.name}!</h1>
      <p>Check your assigned tasks and upcoming schedule.</p>
      {/* Additional Employee functionality can go here */}
    </div>
  );
};

export default EmployeeDashboard;
