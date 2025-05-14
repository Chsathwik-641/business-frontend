import { APP_BASE_URL } from "../helpers";

export const getUsers = async (token) => {
  try {
    const response = await fetch(`${APP_BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${APP_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login failed");
  return await response.json();
};

export const registerUser = async (data) => {
  const response = await fetch(`${APP_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Registration failed");
  return await response.json();
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${APP_BASE_URL}/api/auth/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Unauthorized");
  return await response.json();
};

export const getProjects = async (token) => {
  const response = await fetch(`${APP_BASE_URL}/api/projects`, {
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

export async function getClients(token) {
  const res = await fetch(`${APP_BASE_URL}/api/clients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch clients`);
  }
  const data = await res.json();
  console.log("came to the api", data);
  return data;
}

export async function getProjectById(id, token) {
  const res = await fetch(`${APP_BASE_URL}/api/projects/${id}`, {
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
  const response = await fetch(`${APP_BASE_URL}/api/projects`, {
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
    `${APP_BASE_URL}/api/projects/${projectId}/assign-team`,
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

  return await response.json();
};

export const getInvoices = async (token) => {
  const response = await fetch(`${APP_BASE_URL}/api/invoices`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return await response.json();
};

export const createInvoice = async (data, token) => {
  const response = await fetch(`${APP_BASE_URL}/api/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create invoice");
  }

  return result;
};

export const updateInvoiceStatus = async (id, status, token) => {
  const response = await fetch(`${APP_BASE_URL}/api/invoices/${id}/status`, {
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
    const response = await fetch(`${APP_BASE_URL}/api/invoices/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete invoice. Status: ${response.status}. ${errorText}`
      );
    }

    console.log(`Invoice ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting invoice:", error.message);

    alert(`Error: ${error.message}`);
  }
};

export const downloadInvoice = async (id, token) => {
  const response = await fetch(
    `${APP_BASE_URL}/api/invoices/invoices/${id}/download`,
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
