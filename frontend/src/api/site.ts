export async function getSites(
  token: string,
  showInactive: boolean = false
) {

  const res = await fetch(
    `http://localhost:8000/sites/?show_inactive=${showInactive}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed to fetch sites"
    );
  }

  return data;
}

export async function createSite(
  token: string,
  payload: any
) {

  const res = await fetch(
    "http://localhost:8000/sites/",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify(
        payload
      ),
    }
  );

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed to create site"
    );
  }

  return data;
}

export async function updateSite(
  token: string,
  siteId: number,
  payload: any
) {

  const res = await fetch(
    `http://localhost:8000/sites/${siteId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify(
        payload
      ),
    }
  );

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed to update site"
    );
  }

  return data;
}

export async function getSitesByClient(
  token: string,
  clientId: number,
  showInactive: boolean = false
) {

  const res = await fetch(
    `http://localhost:8000/sites/client/${clientId}?show_inactive=${showInactive}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed to fetch client sites"
    );
  }

  return data;
}