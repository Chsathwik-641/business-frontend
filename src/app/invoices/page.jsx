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
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    if (token) {
      fetchAllInvoices();
      fetchProjects();
    }
  }, [token]);

  const fetchAllInvoices = async () => {
    try {
      const data = await getInvoices(token);
      console.log("Invoices fetched:", data);
      setInvoices(data);
    } catch (error) {
      console.error("Error loading invoices:", error.message);
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
    const newStatus = currentStatus === "paid" ? "pending" : "paid";
    try {
      await updateInvoiceStatus(id, newStatus, token);
      fetchAllInvoices();
    } catch (err) {
      console.error("Error updating invoice:", err.message);
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
      fetchAllInvoices();
      setNewInvoice({ projectId: "", amount: 0, dueDate: "" });
    } catch (err) {
      console.error("Error creating invoice:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id, token);
      fetchAllInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <form
        onSubmit={handleCreateInvoice}
        className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto"
      >
        <div>
          <label
            htmlFor="project"
            className="block text-sm font-medium text-gray-700"
          >
            Project
          </label>
          <select
            id="project"
            value={newInvoice.projectId}
            onChange={(e) =>
              setNewInvoice({ ...newInvoice, projectId: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a Project</option>
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
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={newInvoice.amount}
            onChange={(e) =>
              setNewInvoice({ ...newInvoice, amount: e.target.value })
            }
            placeholder="Amount"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={newInvoice.dueDate}
            onChange={(e) =>
              setNewInvoice({ ...newInvoice, dueDate: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Invoice
        </button>
      </form>

      <div className="grid gap-4">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">{invoice.title}</h2>
                <p>Amount: ${invoice.amount}</p>
                <p>Status: {invoice.status}</p>
                <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                {invoice.paidDate && (
                  <p>Paid: {new Date(invoice.paidDate).toLocaleDateString()}</p>
                )}
              </div>
              <div className="mt-2 sm:mt-0 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDownload(invoice._id)}
                >
                  Download
                </button>
                <button
                  className={`${
                    invoice.status === "paid" ? "bg-yellow-500" : "bg-green-500"
                  } text-white px-4 py-2 rounded`}
                  onClick={() =>
                    handleStatusToggle(invoice._id, invoice.status)
                  }
                >
                  Mark as {invoice.status === "paid" ? "Pending" : "Paid"}
                </button>
                <button
                  onClick={() => handleDelete(invoice._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No invoices found.</p>
        )}
      </div>
    </div>
  );
}
