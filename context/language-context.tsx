"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Language = "en" | "id";

interface LanguageContextProps {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const router = useRouter();

  // On mount, read language from cookie just to sync with client state
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )lang=([^;]*)/);
    const cookieLang = match ? (match[1] as Language) : null;
    if (cookieLang && (cookieLang === "en" || cookieLang === "id")) {
      setLangState(cookieLang);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    // Write cookie that expires in 1 year
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh the router to fetch server components with the new cookie
    router.refresh();
  };

  const toggleLanguage = () => {
    const nextLang: Language = lang === "en" ? "id" : "en";
    setLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
