"use client";

import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";
import { translations } from "@/constants/translations";

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  const { lang, toggleLanguage, setLanguage } = context;
  const t = translations[lang] || translations.en;

  return {
    t,
    lang,
    toggleLanguage,
    setLanguage,
  };
}
