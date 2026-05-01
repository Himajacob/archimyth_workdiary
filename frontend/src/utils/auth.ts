export function getToken() {
  return localStorage.getItem("token");
}

export function getUserRole() {
  const token = getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role;
}

export function logout() {
  localStorage.removeItem("token");
}