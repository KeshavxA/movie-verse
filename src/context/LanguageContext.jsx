import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("movieverse_lang") || "en-US";
    } catch (error) {
      return "en-US";
    }
  });

  useEffect(() => {
    localStorage.setItem("movieverse_lang", lang);
    // Optionally update document lang attribute
    document.documentElement.lang = lang.split('-')[0];
  }, [lang]);

  const t = (key) => {
    // Fallback to English if translation is missing in the selected language
    return translations[lang]?.[key] || translations["en-US"]?.[key] || key;
  };

  const value = {
    lang,
    setLang,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
