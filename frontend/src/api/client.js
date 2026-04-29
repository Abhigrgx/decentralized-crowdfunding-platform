const BASE_URL = import.meta.env.VITE_API_URL || "";

async function apiFetch(path, options = {}) {
  const url = BASE_URL ? `${BASE_URL}${path}` : path;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  const payload = await res.json();
  return payload?.data ?? payload;
}

export async function getAllProjects() {
  const data = await apiFetch("/api/projects");
  return { data };
}

export async function getUserFundings(address) {
  const data = await apiFetch(`/api/projects/user/${address}/fundings`);
  return { data };
}

export async function uploadImage(file) {
  const url = BASE_URL ? `${BASE_URL}/api/uploads/pinata` : "/api/uploads/pinata";
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  }

  const payload = await res.json();
  return payload?.data ?? payload;
}
