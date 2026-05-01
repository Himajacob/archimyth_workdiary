export async function inviteUser(token: string, payload: any) {
  const res = await fetch("http://localhost:8000/users/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please login again.");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Invite failed");
  }

  return data;
}