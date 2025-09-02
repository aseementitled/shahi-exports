'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MobileRegistrationPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: '',
    employeeId: '',
    gender: ''
  });
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
    
    // Simulate sending OTP first
    setTimeout(() => {
      setIsFetching(false);
      setShowOTP(true);
    }, 2000);
  };

  const handleOTPSubmit = () => {
    if (!otp.trim() || otp.length !== 6) return;
    
    setIsVerifyingOTP(true);
    setOtpError('');
    
    // Simulate OTP verification
    setTimeout(() => {
      if (otp === '123456') {
        // OTP verified, now fetch user data
        setFetchedData(hardcodedData);
        setUserDetails(prev => ({
          ...prev,
          name: hardcodedData.name,
          mobile: hardcodedData.mobile,
          employeeId: hardcodedData.employeeId
        }));
        setShowOTP(false);
      } else {
        setOtpError(t('invalidOTP', 'login') as string);
      }
      setIsVerifyingOTP(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Save user data to localStorage
    const userData = {
      ...userDetails,
      isRegistered: true,
      registrationMethod: 'mobile',
      registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Navigate to document collection
    router.push('/kyc/collect/pan');
  };

  const resetFlow = () => {
    setMobileNumber('');
    setFetchedData(null);
    setShowOTP(false);
    setOtp('');
    setOtpError('');
    setUserDetails({ name: '', mobile: '', employeeId: '', gender: '' });
    setIsFetching(false);
    setIsVerifyingOTP(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            {t('title', 'mobileRegistration')}
          </h1>
          <p className="text-gray-800">
            {t('subtitle', 'mobileRegistration')}
          </p>
        </div>

        {!fetchedData ? (
          <div className="space-y-6">
            {!isFetching && !showOTP ? (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('mobileNumberLabel', 'mobileRegistration')}
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-600"
                    placeholder={t('mobileNumberPlaceholder', 'mobileRegistration') as string}
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
            ) : isFetching ? (
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
            ) : showOTP ? (
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
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">{t('nameLabel', 'mobileRegistration')}</label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-600"
                    placeholder={t('namePlaceholder', 'mobileRegistration') as string}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">{t('mobileLabel', 'mobileRegistration')}</label>
                  <input
                    type="tel"
                    value={userDetails.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-600"
                    placeholder={t('mobilePlaceholder', 'mobileRegistration') as string}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">{t('employeeIdLabel', 'mobileRegistration')}</label>
                  <input
                    type="text"
                    value={userDetails.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-600"
                    placeholder={t('employeeIdPlaceholder', 'mobileRegistration') as string}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">{t('genderLabel', 'mobileRegistration')}</label>
                  <select
                    value={userDetails.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="">{t('genderPlaceholder', 'mobileRegistration')}</option>
                    <option value="male">{t('male', 'mobileRegistration')}</option>
                    <option value="female">{t('female', 'mobileRegistration')}</option>
                    <option value="other">{t('other', 'mobileRegistration')}</option>
                  </select>
                </div>
              </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={!userDetails.name || !userDetails.mobile || !userDetails.employeeId || !userDetails.gender}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t('continue', 'common')}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {t('backToOptions', 'mobileRegistration')}
          </button>
        </div>
      </div>
    </div>
  );
}
