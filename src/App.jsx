import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import GuestOnly from './components/layout/GuestOnly'
import RequireAuth from './components/layout/RequireAuth'
import AuthProvider from './context/AuthProvider'
import ComingSoonPage from './pages/ComingSoonPage'
import AdminPage from './pages/AdminPage'
import AdminUsersPage from './pages/AdminUsersPage'
import DashboardPage from './pages/DashboardPage'
import GoalFormPage from './pages/GoalFormPage'
import GoalsPage from './pages/GoalsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ProjectFormPage from './pages/ProjectFormPage'
import ProjectsPage from './pages/ProjectsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import TaskFormPage from './pages/TaskFormPage'
import TasksPage from './pages/TasksPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function RouteFade({ children }) {
  const { pathname } = useLocation()
  return (
    <div
      key={pathname}
      className="animate-fade-in motion-reduce:animate-none"
      style={{ animationDuration: '0.4s' }}
    >
      {children}
    </div>
  )
}

function ProtectedLayout() {
  return (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteFade>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <LoginPage />
                </GuestOnly>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnly>
                  <RegisterPage />
                </GuestOnly>
              }
            />

            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/new" element={<TaskFormPage />} />
              <Route path="/tasks/:id" element={<ComingSoonPage />} />
              <Route path="/tasks/:id/edit" element={<TaskFormPage />} />

              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/new" element={<ProjectFormPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/projects/:id/edit" element={<ProjectFormPage />} />

              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/goals/new" element={<GoalFormPage />} />
              <Route path="/goals/:id" element={<ComingSoonPage />} />
              <Route path="/goals/:id/edit" element={<GoalFormPage />} />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </RouteFade>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
