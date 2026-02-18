import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/i18n";

export function LanguageSelector({ variant = "default" }: { variant?: "default" | "compact" | "minimal" }) {
  const { language, setLanguage, isRTL, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: isRTL ? rect.left : 0,
        right: isRTL ? 0 : window.innerWidth - rect.right,
      });
    }
  }, [isOpen, isRTL]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleSelect = (code: typeof language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const renderDropdown = () => {
    if (!isOpen || !mounted) return null;

    const dropdownContent = (
      <div 
        className="fixed py-1.5 rounded-xl border border-white/10 bg-[#0B1026] shadow-2xl"
        style={{
          top: `${dropdownPos.top}px`,
          left: isRTL ? `${dropdownPos.left}px` : 'auto',
          right: isRTL ? 'auto' : `${dropdownPos.right}px`,
          width: variant === 'compact' ? '11rem' : '13rem',
          zIndex: 99999,
        }}
        role="listbox"
      >
        {variant === 'default' && (
          <div className="px-3 pb-2 mb-1 border-b border-white/10">
            <span className="text-[10px] tracking-wider uppercase text-white/40 font-mono">
              Select Language
            </span>
          </div>
        )}
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
    );

    return createPortal(dropdownContent, document.body);
  };

  // Compact version for mobile/navbar
  if (variant === "compact") {
    return (
      <div ref={containerRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/80"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="text-xs font-medium uppercase">{currentLanguage.code}</span>
        </button>
        {renderDropdown()}
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
        ref={buttonRef}
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
      {renderDropdown()}
    </div>
  );
}

export default LanguageSelector;
