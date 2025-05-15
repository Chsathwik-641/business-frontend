"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById } from "../../../utils/api";
import { useAuth } from "@/hooks/useAuth";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        if (!user?.token || !id) return;
        const data = await getProjectById(id, user.token);
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Unable to load project.");
      }
    }

    fetchProject();
  }, [user, id]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!project) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-3xl mt-32">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 border-b pb-3">
        {project.title}
      </h1>

      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
        {project.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base text-gray-700">
        <div className="bg-gray-100 p-5 rounded-xl">
          <span className="block font-semibold text-gray-800 mb-1">Status</span>
          <span className="text-blue-600 font-medium">{project.status}</span>
        </div>

        <div className="bg-gray-100 p-5 rounded-xl">
          <span className="block font-semibold text-gray-800 mb-1">
            Start Date
          </span>
          <span>{new Date(project.startDate).toLocaleDateString()}</span>
        </div>

        <div className="bg-gray-100 p-5 rounded-xl sm:col-span-2">
          <span className="block font-semibold text-gray-800 mb-1">
            End Date
          </span>
          <span>{new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
