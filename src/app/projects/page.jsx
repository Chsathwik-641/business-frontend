"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { getProjects, createProject } from "@/utils/api";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "not-started",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (user?.token) {
      getProjects(user.token).then(setProjects).catch(console.error);
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
        client: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <form onSubmit={handleCreate} className="space-y-2 mb-6">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {/* <input
          placeholder="Client ID"
          value={form.client}
          onChange={(e) => setForm({ ...form, client: e.target.value })}
        /> */}
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
        {/* ["not-started", "in-progress", "completed"] */}
        <select
          value={form.status}
          onChange={(e) => {
            console.log("event here", e);
            setForm({ ...form, status: e.target.value });
          }}
        >
          <option>{"not-started"}</option>
          <option>{"in-progress"}</option>
          <option>{"completed"}</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project._id} className="border p-2">
            <Link href={`/projects/${project._id}`}>
              <strong>{project.title}</strong> - {project.status}
            </Link>
            <div>Client: {project.client?.name}</div>
            <div>Manager: {project.manager?.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
