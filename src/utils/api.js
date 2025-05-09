const API_BASE_URL = "http://localhost:5000/api";

// Utility function to fetch users
export const getUsers = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching users");
    }

    const data = await response.json(); // Parse the response as JSON
    return data; // Returns the list of users
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
};

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

export async function getProjectById(id, token) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch project: ${errorText}`);
  }

  return await res.json();
}

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

export const assignTeam = async (projectId, userId, role, token) => {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/assign-team`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        role,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to assign team member");
  }

  return await response.json(); // Return the updated project data
};

export const getInvoices = async (token) => {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return await response.json();
};

export const createInvoice = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create invoice");
  return await response.json();
};

export const updateInvoiceStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update invoice status");
  return await response.json();
};

export const deleteInvoice = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete invoice. Status: ${response.status}. ${errorText}`
      );
    }

    console.log(`Invoice ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting invoice:", error.message);
    // Optionally, show an alert or toast to the user
    alert(`Error: ${error.message}`);
  }
};

export const downloadInvoice = async (id, token) => {
  const response = await fetch(
    `${API_BASE_URL}/invoices/invoices/${id}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to download invoice");

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${id}.pdf`;
  link.click();
};
