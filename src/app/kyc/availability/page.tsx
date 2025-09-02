'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function KYCAvailabilityPage() {
  const [hasPan, setHasPan] = useState<string>('');
  const [hasAadhaar, setHasAadhaar] = useState<string>('');
  const [hasBothNow, setHasBothNow] = useState<string>('');
  const [showNextStep, setShowNextStep] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleContinue = () => {
    if (hasPan === 'yes' && hasAadhaar === 'yes' && hasBothNow === 'yes') {
      // Save KYC availability status
      const kycStatus = {
        hasPan: hasPan === 'yes',
        hasAadhaar: hasAadhaar === 'yes',
        hasBothNow: hasBothNow === 'yes',
        canProceed: true
      };
      localStorage.setItem('kycAvailability', JSON.stringify(kycStatus));
      
      // Navigate to document capture
      router.push('/kyc/documents');
    } else {
      // Show message to complete later
      setShowNextStep(true);
    }
  };

  const handleCompleteLater = () => {
    // Save partial KYC status
    const kycStatus = {
      hasPan: hasPan === 'yes',
      hasAadhaar: hasAadhaar === 'yes',
      hasBothNow: hasBothNow === 'yes',
      canProceed: false
    };
    localStorage.setItem('kycAvailability', JSON.stringify(kycStatus));
    
    // Navigate to services (with KYC incomplete)
    router.push('/services');
  };

  const canProceed = hasPan === 'yes' && hasAadhaar === 'yes' && hasBothNow === 'yes';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Document Check
          </h1>
          <p className="text-gray-800">
            Let's check what documents you have available
          </p>
        </div>

        {!showNextStep ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  Do you have a PAN Card?
                </h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setHasPan('yes')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                      hasPan === 'yes'
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setHasPan('no')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                      hasPan === 'no'
                        ? 'bg-red-100 text-red-800 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  Do you have an Aadhaar Card?
                </h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setHasAadhaar('yes')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                      hasAadhaar === 'yes'
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setHasAadhaar('no')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                      hasAadhaar === 'no'
                        ? 'bg-red-100 text-red-800 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {hasPan === 'yes' && hasAadhaar === 'yes' && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">
                    Are both documents with you now?
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setHasBothNow('yes')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                        hasBothNow === 'yes'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setHasBothNow('no')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                        hasBothNow === 'no'
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              {canProceed ? (
                <button
                  onClick={handleContinue}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue with Documents
                </button>
              ) : (
                <button
                  onClick={handleCompleteLater}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                >
                  Complete Later
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Complete KYC Later
              </h3>
              <p className="text-gray-800 mb-4">
                No problem! You can complete your KYC verification when you have your documents ready.
              </p>
              <p className="text-sm text-gray-700">
                You can still explore our services, but some features will require KYC completion.
              </p>
            </div>

            <button
              onClick={handleCompleteLater}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Services
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
}
