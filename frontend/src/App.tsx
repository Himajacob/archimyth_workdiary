import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useState } from "react";

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

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Register from "./components/Register";


import {
  getUserRole,
} from "./utils/auth";

export default function App() {

  const [role] = useState<string>(
    () => getUserRole() || "user"
  );

  return (

    <Routes>

      {/* ----------------------------------- */}
      {/* Public Routes */}
      {/* ----------------------------------- */}

      <Route
        path="/"
        element={
          <LoginPage />
        }
      />

      <Route
        path="/reset-password"
        element={
          <ResetPassword />
        }
      />

      <Route
        path="/register"
        element={
          <Register />
        }
      />

      {/* ----------------------------------- */}
      {/* Clients */}
      {/* ----------------------------------- */}

      <Route
        path="/clients"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <ClientList
                role={role}
              />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/create"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <CreateClient />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/:clientId/sites"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <ClientSites
                role={role}
              />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Sites */}
      {/* ----------------------------------- */}

      <Route
        path="/sites"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <SiteList
                role={role}
              />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/sites/create"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <CreateSite />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/sites/:siteId/work-entry"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <WorkEntry />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/work-diary"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <WorkEntry />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/sites/:siteId/gallery"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <SiteGallery />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Work Types */}
      {/* ----------------------------------- */}

      <Route
        path="/work-types"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <WorkTypeList
                role={role}
              />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/work-types/create"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <CreateWorkType />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Users */}
      {/* ----------------------------------- */}

      <Route
        path="/users"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <UserList
                role={role}
              />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/users/create"
        element={

          <ProtectedRoute>

            <DashboardLayout
              role={role}
            >

              <CreateUser />

            </DashboardLayout>

          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Fallback */}
      {/* ----------------------------------- */}

      <Route
        path="*"
        element={
          <Navigate
            to="/clients"
            replace
          />
        }
      />

    </Routes>
  );
}
