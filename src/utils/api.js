const API_BASE_URL = "http://localhost:5000/api";

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login failed");
  return await response.json();
};

export const registerUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Registration failed");
  return await response.json();
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Unauthorized");
  return await response.json();
};

export const getProjects = async (token) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return await response.json();
};

export const createProject = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return await response.json();
};
