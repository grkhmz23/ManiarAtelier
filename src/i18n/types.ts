export type Language = "en" | "it" | "de" | "ar" | "es" | "fr";

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr", isRTL: false },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", dir: "ltr", isRTL: false },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr", isRTL: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl", isRTL: true },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr", isRTL: false },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr", isRTL: false },
];

export const DEFAULT_LANGUAGE: Language = "en";

export function getLanguageConfig(code: Language): LanguageConfig {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

export function isRTL(code: Language): boolean {
  return getLanguageConfig(code).isRTL;
}
