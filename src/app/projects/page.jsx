"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { getProjects, createProject, getUsers } from "../../utils/api";
import axios from "axios";
import { APP_BASE_URL } from "../../helpers";

export default function ProjectsPage() {
  const { user } = useAuth();
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
    assignedTo: "",
  });
  const [openTask, setOpenTask] = useState(false);
  const [teamMem, setTeamMem] = useState([]);
  const [searchProject, setSearchProject] = useState("");
  const [searchedp, setSearchedp] = useState([]);

  useEffect(() => {
    if (user?.token) {
      getProjects(user.token)
        .then((data) => {
          setProjects(data);
          setSearchedp(data);
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

  const getTeamDetails = async (id) => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/api/team/project/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTeamMem(res.data);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const newProject = await createProject(form, user.token);
      setSearchedp((prev) => [...prev, newProject]);
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
  const openForm = (projectId) => {
    const project = projects.find((p) => p._id === projectId);

    setSelectedProject(project);
    setAssing(true);
  };

  function openTaskForm(id) {
    const project = projects.find((p) => p._id === id);
    setSelectedProject(project);
    setOpenTask(true);
    getTeamDetails(id);
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
      getProjects(user.token).then((data) => setSearchedp(data));
      setSelectedRole("");
      setSelectedUserId("");
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
      setSearchedp((prev) => prev.filter((project) => project._id !== id));
    } catch {}
  };
  const handleSearchP = () => {
    const query = searchProject.trim().toLowerCase();
    if (query === "") {
      setSearchedp(projects);
      return;
    }
    const filtered = projects.filter((pro) =>
      pro.title.toLowerCase().includes(query)
    );
    setSearchedp(filtered);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4 mt-32">
      <h1 className="bg-blue-600 text-white text-3xl font-bold py-4 px-6 rounded-lg shadow mb-8 text-center">
        Projects
      </h1>

      {user?.role === "admin" && (
        <>
          <h1 className="text-2xl text-center pb-7">Create Project</h1>
          <form
            onSubmit={handleCreate}
            className="space-y-6 bg-white p-8 rounded-2xl shadow-lg max-w-xl mx-auto border border-gray-200"
          >
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-1">
              <label
                htmlFor="title"
                className="block text-base font-semibold text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-base font-semibold text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                rows="4"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="startDate"
                  className="block text-base font-semibold text-gray-700"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  min={today}
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="endDate"
                  className="block text-base font-semibold text-gray-700"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  min={form.startDate || today}
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="manager"
                className="block text-base font-semibold text-gray-700"
              >
                Project Manager
              </label>
              <select
                id="manager"
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
                required
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

            <div className="space-y-1">
              <label
                htmlFor="status"
                className="block text-base font-semibold text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                required
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-base font-semibold py-2.5 rounded-lg hover:bg-blue-700 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Project
            </button>
          </form>
        </>
      )}
      <div className="flex w-full max-w-xl mx-auto mt-32">
        <input
          type="text"
          value={searchProject}
          onChange={(e) => {
            setSearchProject(e.target.value);
            if (e.target.value.trim() === "") {
              setSearchedp(projects);
            }
          }}
          placeholder="Search project by title"
          className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearchP}
          className="bg-blue-600 text-white p-2 px-4 border border-l-0 border-gray-300 rounded-r-md hover:bg-blue-700 transition"
        >
          <i className="bx bx-search text-lg"></i>
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 max-w-7xl mx-auto">
        {searchedp.map((project) => (
          <li
            key={project._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 p-6"
          >
            <Link href={`/projects/${project._id}`}>
              <h3 className="text-xl font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition">
                {project.title}
              </h3>
            </Link>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
              <div className="flex flex-col">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{project.status}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500">Client</span>
                <span className="font-medium">
                  {project.client?.name || (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500">Manager</span>
                <span className="font-medium">
                  {project.manager?.name || (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium">
                  {project.startDate?.slice(0, 10)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500">End Date</span>
                <span className="font-medium">
                  {project.endDate?.slice(0, 10)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500">Team Assigned</span>
                <span
                  className={`font-semibold ${
                    project.hasTeam ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {project.hasTeam ? "Yes" : "No"}
                </span>
              </div>
            </div>

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
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 ">
                    Create Task
                  </h2>
                  <form onSubmit={handleTask} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project
                      </label>
                      <input
                        type="text"
                        value={selectedProject ? selectedProject.title : ""}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={tasks.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        min={today}
                        name="dueDate"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign To
                      </label>
                      <select
                        name="assignedTo"
                        value={tasks.assignedTo || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                        required
                      >
                        <option value="">-- Select team member --</option>
                        {teamMem.map((member) => (
                          <option key={member.user._id} value={member.user._id}>
                            {member.user.name} ({member.roleInProject})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setOpenTask(false)}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Assign Task
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {assign && selectedProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-xl p-6 sm:p-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                    Assign Team Member
                  </h2>

                  <form onSubmit={handleSubmitAssignment} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Project
                      </label>
                      <input
                        type="text"
                        value={selectedProject ? selectedProject.title : ""}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Select Team Member
                      </label>
                      <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white"
                        required
                      >
                        <option value="">-- Select --</option>
                        {users
                          .filter((u) => u.role === "team-member")
                          .map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Select Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white"
                        required
                      >
                        <option value="">-- Select Role --</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="qa">QA</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setAssing(false)}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Assign
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
