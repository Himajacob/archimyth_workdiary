import { useState, useEffect } from "react";
import Login from "./components/Login";
import InviteUser from "./components/InviteUser";
import Register from "./components/Register";
import { getToken, getUserRole, isTokenExpired, logout } from "./utils/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      logout();
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    setRole(getUserRole());
  }, []);

  if (window.location.pathname === "/register") {
    return <Register />;
  }

  if (!isAuthenticated) {
  return (
    <Login
      onLogin={() => {
        setIsAuthenticated(true);
        setRole(getUserRole());
      }}
    />
  );
  }

  if (role !== "admin") {
    return <h2>Access Denied (Admin only)</h2>;
  }

  return <InviteUser onLogout={() => setIsAuthenticated(false)} />;
}

export default App;