// components/Landing/About.tsx
import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">{t("about.title")}</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">{t("about.ourStory")}</h2>
        <p className="mb-4">{t("about.storyText")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("about.ourMission")}</h2>
        <p className="mb-4">{t("about.missionText")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("about.ourTeam")}</h2>
        <p>{t("about.teamText")}</p>
      </div>
    </div>
  );
};

export default About;
