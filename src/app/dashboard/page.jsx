"use client";
import { useAuth } from "../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { APP_BASE_URL } from "../../helpers";
import { getClients, getProjects, getUserProfile } from "../../utils/api";

const Dashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [user, router]);

  useEffect(() => {
    if (user?.token) {
      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (user?.token) {
      fetchClients();
    }
  }, [user?.token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(res.data);
    } catch (error) {}
  };

  const fetchClients = async () => {
    const token = user?.token;
    if (!token) {
      console.log("No token available");
      return;
    }

    try {
      const res = await getClients(user.token);
      setClients(res);
    } catch (error) {}
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects(user.token);
      setProjects(res);
    } catch (error) {}
  };

  const handleUserClick = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = getUserProfile(user.token);
      setSelectedUser(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-32">
      <h1 className="bg-blue-600 text-white text-3xl font-bold py-4 px-6 rounded-lg shadow mb-8">
        Dashboard
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          User Management
        </h2>

        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              className="bg-white cursor-pointer hover:bg-blue-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
              onClick={() => handleUserClick(u._id)}
            >
              <p className="font-semibold text-gray-800">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
              <p className="text-xs text-gray-400">{u.role}</p>
            </li>
          ))}
        </ul>

        {selectedUser && !loading && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              User Details
            </h3>
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
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          All Projects
        </h2>
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
            >
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
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Clients</h2>
        <ul className="space-y-3">
          {clients.map((client) => (
            <li
              key={client._id}
              className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <p>
                <strong>Name:</strong> {client.name}
              </p>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {loading && (
        <p className="mt-4 text-blue-500 font-medium">
          Loading user details...
        </p>
      )}
      {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Dashboard;
