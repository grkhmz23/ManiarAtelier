import type { Language } from "../types";

// Import all translations
import { en } from "./en";
import { it } from "./it";
import { de } from "./de";
import { ar } from "./ar";
import { es } from "./es";
import { fr } from "./fr";

// Define a recursive type that makes all values flexible
type DeepFlexible<T> = T extends (infer U)[] 
  ? DeepFlexible<U>[] 
  : T extends object 
    ? { [K in keyof T]: DeepFlexible<T[K]> } 
    : T;

// Export the flexible type
export type Translations = DeepFlexible<typeof en>;

export const translations: Record<Language, Translations> = {
  en: en as unknown as Translations,
  it: it as unknown as Translations,
  de: de as unknown as Translations,
  ar: ar as unknown as Translations,
  es: es as unknown as Translations,
  fr: fr as unknown as Translations,
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}
