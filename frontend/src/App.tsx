import { useState, useEffect } from "react";

import LoginPage from "./components/pages/LoginPage";

import ResetPassword from "./components/ResetPassword";

import ClientList from "./components/ClientList";
import CreateClient from "./components/CreateClient";

import SiteList from "./components/SiteList";
import CreateSite from "./components/CreateSite";

import WorkTypeList from "./components/WorkTypeList";
import CreateWorkType from "./components/CreateWorkType";

import WorkEntry from "./components/WorkEntry";

import UserManagement from "./components/UserManagement";

import {
  getToken,
  getUserRole,
  isTokenExpired,
  logout,
} from "./utils/auth";

function App() {

  // -----------------------------------
  // URL Path
  // -----------------------------------

  const pathname =
    window.location.pathname;

  // -----------------------------------
  // State
  // -----------------------------------

  const [isAuthenticated,
    setIsAuthenticated] =
    useState(false);

  const [role, setRole] =
    useState<string | null>(null);

  const [page, setPage] =
    useState("clients");

  // -----------------------------------
  // Auth check
  // -----------------------------------

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

  // -----------------------------------
  // Reset password page
  // -----------------------------------

  if (
    pathname === "/reset-password"
  ) {

    return <ResetPassword />;
  }

  // -----------------------------------
  // Login
  // -----------------------------------

if (!isAuthenticated) {

  return (
    <LoginPage
      onLogin={() => {

        setIsAuthenticated(true);

        setRole(
          getUserRole()
        );
      }}
    />
  );
}

  // -----------------------------------
  // Create client
  // -----------------------------------

  if (page === "createClient") {

    return (
      <CreateClient
        onBack={() =>
          setPage("clients")
        }
      />
    );
  }

  // -----------------------------------
  // Sites
  // -----------------------------------

  if (page === "sites") {

    return (
      <SiteList
        role={role!}
        onAddSite={() =>
          setPage("createSite")
        }
      />
    );
  }

  // -----------------------------------
  // Create site
  // -----------------------------------

  if (page === "createSite") {

    return (
      <CreateSite
        onBack={() =>
          setPage("sites")
        }
      />
    );
  }

  // -----------------------------------
  // Work types
  // -----------------------------------

  if (page === "workTypes") {

    return (
      <WorkTypeList
        role={role!}
        onAdd={() =>
          setPage("createWorkType")
        }
      />
    );
  }

  // -----------------------------------
  // Create work type
  // -----------------------------------

  if (page === "createWorkType") {

    return (
      <CreateWorkType
        onBack={() =>
          setPage("workTypes")
        }
      />
    );
  }

  // -----------------------------------
  // Work entry
  // -----------------------------------

  if (page === "workEntry") {

    return <WorkEntry />;
  }

  // -----------------------------------
  // User management
  // -----------------------------------

  if (page === "users") {

    return <UserManagement />;
  }

  // -----------------------------------
  // Default page
  // -----------------------------------

  return (

    <div style={{ padding: 20 }}>

      <h1>Work Diary</h1>

      {/* Navigation */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 10,
          flexWrap: "wrap"
        }}
      >

        <button
          onClick={() =>
            setPage("clients")
          }
        >
          Clients
        </button>

        <button
          onClick={() =>
            setPage("sites")
          }
        >
          Sites
        </button>

        <button
          onClick={() =>
            setPage("workTypes")
          }
        >
          Work Types
        </button>

        <button
          onClick={() =>
            setPage("workEntry")
          }
        >
          Work Entry
        </button>

        {/* Admin only */}
        {role === "admin" && (
          <button
            onClick={() =>
              setPage("users")
            }
          >
            Users
          </button>
        )}

        <button
          onClick={() => {

            logout();

            setIsAuthenticated(false);
          }}
        >
          Logout
        </button>

      </div>

      {/* Default view */}
      <ClientList
        role={role!}
        onAddClient={() =>
          setPage("createClient")
        }
      />

    </div>
  );
}

export default App;