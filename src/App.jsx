import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { DemoDataProvider } from "./hooks/useDemoData";
import { ThemeProvider } from "./hooks/useTheme";

const AIAdvisorPage = lazy(() => import("./pages/AIAdvisorPage"));
const CareerPage = lazy(() => import("./pages/CareerPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ResumeAnalyzerPage = lazy(() => import("./pages/ResumeAnalyzerPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function GuestOnly({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/app" replace /> : children;
}

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-mist text-sm font-bold text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
          Loading LifePilot AI...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
        <Route
          path="/app"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="career" element={<CareerPage />} />
          <Route path="resume" element={<ResumeAnalyzerPage />} />
          <Route path="advisor" element={<AIAdvisorPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DemoDataProvider>
          <AppRoutes />
        </DemoDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
