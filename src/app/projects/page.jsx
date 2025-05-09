"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { getProjects, createProject, getUsers } from "../../utils/api";
import axios from "axios";
import { APP_BASE_URL } from "../layout";

export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [assign, setAssing] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "not-started",
    startDate: "",
    endDate: "",
    manager: "",
  });
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState({
    projectId: "",
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
  });
  const [openTask, setOpenTask] = useState(false);

  useEffect(() => {
    if (user?.token) {
      getProjects(user.token)
        .then((data) => {
          console.log("Fetched projects:", data);
          setProjects(data);
        })
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.token && user.role === "admin") {
      getUsers(user.token)
        .then((data) => setUsers(data))
        .catch(console.error);
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const newProject = await createProject(form, user.token);
      setProjects((prev) => [...prev, newProject]);
      setForm({
        title: "",
        description: "",
        status: "not-started",
        startDate: "",
        endDate: "",
        manager: "",
      });
      setError("");
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };
  const handleChange = (e) => {
    setTasks({ ...tasks, [e.target.name]: e.target.value });
  };
  const handleNavigate = (id) => {
    router.push(`/projects/${id}`);
  };
  const openForm = (projectId) => {
    const project = projects.find((p) => p._id === projectId);

    setSelectedProject(project);
    setAssing(true);
  };

  function openTaskForm(id) {
    const project = projects.find((p) => p._id === id);
    setSelectedProject(project);
    setOpenTask(true);
  }
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${APP_BASE_URL}/api/team`,
        {
          projectId: selectedProject._id,
          userId: selectedUserId,
          roleInProject: selectedRole,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      await axios.post(
        `${APP_BASE_URL}/api/projects/${selectedProject._id}`,
        { hasTeam: true, status: "in-progress" },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      getProjects(user.token);
      console.log("Assignment success:", res.data);
      setAssing(false);
      setSelectedProject("");
    } catch (err) {}
  };
  const handleTask = async (e) => {
    e.preventDefault();
    tasks.projectId = selectedProject._id;
    console.log("came at the tasks", tasks);
    try {
      await axios.post(
        `${APP_BASE_URL}/api/tasks`,
        tasks,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
        setOpenTask(false),
        setTasks({
          projectId: "",
          title: "",
          description: "",
          status: "todo",
          dueDate: "",
        }),
        setSelectedProject("")
      );
    } catch (error) {}
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${APP_BASE_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("project deleted");
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch {}
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {user?.role === "admin" && (
        <form
          onSubmit={handleCreate}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              rows="4"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              min={today}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              min={form.startDate || today}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="manager"
              className="block text-sm font-medium text-gray-700"
            >
              Project Manager
            </label>
            <select
              id="manager"
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Manager</option>
              {users
                .filter((user) => user.role === "manager")
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create
          </button>
        </form>
      )}

      <ul className="space-y-2 mt-8 max-w-3xl mx-auto">
        {projects.map((project) => (
          <li
            key={project._id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
          >
            <Link href={`/projects/${project._id}`}>
              <p className="font-bold text-lg text-indigo-700 hover:underline">
                {project.title}
              </p>
            </Link>
            <div className="text-sm text-gray-600">
              <p>Status: {project.status}</p>
              <p>Client: {project.client?.name || "N/A"}</p>
              <p>Manager: {project.manager?.name || "N/A"}</p>
              <p>Start: {project.startDate?.slice(0, 10)}</p>
              <p>End: {project.endDate?.slice(0, 10)}</p>
              <p>
                <strong>Team Assigned:</strong> {project.hasTeam ? "Yes" : "No"}
              </p>
            </div>
            <button
              onClick={() => handleNavigate(project._id)}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View Details
            </button>

            {user?.role === "admin" && (
              <div className="flex flex-wrap items-center mt-4 space-x-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                  onClick={() => openForm(project._id)}
                >
                  Team Assign
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete
                </button>
              </div>
            )}

            {(user?.role === "admin" || user?.role === "manager") && (
              <button
                onClick={() => openTaskForm(project._id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
              >
                Create Task
              </button>
            )}

            {openTask && selectedProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow w-96">
                  <h2 className="text-lg font-semibold mb-4">Create Task</h2>
                  <form onSubmit={handleTask}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <input
                      type="text"
                      value={selectedProject ? selectedProject.title : ""}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 mb-4"
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Task title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={tasks.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 mb-4"
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      disc
                    </label>
                    <textarea
                      name="description"
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none mb-4"
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Duedate:
                    </label>
                    <input
                      type="date"
                      min={today}
                      name="dueDate"
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none mb-4"
                    />
                    <div className="flex justify-between">
                      {" "}
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Assign tasks
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenTask(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {assign && selectedProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow w-96">
                  <h2 className="text-lg font-semibold mb-4">
                    Assign Team Member
                  </h2>
                  <form onSubmit={handleSubmitAssignment}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <input
                      type="text"
                      value={selectedProject ? selectedProject.title : ""}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 mb-4"
                    />

                    <label className="block mb-1">Select Team Member</label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="border p-2 w-full mb-4"
                      required
                    >
                      <option value="">--Select--</option>
                      {users
                        .filter((u) => u.role === "team-member")
                        .map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                      required
                    >
                      <option value="">--Select Role--</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="qa">QA</option>
                    </select>

                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Assign
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssing(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
