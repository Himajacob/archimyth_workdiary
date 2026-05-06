export async function uploadPhoto(
  token: string,
  workEntryItemId: number,
  file: File
) {
  const formData = new FormData();
  formData.append("work_entry_item_id", String(workEntryItemId));
  formData.append("file", file);

  const res = await fetch("http://localhost:8000/work-entry-photos/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function deletePhoto(token: string, photoId: number) {
  const res = await fetch(
    `http://localhost:8000/work-entry-photos/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}