"use client";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { getProjects } from "../../utils/api";
import { APP_BASE_URL } from "../../helpers";

const Team = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [group, setGroup] = useState([]);
  const [show, setShow] = useState(false);
  const [searchProject, setSearchProject] = useState("");
  const [searchedp, setSearchedp] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchedU, setSearchedU] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${APP_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const users = res.data;
        const teamMembers = users.filter((u) => u.role === "team-member");
        setTeam(teamMembers);
        setSearchedU(teamMembers);

        const projectList = await getProjects(user.token);
        setProjects(projectList);
        setSearchedp(projectList);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getTeamTasksByProject = async (projectId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${APP_BASE_URL}/api/tasks/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setGroup(res.data);
      setShow(true);
    } catch (err) {
      console.error("Error loading team tasks", err);
    } finally {
      setLoading(false);
    }
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
  const handleSeacrhU = () => {
    const query = searchUser.trim().toLowerCase();
    if (query === "") {
      setSearchedU(team);
    }
    const filter = team.filter((u) => u.name.toLowerCase().includes(query));
    setSearchedU(filter);
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 mt-28 max-w-7xl">
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            All Projects
          </h2>
          <div className="flex w-full max-w-xl mx-auto mb-10">
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

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedp.map((proj) => (
              <li
                key={proj._id}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="space-y-2 text-sm sm:text-base text-gray-700">
                  <p className="text-lg font-bold text-gray-800 truncate">
                    {proj.title}
                  </p>
                  <p>
                    <span className="font-medium">Client:</span>{" "}
                    {proj.client?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Manager:</span>{" "}
                    {proj.manager?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Start:</span>{" "}
                    {proj.startDate?.slice(0, 10)}
                  </p>
                  <p>
                    <span className="font-medium">End:</span>{" "}
                    {proj.endDate?.slice(0, 10)}
                  </p>
                  <p>
                    <span className="font-medium">Team Assigned:</span>{" "}
                    {proj.hasTeam ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-semibold">No</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => getTeamTasksByProject(proj._id)}
                  className="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  View Team Profile
                </button>

                {/* Modal */}
                {show && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Team Details
                      </h2>
                      {group && group.length > 0 ? (
                        <ul className="space-y-4">
                          {group.map((assignment) => (
                            <li
                              key={assignment.user._id}
                              className="text-sm text-gray-700"
                            >
                              <p className="font-semibold">
                                {assignment.user.name} -{" "}
                                {assignment.roleInProject}
                              </p>
                              {assignment.tasks?.length ? (
                                <ul className="ml-4 mt-1 list-disc text-gray-600">
                                  {assignment.tasks.map((task) => (
                                    <li key={task._id}>
                                      <span className="font-medium text-gray-800">
                                        {task.title}
                                      </span>{" "}
                                      —
                                      <span className="italic text-xs text-gray-500">
                                        {" "}
                                        {task.status}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="ml-4 text-xs text-gray-400">
                                  No tasks assigned
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No team assigned
                        </p>
                      )}

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => setShow(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mt-20 mb-8">
            Team Members in the Company
          </h1>

          <div className="flex w-full max-w-xl mx-auto mb-10">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => {
                setSearchUser(e.target.value);
                if (e.target.value.trim() === "") {
                  setSearchedU(team);
                }
              }}
              placeholder="Search by name"
              className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSeacrhU}
              className="bg-blue-600 text-white px-4 border border-l-0 border-gray-300 rounded-r-md hover:bg-blue-700 transition"
            >
              <i className="bx bx-search text-lg"></i>
            </button>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm sm:text-base">
            {searchedU.map((member) => (
              <li
                key={member._id}
                className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-md transition border border-gray-100"
              >
                <p className="text-sm font-semibold text-gray-800 sm:text-base">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500 sm:text-sm">
                  {member.email}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Team;
