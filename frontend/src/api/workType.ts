export async function getWorkTypes(token: string) {
  const res = await fetch("http://localhost:8000/work-types/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch work types");
  }

  return data;
}

export async function createWorkType(token: string, payload: any) {
  const res = await fetch("http://localhost:8000/work-types/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to create work type");
  }

  return data;
}