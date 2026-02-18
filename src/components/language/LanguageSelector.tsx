import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/i18n";

export function LanguageSelector({ variant = "default" }: { variant?: "default" | "compact" | "minimal" }) {
  const { language, setLanguage, isRTL, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (code: typeof language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Compact version for mobile/navbar
  if (variant === "compact") {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/80"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="text-xs font-medium uppercase">{currentLanguage.code}</span>
        </button>

        {isOpen && (
          <div 
            className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-44 py-1.5 rounded-xl border border-white/10 bg-[#0B1026]/95 backdrop-blur-xl shadow-2xl z-50`}
            role="listbox"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors ${
                  language === lang.code ? "text-white" : "text-white/60"
                }`}
                role="option"
                aria-selected={language === lang.code}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-sm">{lang.nativeName}</span>
                {language === lang.code && <Check size={14} className="text-[#D6AC54]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Minimal version - just a button that cycles through languages
  if (variant === "minimal") {
    return (
      <button
        type="button"
        onClick={() => {
          const currentIndex = LANGUAGES.findIndex((l) => l.code === language);
          const nextIndex = (currentIndex + 1) % LANGUAGES.length;
          setLanguage(LANGUAGES[nextIndex].code);
        }}
        className="flex items-center gap-1.5 h-8 w-8 justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/80"
        title={currentLanguage.nativeName}
      >
        <span className="text-base">{currentLanguage.flag}</span>
      </button>
    );
  }

  // Default version with full dropdown
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/80 group"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={16} className="text-white/50 group-hover:text-white/70 transition-colors" />
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown 
          size={14} 
          className={`text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-52 py-2 rounded-xl border border-white/10 bg-[#0B1026]/95 backdrop-blur-xl shadow-2xl z-50`}
          role="listbox"
        >
          <div className="px-3 pb-2 mb-1 border-b border-white/10">
            <span className="text-[10px] tracking-wider uppercase text-white/40 font-mono">
              Select Language
            </span>
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${
                language === lang.code ? "text-white bg-white/[0.03]" : "text-white/60"
              }`}
              role="option"
              aria-selected={language === lang.code}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1 text-sm">{lang.nativeName}</span>
              {language === lang.code && <Check size={14} className="text-[#D6AC54]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
