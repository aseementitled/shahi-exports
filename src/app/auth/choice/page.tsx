'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AuthChoicePage() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is already registered
    const userData = localStorage.getItem('userData');
    const isRegistered = userData && JSON.parse(userData).isRegistered;
    setIsFirstTime(!isRegistered);
  }, []);

  const handleRegistrationChoice = (method: 'qr' | 'mobile') => {
    if (method === 'qr') {
      router.push('/auth/register/qr');
    } else {
      router.push('/auth/register/mobile');
    }
  };

  const handleLoginChoice = (method: 'qr' | 'mobile') => {
    if (method === 'qr') {
      router.push('/auth/login/qr');
    } else {
      router.push('/auth/login/mobile');
    }
  };

  if (isFirstTime === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            {isFirstTime ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-800">
            {isFirstTime 
              ? 'Choose how you want to register' 
              : 'Choose how you want to login'
            }
          </p>
        </div>

        <div className="space-y-4">
          {/* QR Code Option */}
          <button
            onClick={() => isFirstTime ? handleRegistrationChoice('qr') : handleLoginChoice('qr')}
            className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg text-black">Scan QR Code</div>
                <div className="text-sm text-gray-700">
                  {isFirstTime ? 'Quick registration with QR code' : 'Quick login with QR code'}
                </div>
              </div>
            </div>
          </button>

          {/* Mobile Number Option */}
          <button
            onClick={() => isFirstTime ? handleRegistrationChoice('mobile') : handleLoginChoice('mobile')}
            className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg text-black">Mobile Number</div>
                <div className="text-sm text-gray-700">
                  {isFirstTime ? 'Register with mobile number' : 'Login with mobile number'}
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/language')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Change Language
          </button>
        </div>
      </div>
    </div>
  );
}
