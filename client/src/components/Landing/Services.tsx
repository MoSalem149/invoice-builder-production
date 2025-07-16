import React from "react";
import { Wrench, Car, ShieldCheck, CreditCard, Clock } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const Services: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const services = [
    {
      icon: <Car className="h-8 w-8" />,
      title: t("services.vehicleSales"),
      description: t("services.vehicleSalesText"),
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: t("services.maintenance"),
      description: t("services.maintenanceText"),
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: t("services.warranties"),
      description: t("services.warrantiesText"),
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: t("services.financing"),
      description: t("services.financingText"),
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: t("services.roadsideAssistance"),
      description: t("services.roadsideAssistanceText"),
    },
  ];

  return (
    <div
      className={`container mx-auto px-4 py-8 mt-20 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl font-bold mb-8">{t("services.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className={`flex items-center mb-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`bg-blue-100 p-2 rounded-full ${
                  isRTL ? "ml-4" : "mr-4"
                }`}
              >
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold">{service.title}</h2>
            </div>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
