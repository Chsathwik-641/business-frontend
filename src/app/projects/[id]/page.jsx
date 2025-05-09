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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
        {project.title}
      </h1>
      <p className="text-gray-700 mb-4">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block font-medium text-gray-800">Status</span>
          <span className="text-blue-600">{project.status}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block font-medium text-gray-800">Start Date</span>
          <span>{new Date(project.startDate).toLocaleDateString()}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block font-medium text-gray-800">End Date</span>
          <span>{new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
