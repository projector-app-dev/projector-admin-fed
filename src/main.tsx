import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.tsx";
import ClientDashboard from "./components/pages/ClientDashboard/ClientDashboard.tsx";
import ClientDatagridTabelPage from "./components/pages/ClientDashboard/ClientDatagridTabelPage.tsx";
import ClientInfoPage from "./components/pages/ClientDashboard/ClientInfoPage.tsx";
import AddClientPage from "./components/pages/crud/client/AddClientPage.tsx";
import EditClientPage from "./components/pages/crud/client/EditClientPage.tsx";
import AddHistoryPage from "./components/pages/crud/project/AddHistoryPage.tsx";
import AddProjectPage from "./components/pages/crud/project/AddProjectPage.tsx";
import EditHistoryPage from "./components/pages/crud/project/EditHistoryPage.tsx";
import EditProjectPage from "./components/pages/crud/project/EditProjectPage.tsx";
import AddUserPage from "./components/pages/crud/user/AddUserPage.tsx";
import EditUserPage from "./components/pages/crud/user/EditUserPage.tsx";
import LoginPage from "./components/pages/LoginPage/LoginPage.tsx";
import ProjectClientHistoryInfoPage from "./components/pages/ProjectsDashboard/ProjectClientHistoryInfoPage.tsx";
import ProjectClientHistoryPage from "./components/pages/ProjectsDashboard/ProjectClientHistoryPage.tsx";
import ProjectClientsDatagridTabelPage from "./components/pages/ProjectsDashboard/ProjectClientsDatagridTabelPage.tsx";
import ProjectsDashboard from "./components/pages/ProjectsDashboard/ProjectsDashboard.tsx";
import ProjectsInfoPage from "./components/pages/ProjectsDashboard/ProjectsInfoPage.tsx";
import ReportDashboard from "./components/pages/ReportDashboard/ReportDashboard.tsx";
import UserDashboard from "./components/pages/UserDashboard/UserDashboard.tsx";
import UserDatagridTabelPage from "./components/pages/UserDashboard/UserDatagridTabelPage.tsx";
import UserInfoPage from "./components/pages/UserDashboard/UserInfoPage.tsx";
import AppProvider from "./providers/AppProvider.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";
import UserProvider from "./providers/UserProvider.tsx";
import ReportGeneratePage from "./components/pages/ReportDashboard/ReportGeneratePage.tsx";
import NotFoundPage from "./components/pages/NotFoundPage.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppProvider />}>
            <Route path="/" element={<ProjectsDashboard />}>
              <Route path="/projects/add" element={<AddProjectPage />} />
              <Route
                path="/projects/:projectId"
                element={<ProjectsInfoPage />}
              />
              <Route
                path="/projects/:projectId/clients"
                element={<ProjectClientsDatagridTabelPage />}
              />
              <Route
                path="/projects/:projectId/edit"
                element={<EditProjectPage />}
              />
              <Route
                path="/projects/:projectId/clients/:clientId/history"
                element={<ProjectClientHistoryPage />}
              />
              <Route
                path="/projects/:projectId/clients/:clientId/history/:historyId"
                element={<ProjectClientHistoryInfoPage />}
              />
              <Route
                path="/projects/:projectId/clients/:clientId/history/add"
                element={<AddHistoryPage />}
              />
              <Route
                path="/projects/:projectId/clients/:clientId/history/edit/:historyId"
                element={<EditHistoryPage />}
              />
            </Route>
            <Route path="/clients" element={<ClientDashboard />}>
              <Route
                path="/clients/all"
                element={<ClientDatagridTabelPage />}
              />
              <Route path="/clients/add" element={<AddClientPage />} />
              <Route
                path="/clients/:clientId/edit"
                element={<EditClientPage />}
              />
              <Route path="/clients/:clientId" element={<ClientInfoPage />} />
            </Route>
            <Route path="/report" element={<ReportDashboard />}>
              <Route path="/report/generate" element={<ReportGeneratePage />} />
            </Route>
            <Route element={<UserProvider />}>
              <Route path="/users" element={<UserDashboard />}>
                <Route path="/users/all" element={<UserDatagridTabelPage />} />
                <Route path="/users/add" element={<AddUserPage />} />
                <Route path="/users/:userId/edit" element={<EditUserPage />} />
                <Route path="/users/:userId" element={<UserInfoPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
