"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { APP_BASE_URL } from "../../helpers";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [assigningClient, setAssigningClient] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const { user } = useAuth();
  const token = user?.token;

  console.log("came here User Token:", user?.token);

  // Helper function to fetch data with Authorization
  const fetchData = async (url, method = "GET", body = null) => {
    const token = user?.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };

    try {
      const response = await fetch(`${APP_BASE_URL}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    const token = user?.token;

    if (!token) {
      console.log("No token available");
      return;
    }

    try {
      const response = await fetch(`${APP_BASE_URL}/api/clients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      setClients(data);
    } catch (error) {}
  };

  // Fetch projects for assignment
  const fetchProjects = async () => {
    try {
      const data = await fetchData("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Form change handler
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler for adding/editing a client
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        // Edit client
        await fetchData(`/clients/${editingClient._id}`, "PUT", form);
      } else {
        // Add new client
        await fetchData("/clients", "POST", form);
      }

      setForm({ name: "", email: "", company: "" });
      setEditingClient(null);
      fetchClients(); // Re-fetch the clients after submit
    } catch (error) {
      console.error("Error submitting client:", error);
    }
  };

  // Edit handler
  const handleEdit = (client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      email: client.email,
      company: client.company,
    });
  };

  // Assign client to project handler
  const handleAssignClick = async (client) => {
    setAssigningClient(client);
    await fetchProjects();
  };

  // Handle assignment
  const handleAssign = async () => {
    try {
      await fetchData(`/projects/${selectedProject}`, "POST", {
        client: assigningClient._id,
      });
      setAssigningClient(null);
      setSelectedProject("");
      alert("Client assigned!");
    } catch (error) {
      console.error("Error assigning client:", error);
    }
  };

  // Delete client handler
  const handleDelete = async (id) => {
    if (window.confirm("Delete this client?")) {
      try {
        await fetchData(`/clients/${id}`, "DELETE");
        fetchClients(); // Re-fetch clients after deletion
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchClients();
    }
  }, [token]);
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border p-4 mb-6 rounded"
      >
        <h2 className="text-lg font-semibold mb-2">
          {editingClient ? "Edit Client" : "Add Client"}
        </h2>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleFormChange}
          required
          className="block w-full border p-2 mb-2"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleFormChange}
          required
          className="block w-full border p-2 mb-2"
        />
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleFormChange}
          required
          className="block w-full border p-2 mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingClient ? "Update" : "Add"}
        </button>
      </form>

      {/* List of Clients */}
      <h2 className="text-xl font-semibold mb-2">All Clients</h2>
      <ul>
        {clients.map((client) => (
          <li
            key={client._id}
            className="border p-3 mb-2 rounded flex justify-between"
          >
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-500">{client.company}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(client)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleAssignClick(client)}
                className="text-green-600"
              >
                Assign
              </button>
              <button
                onClick={() => handleDelete(client._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Assignment Section */}
      {assigningClient && (
        <div className="mt-6 bg-gray-100 border p-4 rounded">
          <h3 className="text-lg font-medium mb-2">
            Assign {assigningClient.name} to a Project
          </h3>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
          <div className="flex gap-4">
            <button
              onClick={handleAssign}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Assign
            </button>
            <button
              onClick={() => setAssigningClient(null)}
              className="text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
