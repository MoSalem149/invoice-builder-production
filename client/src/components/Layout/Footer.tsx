// components/Layout/Footer.tsx
import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Mail, Phone } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-2">
              {t("footer.companyName")}
            </h3>
            <p className="text-gray-400 mb-4">{t("footer.address")}</p>
          </div>

          {/* About Section */}
          <div>
            <h4 className="text-lg font-semibold mb-3">{t("footer.about")}</h4>
            <p className="text-gray-400">{t("footer.aboutText")}</p>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-3">
              {t("footer.contact")}
            </h4>
            <div className="space-y-2 text-gray-400">
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
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
