import { useState, useEffect } from "react";

import Login from "./components/Login";

import ClientList from "./components/ClientList";
import CreateClient from "./components/CreateClient";

import SiteList from "./components/SiteList";
import CreateSite from "./components/CreateSite";

import WorkTypeList from "./components/WorkTypeList";
import CreateWorkType from "./components/CreateWorkType";

import WorkEntry from "./components/WorkEntry";

import {
  getToken,
  getUserRole,
  isTokenExpired,
  logout,
} from "./utils/auth";

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

  if (page === "workTypes") {
    return (
      <WorkTypeList
        role={role!}
        onAdd={() => setPage("createWorkType")}
      />
    );
  }

  if (page === "createWorkType") {
    return <CreateWorkType onBack={() => setPage("workTypes")} />;
  }

  if (page === "workEntry") {
    return <WorkEntry />;
  }


  return (
    <div style={{ padding: 20 }}>
      <h1>Work Diary</h1>

      {/* 🔹 Navigation */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("clients")}>Clients</button>
        <button onClick={() => setPage("sites")}>Sites</button>
        <button onClick={() => setPage("workTypes")}>Work Types</button>
        <button onClick={() => setPage("workEntry")}>Work Entry</button>
        <button
          onClick={() => {
            logout();
            setIsAuthenticated(false);
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔹 Default view */}
      <ClientList
        role={role!}
        onAddClient={() => setPage("createClient")}
      />
    </div>
  );
}

export default App;