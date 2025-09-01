'use client';

import React from 'react';
import { useLanguage, SupportedLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const languages = [
    { code: 'en' as SupportedLanguage, name: 'English', nativeName: 'English' },
    { code: 'hi' as SupportedLanguage, name: 'Hindi', nativeName: 'हिंदी' }
  ];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t('chooseLanguage')}
      </label>
      <select 
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className={`border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium ${sizeClasses[size]} w-full`}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
