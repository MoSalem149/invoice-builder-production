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

  const handlePageChange = (page: string) => {
    if (!authState.isAuthenticated && page !== "landing") {
      navigate("/login");
      return;
    }
    setCurrentPage(page);
    navigate(page === "landing" ? "/" : `/${page}`);
  };

  // In App.tsx, update the useEffect hook like this:
  useEffect(() => {
    if (isLoginPage) {
      document.title = t("navigation.login");
      return;
    }

    // Don't update title if we're still loading auth state
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
    };

    // Get current path and map to page key
    const path = location.pathname.substring(1) || "landing";
    const pageKey = Object.keys(pageTitles).includes(path) ? path : "landing";

    document.title =
      pageTitles[pageKey as keyof typeof pageTitles] ||
      t("navigation.invoiceBuilder");
  }, [currentPage, t, isLoginPage, authState.isLoading, location.pathname]);

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
              <LoginModal
                isOpen={true}
                onClose={() => navigate("/")}
                onLoginSuccess={() => {
                  setCurrentPage("dashboard");
                  navigate("/dashboard");
                }}
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : authState.isAuthenticated ? (
                <Dashboard onPageChange={handlePageChange} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Create Invoice */}
          <Route
            path="/create"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : authState.isAuthenticated ? (
                <CreateInvoice />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : authState.isAuthenticated ? (
                <Settings />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* History */}
          <Route
            path="/history"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : authState.isAuthenticated ? (
                <History />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

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
