// App.tsx
import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import { useNotificationContext } from "./hooks/useNotificationContext";
import { useAuth } from "./hooks/useAuth";
import NotificationContainer from "./components/UI/NotificationContainer";
import Loader from "./components/UI/Loader";
import LoginModal from "./components/Auth/LoginModal";
import Navbar from "./components/Layout/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings/Settings";
import History from "./components/History/History";
import CreateInvoice from "./components/Create/CreateInvoice";
import { useLanguage } from "./hooks/useLanguage";
import LandingPage from "./components/Landing/LandingPage";
import CarDetails from "./components/Landing/CarDetails";
import { Car } from "./types";
import Footer from "./components/Layout/Footer";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const { notifications, removeNotification } = useNotificationContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: authState } = useAuth();

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    if (authState.isLoading) return;

    // If user is on login page but already authenticated, redirect to dashboard
    if (isLoginPage && authState.isAuthenticated) {
      document.title = `${t("navigation.dashboard")} - ${t(
        "navigation.invoiceBuilder"
      )}`;
      navigate("/dashboard");
      return;
    }

    // If user is not on login page but not authenticated, redirect to login
    if (
      !isLoginPage &&
      !authState.isAuthenticated &&
      location.pathname !== "/"
    ) {
      document.title = t("navigation.login");
      navigate("/login");
      return;
    }
  }, [
    authState.isAuthenticated,
    authState.isLoading,
    isLoginPage,
    location.pathname,
    navigate,
    t, // Add t to dependencies
  ]);

  const handlePageChange = (page: string) => {
    if (!authState.isAuthenticated && page !== "landing") {
      navigate("/login");
      return;
    }
    setCurrentPage(page);
    navigate(page === "landing" ? "/" : `/${page}`);
  };

  useEffect(() => {
    // Don't update title if we're still loading auth state or during redirects
    if (authState.isLoading) return;

    const pageTitles = {
      landing: t("navigation.carRentalTitle"),
      dashboard: `${t("navigation.dashboard")} - ${t(
        "navigation.invoiceBuilder"
      )}`,
      create: `${t("navigation.create")} - ${t("navigation.invoiceBuilder")}`,
      settings: `${t("navigation.settings")} - ${t(
        "navigation.invoiceBuilder"
      )}`,
      history: `${t("navigation.history")} - ${t("navigation.invoiceBuilder")}`,
      login: t("navigation.login"),
    };

    // Get current path and map to page key
    const path = location.pathname.substring(1) || "landing";
    const pageKey = Object.keys(pageTitles).includes(path) ? path : "landing";

    // Only update if we're not in a redirect situation
    if (!(isLoginPage && authState.isAuthenticated)) {
      document.title =
        pageTitles[pageKey as keyof typeof pageTitles] ||
        t("navigation.invoiceBuilder");
    }
  }, [
    currentPage,
    t,
    isLoginPage,
    authState.isLoading,
    authState.isAuthenticated,
    location.pathname,
  ]);

  const renderPage = () => {
    if (selectedCar) {
      return (
        <CarDetails car={selectedCar} onBack={() => setSelectedCar(null)} />
      );
    }

    switch (currentPage) {
      case "landing":
        return <LandingPage onCarSelect={(car) => setSelectedCar(car)} />;
      case "dashboard":
        return <Dashboard onPageChange={handlePageChange} />;
      case "settings":
        return <Settings />;
      case "history":
        return <History />;
      case "create":
        return <CreateInvoice />;
      default:
        return <LandingPage onCarSelect={(car) => setSelectedCar(car)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isLoginPage && (
        <Navbar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLanding={currentPage === "landing"}
        />
      )}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={
              authState.isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginModal
                  isOpen={true}
                  onClose={() => navigate("/")}
                  onLoginSuccess={() => {
                    setCurrentPage("dashboard");
                    navigate("/dashboard");
                  }}
                />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : (
                <Dashboard onPageChange={handlePageChange} />
              )
            }
          />

          <Route
            path="/create"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : (
                <CreateInvoice />
              )
            }
          />

          <Route
            path="/settings"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : (
                <Settings />
              )
            }
          />

          <Route
            path="/history"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : (
                <History />
              )
            }
          />

          {/* Public route */}
          <Route path="/" element={renderPage()} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isLoginPage && currentPage === "landing" && <Footer />}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <AppProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </AppProvider>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
