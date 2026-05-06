export async function getWorkEntry(token: string, siteId: number, date: string) {
  const res = await fetch(
    `http://localhost:8000/work-entries?site_id=${siteId}&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 404) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch work entry");
  }

  return data;
}

export async function saveWorkEntry(token: string, payload: any) {
  const res = await fetch("http://localhost:8000/work-entries/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to save work entry");
  }

  return data;
}

export async function deleteWorkEntryItem(
  token: string,
  itemId: number
) {
  const res = await fetch(
    `http://localhost:8000/work-entries/items/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to delete item");
  }

  return res.json();
}