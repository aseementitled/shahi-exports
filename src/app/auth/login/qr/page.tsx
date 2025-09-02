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
      
      // Navigate to services page
      router.push('/services');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Login with QR Code
          </h1>
          <p className="text-gray-600">
            Scan your employee QR code to login
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
                  Start Scanning
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
                <p className="text-blue-600 font-medium">Scanning QR Code...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we scan your QR code</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">Login Successful!</span>
              </div>
              <p className="text-sm text-green-700">
                Welcome back, {scannedData.name}!
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Your Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{scannedData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium">{scannedData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="font-medium">{scannedData.employeeId}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setScannedData(null);
                  setIsScanning(false);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Scan Again
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Options
          </button>
        </div>
      </div>
    </div>
  );
}
