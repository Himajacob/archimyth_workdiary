export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function register(token: string, password: string) {
  const res = await fetch("http://localhost:8000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
}

export async function forgotPassword(
  email: string
) {

  const res = await fetch(
    "http://localhost:8000/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Failed"
    );
  }

  return data;
}

export async function resetPassword(
  token: string,
  password: string
) {

  const res = await fetch(
    "http://localhost:8000/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        token,
        password
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.detail ||
      "Reset failed"
    );
  }

  return data;
}