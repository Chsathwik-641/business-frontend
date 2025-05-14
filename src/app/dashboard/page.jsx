"use client";
import { useAuth } from "../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { APP_BASE_URL } from "../../helpers";
import { getClients, getProjects, getUserProfile } from "../../utils/api";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [teamMem, setTeamMem] = useState([]);
  const [manager, setManager] = useState([]);
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending");
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const overdueInvoices = invoices.filter(
    (inv) => new Date(inv.dueDate) < new Date() && inv.status !== "paid"
  );

  const inProgressProjects = projects.filter(
    (p) => p.status?.toLowerCase() === "in-progress"
  );
  const completedProjects = projects.filter(
    (p) => p.status?.toLowerCase() === "completed"
  );
  const notStartedProjects = projects.filter(
    (p) => p.status?.toLowerCase() === "not-started"
  );

  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user, router]);

  useEffect(() => {
    if (user?.token) fetchProjects();
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) fetchClients();
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) fetchInvoices();
  }, [user?.token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setUsers(res.data);

      const teamOnly = res.data.filter((user) => user.role === "team-member");

      setTeamMem(teamOnly);

      const managerOnly = res.data.filter((user) => user.role === "manager");
      setManager(managerOnly);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await getClients(user.token);
      setClients(res);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects(user.token);
      console.log("came to project:", res);
      setProjects(res);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/api/invoices`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setInvoices(res.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-32">
      <h1 className="bg-blue-600 text-white text-3xl font-bold py-4 px-6 rounded-lg shadow mb-8 text-center">
        Dashboard
      </h1>

      <section className="mb-10 pb-5 border-b border-gray-400">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Company Overview
        </h1>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-xs sm:text-sm">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-blue-600">
              {projects.length}
            </h3>
            <p className="text-gray-500">Projects</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {clients.length}
            </h3>
            <p className="text-gray-500">Clients</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-purple-600">
              {users.length}
            </h3>
            <p className="text-gray-500">Total Employees</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-yellow-600">
              {invoices.length}
            </h3>
            <p className="text-gray-500">Invoices</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-yellow-600">
              {teamMem.length}
            </h3>
            <p className="text-gray-500">Team Members</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-yellow-600">
              {manager.length}
            </h3>
            <p className="text-gray-500">Managers</p>
          </div>
        </div>
      </section>

      <section className="mb-10 pb-5 border-b border-gray-400">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Projects Overview
        </h1>

        <div className="grid grid-cols-3 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-yellow-600">
              {notStartedProjects.length}
            </h3>
            <p className="text-gray-500">Not Started</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-blue-600">
              {inProgressProjects.length}
            </h3>
            <p className="text-gray-500">In Progress</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-green-600">
              {completedProjects.length}
            </h3>
            <p className="text-gray-500">Completed</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 my-10 text-center">
            Recent projects
          </h2>
          {projects.length > 0 ? (
            <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.slice(-3).map((project) => (
                <li
                  key={project._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
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
                  <p>
                    <strong>Manager: </strong>
                    {project.manager.name}
                  </p>
                  <p>
                    <strong>Manager:</strong> {project.manager.email}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(project.startDate).toDateString()}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(project.endDate).toDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 mt-6">
              <h2>No Projects are created</h2>
            </div>
          )}
        </div>
      </section>

      <section className="mb-10 pb-5 border-b border-gray-400">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Invoice OverView
        </h1>
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-yellow-600">
              {pendingInvoices.length}
            </h3>
            <p className="text-gray-500">Pending Invoices</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-green-600">
              {paidInvoices.length}
            </h3>
            <p className="text-gray-500">Paid Invoices</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-red-600">
              {overdueInvoices.length}
            </h3>
            <p className="text-gray-500">Overdue Invoices</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 my-10 text-center">
            Latest Invoices
          </h2>
          {invoices.length > 0 ? (
            <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
              {invoices.slice(-3).map((invoice) => (
                <li
                  key={invoice._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <p>
                    <strong>Project:</strong> {invoice.project.title}
                  </p>
                  <p>
                    <strong>Client:</strong> {invoice.clientInfo.name}
                  </p>
                  <p>
                    <strong>Client Email:</strong> {invoice.clientInfo.email}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${invoice.amount}
                  </p>
                  <p>
                    <strong>Status:</strong> {invoice.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(invoice.dueDate).toDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Paid:{" "}
                    {invoice.paidDate
                      ? new Date(invoice.paidDate).toDateString()
                      : "Not Paid"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 mt-6">
              <h2>No invoices created</h2>
            </div>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Clients
        </h2>
        <ul className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
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
    </div>
  );
};

export default Dashboard;
