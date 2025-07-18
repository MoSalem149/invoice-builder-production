import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

const TermsConditions: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div
      className={`container mx-auto px-4 py-8 mt-20 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex items-center mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <h1 className="text-3xl font-bold">{t("terms.title")}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t("terms.introduction")}
        </h2>
        <p className="mb-6">{t("terms.introductionText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("terms.useOfWebsite")}
        </h2>
        <p className="mb-6">{t("terms.useOfWebsiteText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("terms.intellectualProperty")}
        </h2>
        <p className="mb-6">{t("terms.intellectualPropertyText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("terms.vehicleListings")}
        </h2>
        <p className="mb-6">{t("terms.vehicleListingsText")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("terms.liability")}</h2>
        <p className="mb-6">{t("terms.liabilityText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("terms.changesToTerms")}
        </h2>
        <p className="mb-6">{t("terms.changesToTermsText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("terms.governingLaw")}
        </h2>
        <p>{t("terms.governingLawText")}</p>
      </div>
    </div>
  );
};

export default TermsConditions;
