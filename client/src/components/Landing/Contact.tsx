// components/Landing/Contact.tsx
import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8">{t("contact.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {t("contact.getInTouch")}
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">{t("contact.address")}</h3>
                <p className="text-gray-600">
                  Via S.Gottardo 100, 6596 Gordola, Switzerland
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">{t("contact.phone")}</h3>
                <p className="text-gray-600">+41 91 929 29 29</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">{t("contact.email")}</h3>
                <p className="text-gray-600">info@saidauto.ch</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">{t("contact.businessHours")}</h3>
                <p className="text-gray-600">
                  {t("contact.mondayFriday")}: 9:00 AM - 6:00 PM
                  <br />
                  {t("contact.saturday")}: 9:00 AM - 4:00 PM
                  <br />
                  {t("contact.sunday")}: {t("contact.closed")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
