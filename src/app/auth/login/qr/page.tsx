'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QRLoginPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
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
      setIsScanning(false);
      
      // Automatically redirect after scanning
      setTimeout(() => {
        handleLogin();
      }, 1000);
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
        lastLoginMethod: 'qr',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            {t('scanQRCode', 'login')}
          </h1>
          <p className="text-gray-800">
            {t('quickLoginQR', 'login')}
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
                  {t('scanQRCode', 'login')}
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
                <p className="text-blue-600 font-medium">{t('verifyingAccount', 'login')}</p>
                <p className="text-sm text-gray-700 mt-2">{t('verifyingSubtitle', 'login')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 font-medium">Redirecting...</p>
            <p className="text-sm text-gray-700 mt-2">Please wait while we redirect you</p>
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
