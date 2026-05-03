import { useState, useEffect } from "react";
import Login from "./components/Login";
import ClientList from "./components/ClientList";
import CreateClient from "./components/CreateClient";
import SiteList from "./components/SiteList";
import CreateSite from "./components/CreateSite";
import { getToken, getUserRole, isTokenExpired, logout } from "./utils/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [page, setPage] = useState("clients");

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

  if (page === "createClient") {
    return <CreateClient onBack={() => setPage("clients")} />;
  }

  if (page === "sites") {
    return (
      <SiteList
        role={role!}
        onAddSite={() => setPage("createSite")}
      />
    );
  }

  if (page === "createSite") {
    return <CreateSite onBack={() => setPage("sites")} />;
  }

  return (
    <div>
      <button onClick={() => setPage("clients")}>Clients</button>
      <button onClick={() => setPage("sites")}>Sites</button>

      <ClientList
        role={role!}
        onAddClient={() => setPage("createClient")}
      />
    </div>
  );
}

export default App;