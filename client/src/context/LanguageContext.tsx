import React, { createContext, ReactNode, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import it from "../locales/it.json";
import en from "../locales/en.json";
import de from "../locales/de.json";
import ar from "../locales/ar.json";

const translations = {
  it,
  en,
  de,
  ar,
} as const;

type Language = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

type NestedTranslation = {
  [key: string]: NestedTranslation | string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useLocalStorage<Language>("language", "it");

  const isRTL = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const getNestedTranslation = (
    obj: NestedTranslation,
    keys: string[]
  ): string | undefined => {
    let current: NestedTranslation | string = obj;
    for (const key of keys) {
      if (typeof current === "object" && current !== null && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return typeof current === "string" ? current : undefined;
  };

  const t = (key: string): string => {
    const keys = key.split(".");

    const currentLangTranslation = getNestedTranslation(
      translations[language] as NestedTranslation,
      keys
    );
    if (currentLangTranslation) return currentLangTranslation;

    const fallbackTranslation = getNestedTranslation(
      translations.en as NestedTranslation,
      keys
    );
    return fallbackTranslation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext };
