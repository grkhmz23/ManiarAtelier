import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import type { Language } from "./types";
import { LANGUAGES, DEFAULT_LANGUAGE, getLanguageConfig, isRTL } from "./types";
import { getTranslations, type Translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRTL: boolean;
  dir: "ltr" | "rtl";
  languages: typeof LANGUAGES;
  currentLanguage: typeof LANGUAGES[0];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "maniar-language";

function getInitialLanguage(): Language {
  // Check localStorage first
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) {
      return stored;
    }
    
    // Check browser language
    const browserLang = navigator.language.split("-")[0] as Language;
    if (LANGUAGES.some((l) => l.code === browserLang)) {
      return browserLang;
    }
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
      // Update document direction for RTL support
      document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const currentIndex = LANGUAGES.findIndex((l) => l.code === language);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex].code);
  }, [language, setLanguage]);

  // Initialize document direction on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.dir = isRTL(language) ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useMemo(() => getTranslations(language), [language]);
  const currentLanguage = useMemo(() => getLanguageConfig(language), [language]);
  const rtl = useMemo(() => isRTL(language), [language]);
  const dir = useMemo<"ltr" | "rtl">(() => (rtl ? "rtl" : "ltr"), [rtl]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      isRTL: rtl,
      dir,
      languages: LANGUAGES,
      currentLanguage,
    }),
    [language, setLanguage, toggleLanguage, t, rtl, dir, currentLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Hook for just translations (simpler usage)
export function useTranslation(): Translations {
  return useLanguage().t;
}
