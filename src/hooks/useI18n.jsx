import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, translate } from "../i18n/translations";
import { useLocalStorage } from "./useLocalStorage";

const I18nContext = createContext(null);

const supportedCodes = SUPPORTED_LANGUAGES.map((language) => language.code);

export function I18nProvider({ children }) {
  const [lang, setLangRaw] = useLocalStorage("lifepilot_lang", DEFAULT_LANGUAGE);

  // Guard against an unsupported value lingering in localStorage.
  const safeLang = supportedCodes.includes(lang) ? lang : DEFAULT_LANGUAGE;

  useEffect(() => {
    document.documentElement.setAttribute("lang", safeLang);
  }, [safeLang]);

  const setLang = useCallback(
    (next) => setLangRaw(supportedCodes.includes(next) ? next : DEFAULT_LANGUAGE),
    [setLangRaw]
  );

  const t = useCallback((key, vars) => translate(safeLang, key, vars), [safeLang]);

  const value = useMemo(
    () => ({ lang: safeLang, setLang, t, languages: SUPPORTED_LANGUAGES }),
    [safeLang, setLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
