// App.tsx
import React, { useState, useEffect, useCallback } from "react";
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
import UpdateCars from "./components/Cars/UpdateCars";
import CreateInvoice from "./components/Create/CreateInvoice";
import { useLanguage } from "./hooks/useLanguage";
import LandingPage from "./components/Landing/LandingPage";
import CarDetails from "./components/Landing/CarDetails";
import { Car } from "./types";
import Footer from "./components/Layout/Footer";
import About from "./components/Landing/About";
import Services from "./components/Landing/Services";
import FAQs from "./components/Landing/FAQs";
import Terms from "./components/Landing/Terms";
import Contact from "./components/Landing/Contact";
import TermsConditions from "./components/Landing/TermsConditions";
import PrivacyNotice from "./components/Landing/PrivacyNotice";
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

  // List of public routes that don't require authentication
  const publicRoutes = useCallback(() => {
    return [
      "",
      "about",
      "services",
      "faqs",
      "terms",
      "contact",
      "terms-conditions",
      "privacy-notice",
      "car",
    ];
  }, []);

  // Check if current route is public
  const isPublicRoute = useCallback(() => {
    const path = location.pathname.substring(1);
    return publicRoutes().some((route) => path.startsWith(route));
  }, [location.pathname, publicRoutes]);

  // Sync currentPage with the actual route
  useEffect(() => {
    const path = location.pathname.substring(1) || "landing";
    const validPages = [
      "landing",
      "dashboard",
      "create",
      "settings",
      "history",
      "login",
      "about",
      "services",
      "faqs",
      "terms",
      "contact",
      "terms-conditions",
      "privacy-notice",
    ];

    if (validPages.includes(path)) {
      setCurrentPage(path);
    } else {
      setCurrentPage("landing");
    }
  }, [location.pathname]);

  const handlePageChange = (page: string) => {
    if (
      !authState.isAuthenticated &&
      page !== "landing" &&
      !publicRoutes().includes(page)
    ) {
      navigate("/login");
      return;
    }
    navigate(page === "landing" ? "/" : `/${page}`);
  };

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    if (authState.isLoading) return;

    if (isLoginPage && authState.isAuthenticated) {
      document.title = `${t("navigation.dashboard")} - ${t(
        "navigation.invoiceBuilder"
      )}`;
      navigate("/dashboard");
      return;
    }

    if (!isLoginPage && !authState.isAuthenticated && !isPublicRoute()) {
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
    t,
    isPublicRoute,
  ]);

  useEffect(() => {
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
      about: "About Us - " + t("navigation.carRentalTitle"),
      services: "Services - " + t("navigation.carRentalTitle"),
      faqs: "FAQs - " + t("navigation.carRentalTitle"),
      terms: "Terms - " + t("navigation.carRentalTitle"),
      contact: "Contact - " + t("navigation.carRentalTitle"),
      "terms-conditions":
        "Terms & Conditions - " + t("navigation.carRentalTitle"),
      "privacy-notice": "Privacy Notice - " + t("navigation.carRentalTitle"),
    };

    const path = location.pathname.substring(1) || "landing";
    const pageKey = Object.keys(pageTitles).includes(path) ? path : "landing";

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isLoginPage && (
        <Navbar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLanding={location.pathname === "/"}
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
                    navigate("/dashboard");
                  }}
                />
              )
            }
          />

          {/* Dashboard routes */}
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

          <Route
            path="/update-cars"
            element={
              authState.isLoading ? (
                <Loader fullScreen size="xl" />
              ) : authState.isAuthenticated ? (
                <UpdateCars />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Landing page routes */}
          <Route
            path="/"
            element={
              <LandingPage onCarSelect={(car: Car) => setSelectedCar(car)} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-notice" element={<PrivacyNotice />} />

          {/* Car details route */}
          <Route
            path="/car/:id"
            element={
              selectedCar ? (
                <CarDetails
                  car={selectedCar}
                  onClose={() => setSelectedCar(null)}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isLoginPage &&
        (authState.isAuthenticated
          ? location.pathname === "/" ||
            location.pathname.startsWith("/about") ||
            location.pathname.startsWith("/services") ||
            location.pathname.startsWith("/faqs") ||
            location.pathname.startsWith("/terms") ||
            location.pathname.startsWith("/contact") ||
            location.pathname.startsWith("/terms-conditions") ||
            location.pathname.startsWith("/privacy-notice")
          : !authState.isAuthenticated) && <Footer />}
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
