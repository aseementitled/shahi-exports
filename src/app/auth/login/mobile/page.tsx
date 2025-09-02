'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MobileLoginPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpError, setOtpError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  // Hardcoded data as per requirements
  const hardcodedData = {
    name: 'aseem',
    mobile: '8077319041',
    employeeId: 'EMP123'
  };

  const handleMobileSubmit = () => {
    if (!mobileNumber.trim()) return;
    
    setIsFetching(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setFetchedData(hardcodedData);
      setIsFetching(false);
      setShowOTP(true);
    }, 3000);
  };

  const handleOTPSubmit = () => {
    if (!otp.trim() || otp.length !== 6) return;
    
    setIsVerifyingOTP(true);
    setOtpError('');
    
    // Simulate OTP verification
    setTimeout(() => {
      if (otp === '123456') {
        // OTP is correct
        setIsVerifyingOTP(false);
        handleLogin();
      } else {
        // OTP is incorrect
        setIsVerifyingOTP(false);
        setOtpError(t('invalidOTP', 'login') as string);
      }
    }, 2000);
  };

  const handleLogin = () => {
    // Get existing user data
    const existingUserData = localStorage.getItem('userData');
    if (existingUserData) {
      const userData = JSON.parse(existingUserData);
      
      // Update login method and timestamp
      const updatedUserData = {
        ...userData,
        lastLoginMethod: 'mobile',
        lastLoginDate: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // For returning users, check KYC status and go to appropriate next step
      const kycData = localStorage.getItem('kycData');
      if (kycData) {
        const parsedKycData = JSON.parse(kycData);
        if (parsedKycData.isVerified) {
          // KYC already complete, go to services
          router.push('/services');
        } else {
          // KYC not complete, go to document collection
          router.push('/kyc/collect/pan');
        }
      } else {
        // No KYC data, go to document collection
        router.push('/kyc/collect/pan');
      }
    }
  };

  const resetFlow = () => {
    setMobileNumber('');
    setFetchedData(null);
    setIsFetching(false);
    setShowOTP(false);
    setOtp('');
    setIsVerifyingOTP(false);
    setOtpError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            {t('enterMobile', 'login')}
          </h1>
          <p className="text-gray-800">
            {t('loginWithMobile', 'login')}
          </p>
        </div>

        {!showOTP ? (
          <div className="space-y-6">
            {!isFetching ? (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('mobileNumber', 'login')}
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-600"
                    placeholder={t('mobilePlaceholder', 'login') as string}
                    maxLength={10}
                  />
                </div>

                <button
                  onClick={handleMobileSubmit}
                  disabled={!mobileNumber.trim() || mobileNumber.length !== 10}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {t('sendOTP', 'login')}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {t('verifyingAccount', 'login')}
                </h3>
                <p className="text-gray-800 mb-4">
                  {t('verifyingSubtitle', 'login')}
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• {t('searchingDatabase', 'login')}</p>
                  <p>• {t('verifyingMobile', 'login')}</p>
                  <p>• {t('loadingAccount', 'login')}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('enterOTP', 'login')}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-600 text-center text-2xl tracking-widest"
                placeholder={t('otpPlaceholder', 'login') as string}
                maxLength={6}
              />
              {otpError && (
                <p className="text-red-600 text-sm mt-2">{otpError}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleOTPSubmit}
                disabled={!otp.trim() || otp.length !== 6 || isVerifyingOTP}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isVerifyingOTP ? t('verifyingAccount', 'login') : t('verifyOTP', 'login')}
              </button>
              
              <button
                onClick={resetFlow}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                {t('resendOTP', 'login')}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {t('backToOptions', 'login')}
          </button>
        </div>
      </div>
    </div>
  );
}
