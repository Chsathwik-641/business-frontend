// src/components/Dashboard/ManagerDashboard.jsx
import React from "react";

const ManagerDashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome Manager {user.name}!</h1>
      <p>Here are your team tasks and performance metrics.</p>
      {/* Additional Manager functionality can go here */}
    </div>
  );
};

export default ManagerDashboard;
