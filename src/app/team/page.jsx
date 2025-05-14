"use client";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProjects } from "../../utils/api";
import { APP_BASE_URL } from "../../helpers";

const Team = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [group, setGroup] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${APP_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const users = res.data;
        const teamMembers = users.filter((u) => u.role === "team-member");
        setTeam(teamMembers);

        const projectList = await getProjects(user.token);
        setProjects(projectList);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, [user]);

  const getTeamDetails = async (id) => {
    try {
      const res = await axios.get(`${APP_BASE_URL}/api/team/project/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setGroup(res.data);
      setShow(true);
    } catch {}
  };

  return (
    <div className="container mx-auto p-4 mt-32">
      <h1 className="text-2xl font-bold mb-6">Team Members in the company</h1>
      <ul className="space-y-4">
        {team.map((member) => (
          <li key={member._id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-medium">{member.name}</p>
            <p className="text-sm text-gray-600">{member.email}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">All Projects</h2>
      <ul className="space-y-6">
        {projects.map((proj) => (
          <div key={proj._id} className="bg-white p-4 rounded-lg shadow-md">
            <li>
              <p className="font-medium">Title of the project: {proj.title}</p>
              <p className="text-sm text-gray-600">
                Client: {proj.client?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Manager: {proj.manager?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Start: {proj.startDate?.slice(0, 10)}
              </p>
              <p className="text-sm text-gray-600">
                End: {proj.endDate?.slice(0, 10)}
              </p>
              <p className="font-medium text-sm">
                <strong>Team Assigned:</strong> {proj.hasTeam ? "Yes" : "No"}
              </p>
              <button
                onClick={() => getTeamDetails(proj._id)}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none"
              >
                View Team Profile
              </button>

              {show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">Team Details</h2>

                    {group && group.length > 0 ? (
                      <ul className="space-y-2">
                        {group.map((assignment) => (
                          <li
                            key={assignment._id}
                            className="text-sm text-gray-700"
                          >
                            {assignment.user.name} - {assignment.roleInProject}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No team assigned</p>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setShow(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Team;
