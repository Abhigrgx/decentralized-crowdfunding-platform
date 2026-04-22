const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

export async function apiCall(path, options = {}) {
  const fullUrl = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(error.error?.message || `API error: ${res.status}`);
    }
    
    return res.json();
  } catch (err) {
    console.error(`[API] Error calling ${fullUrl}:`, err);
    throw err;
  }
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  
  const res = await fetch(`${API_BASE_URL}/uploads/pinata`, {
    method: "POST",
    body: form
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error?.message || "Upload failed");
  }
  
  return res.json();
}

export async function getAllProjects() {
  return apiCall("/projects");
}

export async function getProject(id) {
  return apiCall(`/projects/${id}`);
}

export async function getUserFundings(address) {
  return apiCall(`/projects/user/${address}/fundings`);
}

export async function getMilestones(projectId) {
  return apiCall(`/projects/${projectId}/milestones`);
}

export async function syncProjects() {
  return apiCall("/projects/sync", { method: "POST" });
}

export async function getProjectSnapshots() {
  return apiCall("/projects/snapshots");
}