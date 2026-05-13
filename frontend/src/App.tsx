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

import UserList from "./components/UserList";
import CreateUser from "./components/CreateUser";

import ClientSites from "./components/ClientSites";
import SiteGallery from "./components/SiteGallery";


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

  const [authLoading,
  setAuthLoading] =
  useState(true);

  const [role, setRole] =
    useState<string | null>(null);

  const [page, setPage] =
    useState("clients");

  const [selectedClient,
    setSelectedClient] =
    useState<any>(null);
  
  const [selectedSite, setSelectedSite] =
  useState<any>(null);
    

  // -----------------------------------
  // Auth Check
  // -----------------------------------

useEffect(() => {

  const token = getToken();

  if (
    !token ||
    isTokenExpired(token)
  ) {

    logout();

    setIsAuthenticated(false);

    setAuthLoading(false);

    return;
  }

  setIsAuthenticated(true);

  setRole(getUserRole());

  setAuthLoading(false);

  const interval = setInterval(() => {

    const currentToken =
      getToken();

    if (
      !currentToken ||
      isTokenExpired(currentToken)
    ) {

      logout();

      setIsAuthenticated(false);
    }

  }, 30000);

  return () =>
    clearInterval(interval);

}, []);

  // -----------------------------------
  // Reset Password
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
  // Create Client
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
  // Client Sites
  // -----------------------------------

if (page === "clientSites") {

  return (

    <DashboardLayout
      page={page}
      setPage={setPage}
      role={role!}
    >

      <ClientSites
        role={role!}
        client={selectedClient}

        onBack={() =>
          setPage("clients")
        }

        onOpenSite={(site) => {

          setSelectedSite(site);

          setPage("workEntry");

        }}

        onOpenGallery={(site) => {

          setSelectedSite(site);

          setPage("siteGallery");

        }}
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
          setPage("addSite")
        }

        onOpenSite={(site) => {

          setSelectedSite(site);

          setPage("workEntry");

        }}

        onOpenGallery={(site) => {

          setSelectedSite(site);

          setPage("siteGallery");

        }}
      />

      </DashboardLayout>
    );
  }

  // -----------------------------------
  // Create Site
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
  // Work Types
  // -----------------------------------

  if (page === "workTypes") {

    return (

      <DashboardLayout
        page={page}
        setPage={setPage}
        role={role!}
      >

        <WorkTypeList
          role={role!}

          onAdd={() =>
            setPage("createWorkType")
          }
        />

      </DashboardLayout>
    );
  }

  // -----------------------------------
  // Create Work Type
  // -----------------------------------

  if (page === "createWorkType") {

    return (

      <DashboardLayout
        page={page}
        setPage={setPage}
        role={role!}
      >

        <CreateWorkType
          onBack={() =>
            setPage("workTypes")
          }
        />

      </DashboardLayout>
    );
  }

  // -----------------------------------
  // Work Entry
  // -----------------------------------

  if (page === "workEntry") {

    return (

      <DashboardLayout
        page={page}
        setPage={setPage}
        role={role!}
      >

        <WorkEntry
        selectedSite={selectedSite}
        />

      </DashboardLayout>
    );
  }

  // -----------------------------------
  // Users
  // -----------------------------------

  if (page === "users") {

    return (

      <DashboardLayout
        page={page}
        setPage={setPage}
        role={role!}
      >

        <UserList
          role={role!}

          onAddUser={() =>
            setPage("createUser")
          }
        />

      </DashboardLayout>
    );
  }

  // -----------------------------------
  // Create User
  // -----------------------------------

  if (page === "createUser") {

    return (

      <DashboardLayout
        page={page}
        setPage={setPage}
        role={role!}
      >

        <CreateUser
          onBack={() =>
            setPage("users")
          }
        />

      </DashboardLayout>
    );
  }

  if (page === "siteGallery") {

  return (

    <DashboardLayout
      page={page}
      setPage={setPage}
      role={role!}
    >

      <SiteGallery
        site={selectedSite}

        onBack={() =>
          setPage("sites")
        }
      />

    </DashboardLayout>
  );
}

  // -----------------------------------
  // Default → Clients
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

        onOpenClient={(client) => {

          setSelectedClient(client);

          setPage("clientSites");
        }}
      />

    </DashboardLayout>
  );
}

export default App;