export async function getClients(token: string) {
  const res = await fetch("http://localhost:8000/clients/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch clients");
  }

  return data;
}

export async function createClient(token: string, payload: any) {
  const res = await fetch("http://localhost:8000/clients/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to create client");
  }

  return data;
}