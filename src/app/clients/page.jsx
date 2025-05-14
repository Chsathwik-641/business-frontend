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
  const [serachClient, setSearchClient] = useState("");
  const [searchedClient, setSearchedClient] = useState([]);

  const { user } = useAuth();
  const token = user?.token;

  const fetchData = async (url, method = "GET", body = null) => {
    const token = user?.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };

    try {
      const response = await fetch(`${APP_BASE_URL}/api${url}`, {
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
      setSearchedClient(data);
    } catch (error) {}
  };

  const fetchProjects = async () => {
    try {
      const data = await fetchData("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if (serachClient.trim() === "") {
      setSearchedClient(clients);
      return;
    }
    const filtered = clients.filter((c) =>
      c.company.toLowerCase().includes(serachClient.toLowerCase())
    );
    setSearchedClient(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await fetchData(`/clients/${editingClient._id}`, "PUT", form);
      } else {
        await fetchData("/clients", "POST", form);
      }

      setForm({ name: "", email: "", company: "" });
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error("Error submitting client:", error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      email: client.email,
      company: client.company,
    });
  };

  const handleAssignClick = async (client) => {
    setAssigningClient(client);
    await fetchProjects();
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Delete this client?")) {
      try {
        await fetchData(`/clients/${id}`, "DELETE");
        fetchClients();
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
    <div className="p-6 max-w-3xl mx-auto mt-32">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Client Management
      </h1>

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

      <div className="flex items-center w-full mb-4 ">
        <input
          type="text"
          placeholder="Search by company"
          value={serachClient}
          onChange={(e) => {
            setSearchClient(e.target.value);
            if (e.target.value.trim() === "") {
              setSearchedClient(clients);
            }
          }}
          className="flex-1 border border-r-0 rounded-l-md p-2"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white p-2 border border-l-0 rounded-r-md"
        >
          <i className="bx bx-search text-xl"></i>
        </button>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 m-9 text-center">
        All Clients
      </h2>
      <ul>
        {searchedClient.map((client) => (
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

      {assigningClient && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border p-6 rounded shadow-lg z-50 w-full max-w-md">
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
