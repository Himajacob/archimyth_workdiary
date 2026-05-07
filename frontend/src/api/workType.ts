export async function getWorkTypes(token: string, showInactive: boolean = false) {
  const res = await fetch(`http://localhost:8000/work-types/?show_inactive=${showInactive}`, {
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

export async function activateWorkType(
  token: string,
  workTypeId: number
) {
  const res = await fetch(
    `http://localhost:8000/work-types/${workTypeId}/activate`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to activate work type");
  }

  return data;
}

export async function deactivateWorkType(
  token: string,
  workTypeId: number
) {
  const res = await fetch(
    `http://localhost:8000/work-types/${workTypeId}/deactivate`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to deactivate work type");
  }

  return data;
}