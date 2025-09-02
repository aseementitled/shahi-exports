'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MobileLoginPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
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
    
    // Simulate fetching user data with loader
    setTimeout(() => {
      setFetchedData(hardcodedData);
      setIsFetching(false);
    }, 3000);
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
      
      // Navigate to services page
      router.push('/services');
    }
  };

  const resetFlow = () => {
    setMobileNumber('');
    setFetchedData(null);
    setIsFetching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Login with Mobile
          </h1>
          <p className="text-gray-600">
            Enter your mobile number to login
          </p>
        </div>

        {!fetchedData ? (
          <div className="space-y-6">
            {!isFetching ? (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your mobile number"
                    maxLength={10}
                  />
                </div>

                <button
                  onClick={handleMobileSubmit}
                  disabled={!mobileNumber.trim() || mobileNumber.length !== 10}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Verifying Your Account
                </h3>
                <p className="text-gray-600 mb-4">
                  Please wait while we verify your mobile number...
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Searching employee database</p>
                  <p>• Verifying mobile number</p>
                  <p>• Loading your account</p>
                </div>
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
                Welcome back, {fetchedData.name}!
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Your Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{fetchedData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium">{fetchedData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="font-medium">{fetchedData.employeeId}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetFlow}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Try Again
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
