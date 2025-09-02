'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QRRegistrationPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: '',
    employeeId: '',
    gender: ''
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  // Hardcoded data as per requirements
  const hardcodedData = {
    name: 'aseem',
    mobile: '8077319041',
    employeeId: 'EMP123'
  };

  const startScanning = () => {
    setIsScanning(true);
    
    // Simulate QR code scanning with hardcoded data
    setTimeout(() => {
      setScannedData(hardcodedData);
      setUserDetails(prev => ({
        ...prev,
        name: hardcodedData.name,
        mobile: hardcodedData.mobile,
        employeeId: hardcodedData.employeeId
      }));
      setIsScanning(false);
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
      registrationMethod: 'qr',
      registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Navigate to document collection
    router.push('/kyc/collect/pan');
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

        {!scannedData ? (
          <div className="text-center">
            {!isScanning ? (
              <div>
                <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <button
                  onClick={startScanning}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t('fetchInformation', 'mobileRegistration')}
                </button>
              </div>
            ) : (
              <div>
                <div className="w-48 h-48 bg-blue-100 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <div className="animate-pulse">
                    <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <p className="text-blue-600 font-medium">{t('fetchingTitle', 'mobileRegistration')}</p>
                <p className="text-sm text-gray-700 mt-2">{t('fetchingSubtitle', 'mobileRegistration')}</p>
              </div>
            )}
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
