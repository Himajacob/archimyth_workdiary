import { useState, useEffect } from "react";
import Login from "./components/Login";
import ClientList from "./components/ClientList";
import CreateClient from "./components/CreateClient";
import { getToken, getUserRole, isTokenExpired, logout } from "./utils/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [page, setPage] = useState("list");

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

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (page === "create") {
    return <CreateClient onBack={() => setPage("list")} />;
  }

  return (
    <ClientList
      role={role!}
      onAddClient={() => setPage("create")}
    />
  );
}

export default App;