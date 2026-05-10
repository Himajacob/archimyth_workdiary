import { useState, useEffect } from "react";

import LoginPage from "./components/pages/LoginPage";
import ResetPassword from "./components/ResetPassword";
import DashboardLayout from "./components/layout/DashboardLayout";

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

    <DashboardLayout
      page={page}
      setPage={setPage}
      role={role!}
    >

      <CreateClient
        onBack={() =>
          setPage("clients")
        }
      />

    </DashboardLayout>
  );
}
// -----------------------------------
// Sites
// -----------------------------------

if (page === "sites") {

  return (

    <DashboardLayout
      page={page}
      setPage={setPage}
      role={role!}
    >

      <SiteList
        role={role!}
        onAddSite={() =>
          setPage("createSite")
        }
      />

    </DashboardLayout>
  );
}

// -----------------------------------
// Create site
// -----------------------------------

if (page === "createSite") {

  return (

    <DashboardLayout
      page={page}
      setPage={setPage}
      role={role!}
    >

      <CreateSite
        onBack={() =>
          setPage("sites")
        }
      />

    </DashboardLayout>
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

  <DashboardLayout
    page={page}
    setPage={setPage}
    role={role!}
  >

    <ClientList
      role={role!}
      onAddClient={() =>
        setPage("createClient")
      }
    />

  </DashboardLayout>
);
}

export default App;