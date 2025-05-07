"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AdminDashboard = ({ user }) => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user, router]);

  const handleUserClick = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedUser(res.data);
    } catch (error) {
      setError("Error fetching user details");
      console.error("Error fetching user by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">User Management</h2>

      <ul>
        {users.map((u) => (
          <li
            key={u._id}
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={() => handleUserClick(u._id)}
          >
            {u.name} ({u.email}) – {u.role}
          </li>
        ))}
      </ul>

      {selectedUser && !loading && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">User Details</h3>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Role:</strong> {selectedUser.role}
          </p>
          {/* Add more user details if necessary */}
        </div>
      )}

      {loading && <p>Loading user details...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AdminDashboard;
