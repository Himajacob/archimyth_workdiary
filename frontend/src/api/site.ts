export async function getSites(token: string) {
  const res = await fetch("http://localhost:8000/sites/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch sites");
  }

  return data;
}

export async function createSite(token: string, payload: any) {
  const res = await fetch("http://localhost:8000/sites/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to create site");
  }

  return data;
}