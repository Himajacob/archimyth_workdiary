export async function inviteUser(
  token: string,
  payload: any
) {

  const res = await fetch(
    "http://localhost:8000/users/invite",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (res.status === 401) {

    localStorage.removeItem("token");

    throw new Error(
      "Session expired. Please login again."
    );
  }

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail || "Invite failed"
    );
  }

  return data;
}

// -----------------------------------
// Get users
// -----------------------------------

export async function getUsers(
  token: string
) {

  const res = await fetch(
    "http://localhost:8000/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 401) {

    localStorage.removeItem("token");

    throw new Error(
      "Session expired. Please login again."
    );
  }

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed to fetch users"
    );
  }

  return data;
}

// -----------------------------------
// Update user
// -----------------------------------

export async function updateUser(
  token: string,
  userId: number,
  payload: any
) {

  const res = await fetch(
    `http://localhost:8000/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (res.status === 401) {

    localStorage.removeItem("token");

    throw new Error(
      "Session expired. Please login again."
    );
  }

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed to update user"
    );
  }

  return data;
}

export async function resendInvite(
  token: string,
  userId: number
) {

  const res = await fetch(
    `http://localhost:8000/users/${userId}/resend-invite`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 401) {

    localStorage.removeItem("token");

    throw new Error(
      "Session expired. Please login again."
    );
  }

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed to resend invite"
    );
  }

  return data;
}