"use client";
import { useEffect, useState } from "react";
import {
  getInvoices,
  updateInvoiceStatus,
  downloadInvoice,
  createInvoice,
  getProjects,
  deleteInvoice,
} from "../../utils/api";
import { useAuth } from "@/context/AuthContext";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    projectId: "",
    amount: 0,
    dueDate: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateId, setUpdateId] = useState(null);

  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    if (token) {
      fetchAllInvoices();
      fetchProjects();
    }
  }, [token]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const fetchAllInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices(token);
      console.log("Invoices fetched:", data);
      setInvoices(data);
    } catch (error) {
      console.error("Error loading invoices:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects(token);
      console.log("Projects fetched:", data);
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error.message);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "paid" : "";
    try {
      setUpdateId(id);
      await updateInvoiceStatus(id, newStatus, token);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id
            ? {
                ...inv,
                status: newStatus,
                paidDate:
                  newStatus === "paid" ? new Date().toISOString() : null,
              }
            : inv
        )
      );
    } catch (err) {
      console.error("Error updating invoice:", err.message);
    } finally {
      setUpdateId(null);
    }
  };

  const handleDownload = async (id) => {
    try {
      await downloadInvoice(id, token);
    } catch (err) {
      console.error("Download failed:", err.message);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await createInvoice(newInvoice, token);
      setMessage(" Invoice created successfully.");
      setError("");
      setNewInvoice({ projectId: "", amount: 0, dueDate: "" });
      fetchAllInvoices();
    } catch (err) {
      setError(err.message || "Failed to create invoice");
      setMessage("");
      setNewInvoice({ projectId: "", amount: 0, dueDate: "" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id, token);
      setMessage("Invoice deleted successfully.");
      setError("");
      fetchAllInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error.message);
      setError("Failed to delete invoice.");
      setMessage("");
    }
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-8 mt-32">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreateInvoice}
        className="mb-10 space-y-6 bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create New Invoice
        </h2>

        <div>
          <label
            htmlFor="project"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Project
          </label>
          <select
            id="project"
            value={newInvoice.projectId}
            onChange={(e) =>
              setNewInvoice({ ...newInvoice, projectId: e.target.value })
            }
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">-- Choose a Project --</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            value={newInvoice.amount}
            onChange={(e) =>
              setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })
            }
            placeholder="Enter amount"
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            min={today}
            type="date"
            value={newInvoice.dueDate}
            onChange={(e) =>
              setNewInvoice({ ...newInvoice, dueDate: e.target.value })
            }
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Invoice
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spi"></div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Invioces List
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 sm:px-16 lg:px-32 py-8">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 flex flex-col justify-between h-full transition hover:shadow-xl"
                >
                  <div className="text-gray-800 space-y-1 text-sm sm:text-base mb-4">
                    <p>
                      <span className="font-semibold">Client: </span>{" "}
                      {invoice.clientInfo.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email: </span>{" "}
                      {invoice.clientInfo.email}
                    </p>
                    <p>
                      <span className="font-semibold">Project: </span>{" "}
                      {invoice.project.title}
                    </p>
                    <p>
                      <span className="font-semibold">Amount: </span> $
                      {invoice.amount}
                    </p>
                    <p>
                      <span className="font-semibold">Status: </span>
                      <span
                        className={`ml-1 font-medium ${
                          invoice.status === "paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Due:</span>{" "}
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                    {invoice.paidDate && (
                      <p>
                        <span className="font-semibold">Paid:</span>{" "}
                        {new Date(invoice.paidDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                      onClick={() => handleDownload(invoice._id)}
                    >
                      Download
                    </button>

                    {invoice.status === "pending" && (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                        onClick={() => {
                          const confirmUpdate = window.confirm(
                            "Are you sure you want to mark this invoice as PAID?\nThis action cannot be undone."
                          );
                          if (confirmUpdate) {
                            handleStatusToggle(invoice._id, "pending");
                          }
                        }}
                      >
                        Mark as Paid
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const confirm = window.confirm(
                          "Are you sure you want to delete this invoice?"
                        );
                        if (confirm) {
                          handleDelete(invoice._id);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center text-lg mt-10">
                No invoices found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
