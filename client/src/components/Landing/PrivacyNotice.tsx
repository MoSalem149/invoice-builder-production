// components/Landing/PrivacyNotice.tsx
import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

const PrivacyNotice: React.FC = () => {
  const { t } = useContext(LanguageContext)!;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">{t("privacy.title")}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t("privacy.informationWeCollect")}
        </h2>
        <p className="mb-6">{t("privacy.informationWeCollectText")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("privacy.howWeUse")}</h2>
        <p className="mb-6">{t("privacy.howWeUseText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("privacy.dataSharing")}
        </h2>
        <p className="mb-6">{t("privacy.dataSharingText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("privacy.dataSecurity")}
        </h2>
        <p className="mb-6">{t("privacy.dataSecurityText")}</p>

        <h2 className="text-2xl font-semibold mb-4">
          {t("privacy.yourRights")}
        </h2>
        <p className="mb-6">{t("privacy.yourRightsText")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("privacy.cookies")}</h2>
        <p className="mb-6">{t("privacy.cookiesText")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("privacy.changes")}</h2>
        <p>{t("privacy.changesText")}</p>
      </div>
    </div>
  );
};

export default PrivacyNotice;
