// components/Layout/Footer.tsx
import React from "react";
import { Mail, Phone } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-blue-300">
                  {t("navigation.home")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-300">
                  {t("navigation.about")}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-300">
                  {t("navigation.services")}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-blue-300">
                  {t("navigation.faqs")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-300">
                  {t("navigation.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Brands Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.ourBrands")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-300">
                  Toyota
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Porsche
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Audi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  BMW
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Ford
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Nissan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Peugeot
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Volkswagen
                </a>
              </li>
            </ul>
          </div>

          {/* Vehicles Type Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {t("footer.vehiclesType")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-300">
                  {t("dashboard.category.Sedan")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  {t("dashboard.category.Hatchback")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  {t("dashboard.category.SUV")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  {t("dashboard.category.Hybrid")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  {t("dashboard.fuelType.Electric")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  {t("dashboard.category.Coupe")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.contact")}</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+41919292929" className="hover:text-blue-300">
                  +41 91 929 29 29
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a
                  href="mailto:info@saidauto.ch"
                  className="hover:text-blue-300"
                >
                  info@saidauto.ch
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  {t("footer.connectWithUs")}
                </h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-300">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-blue-300">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-blue-300">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-blue-300">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Bottom Links */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </div>
            <div className="flex space-x-4 text-gray-400 text-sm">
              <Link to="/terms-conditions" className="hover:text-blue-300">
                {t("terms.title")}
              </Link>
              <Link to="/privacy-notice" className="hover:text-blue-300">
                {t("privacy.title")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
