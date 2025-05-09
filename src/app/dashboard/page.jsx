"use client";
import { useAuth } from "../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { APP_BASE_URL } from "../layout";

const Dashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const [clients, setClients] = useState([]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [user, router]);

  // Fetch projects
  useEffect(() => {
    if (user?.token) {
      fetchProjects();
    }
  }, [user]);

  // Fetch clients when token changes
  useEffect(() => {
    if (user?.token) {
      fetchClients();
    }
  }, [user?.token]);

  // Fetch users function
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(res.data);
    } catch (error) {}
  };

  // Fetch clients function
  const fetchClients = async () => {
    const token = user?.token;
    if (!token) {
      console.log("No token available");
      return;
    }

    try {
      const response = await axios.get(`${APP_BASE_URL}/clients`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    } catch (error) {}
  };

  // Fetch projects function
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjects(res.data);
    } catch (error) {}
  };

  // Handle user click to view details
  const handleUserClick = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${APP_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedUser(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="bg-blue-600 text-white text-3xl font-bold py-4 px-6 rounded-t-lg shadow-lg mb-6">
        Dashboard
      </h1>

      <h2 className="text-xl font-semibold mb-2">User Management</h2>

      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u._id}
            className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-in-out p-2 rounded-lg shadow-md hover:shadow-lg"
            onClick={() => handleUserClick(u._id)}
          >
            <p className="font-semibold">{u.name} </p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-xs text-gray-400">{u.role}</p>
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
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6">All Projects</h2>
      <ul className="space-y-2 mt-2">
        {projects.map((project) => (
          <li key={project._id} className="border p-3 rounded shadow">
            <p>
              <strong>Title:</strong> {project.title}
            </p>
            <p>
              <strong>Description:</strong> {project.description}
            </p>
            <p>
              <strong>Status:</strong> {project.status}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Clients</h2>
      <ul className="space-y-2 mt-2">
        {clients.map((client) => (
          <li key={client._id} className="border p-3 rounded shadow">
            <p>
              <strong>Name:</strong> {client.name}
            </p>
            <p>
              <strong>Email:</strong> {client.email}
            </p>
          </li>
        ))}
      </ul>

      {loading && <p>Loading user details...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Dashboard;
