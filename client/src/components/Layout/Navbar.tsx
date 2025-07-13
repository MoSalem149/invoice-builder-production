// components/Layout/Navbar.tsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  Home,
  // Settings,
  History,
  Plus,
  LogOut,
  User,
  Menu,
  X,
  Info,
  Wrench,
  HelpCircle,
  FileText as TermsIcon,
  Phone,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isLanding: boolean;
}

interface AuthNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NonAuthNavItem extends AuthNavItem {
  path: string;
}

type NavItem = AuthNavItem | NonAuthNavItem;

const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onPageChange,
  isLanding,
}) => {
  const { t, isRTL } = useLanguage();
  const { state: authState, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavItems = () => {
    if (authState.isAuthenticated) {
      // For authenticated users, show admin links unless they're on landing pages
      if (
        isLanding ||
        location.pathname.startsWith("/about") ||
        location.pathname.startsWith("/services") ||
        location.pathname.startsWith("/faqs") ||
        location.pathname.startsWith("/terms") ||
        location.pathname.startsWith("/contact")
      ) {
        return [
          { id: "landing", label: "Home", icon: Home, path: "/" },
          { id: "about", label: "About", icon: Info, path: "/about" },
          {
            id: "services",
            label: "Services",
            icon: Wrench,
            path: "/services",
          },
          { id: "faqs", label: "FAQs", icon: HelpCircle, path: "/faqs" },
          { id: "terms", label: "Terms", icon: TermsIcon, path: "/terms" },
          { id: "contact", label: "Contact", icon: Phone, path: "/contact" },
        ];
      }
      return [
        { id: "dashboard", label: t("navigation.dashboard"), icon: Home },
        { id: "create", label: t("navigation.create"), icon: Plus },
        // { id: "settings", label: t("navigation.settings"), icon: Settings },
        { id: "history", label: t("navigation.history"), icon: History },
      ];
    }
    // For non-authenticated users, always show landing page links
    return [
      { id: "landing", label: "Home", icon: Home, path: "/" },
      { id: "about", label: "About", icon: Info, path: "/about" },
      { id: "services", label: "Services", icon: Wrench, path: "/services" },
      { id: "faqs", label: "FAQs", icon: HelpCircle, path: "/faqs" },
      { id: "terms", label: "Terms", icon: TermsIcon, path: "/terms" },
      { id: "contact", label: "Contact", icon: Phone, path: "/contact" },
    ];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    onPageChange("landing");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (item: NavItem) => {
    if ("path" in item) {
      return location.pathname === item.path;
    }
    return currentPage === item.id;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center h-16 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Logo/Brand */}
          <div
            className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <button
              onClick={() =>
                onPageChange(
                  authState.isAuthenticated && !isLanding
                    ? "dashboard"
                    : "landing"
                )
              }
              className="flex items-center focus:outline-none"
            >
              <FileText
                className={`h-8 w-8 text-gray-800 ${isRTL ? "ml-3" : "mr-3"}`}
              />
              <span className="text-xl font-semibold text-gray-800">
                {isLanding
                  ? t("navigation.carRentalTitle")
                  : authState.isAuthenticated
                  ? t("navigation.invoiceBuilder")
                  : t("navigation.carRentalTitle")}{" "}
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div
              className={`flex items-center space-x-4 ${
                isRTL ? "space-x-reverse" : ""
              }`}
            >
              <div className="flex items-center space-x-6">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={"path" in item ? item.path : `/${item.id}`}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                        isRTL ? "flex-row-reverse" : ""
                      } ${
                        isActive(item)
                          ? "text-gray-900 bg-gray-100"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Auth Buttons */}
              {authState.isAuthenticated && (
                <div
                  className={`flex items-center space-x-2 ${
                    isRTL ? "space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 ${
                      isRTL ? "space-x-reverse flex-row-reverse" : ""
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {authState.user?.name || t("auth.user")}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ${
                      isRTL ? "space-x-reverse flex-row-reverse" : ""
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("auth.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button - always visible */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - always available */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                to={"path" in item ? item.path : `/${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md ${
                  isRTL ? "flex-row-reverse" : ""
                } ${
                  isActive(item)
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {IconComponent && (
                  <IconComponent
                    className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                  />
                )}
                {item.label}
              </Link>
            );
          })}

          {/* Mobile Auth Buttons */}
          {authState.isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-3">
                <div
                  className={`flex items-center px-3 py-2 text-base font-medium text-gray-600 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                    {authState.user?.name || t("auth.user")}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ${
                    isRTL ? "space-x-reverse flex-row-reverse" : ""
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("auth.logout")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
