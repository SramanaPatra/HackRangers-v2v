const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export function getToken() {
  return localStorage.getItem("mindease_token");
}

export function setToken(token) {
  localStorage.setItem("mindease_token", token);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}