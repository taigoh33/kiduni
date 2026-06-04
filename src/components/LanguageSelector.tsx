
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'English' },
    { code: 'ms', label: 'Melayu' },
  ];

  return (
    <div className="flex bg-[#F5F2E8] rounded-full p-1 shadow-md border-2 border-brand-yellow-light">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLanguageChange(lang.code);
          }}
          className={`px-6 py-1.5 rounded-full font-bold text-sm md:text-base transition-all text-sharp ${
            currentLang === lang.code
              ? 'btn-3d-yellow text-[#8B771F] shadow-lg scale-105 active:translate-y-1'
              : 'bg-transparent text-brand-muted hover:text-[#8B771F] hover:scale-105'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
