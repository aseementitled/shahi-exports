'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../../components/LanguageSelector';

interface KYCData {
  name: string;
  mobile: string;
  gender: string;
  pancard: File | null;
  adhaar: File | null;
  selfie: string | null;
  otp: string;
  isVerified: boolean;
  missingDocuments?: string[];
}



// Helper function to determine missing documents
const getMissingDocuments = (kyc: any): string[] => {
  const missing: string[] = [];
  
  // Check if PAN document exists and is uploaded (and not skipped)
  if ((!kyc.panDocument || kyc.panDocument === null || kyc.panDocument === '') && !kyc.panSkipped) {
    missing.push('PAN Card');
  }
  
  // Check if Aadhaar document exists and is uploaded (and not skipped)
  if ((!kyc.aadhaarDocument || kyc.aadhaarDocument === null || kyc.aadhaarDocument === '') && !kyc.aadhaarSkipped) {
    missing.push('Aadhaar Card');
  }
  
  // Check if selfie document exists and is uploaded (selfie cannot be skipped)
  if (!kyc.selfieDocument || kyc.selfieDocument === null || kyc.selfieDocument === '') {
    missing.push('Live selfie verification');
  }
  
  return missing;
};

export default function ServicesPage() {
  const [kycData, setKYCData] = useState<KYCData | null>(null);
  const [hasExistingLoan, setHasExistingLoan] = useState(false);
  const [hasExistingEWA, setHasExistingEWA] = useState(false);
  const [loanStatus, setLoanStatus] = useState<string | null>(null);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [isCallbackLoading, setIsCallbackLoading] = useState(false);
  const router = useRouter();
  const { currentLanguage, t } = useLanguage();

  // Load KYC data and check for existing applications
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const kycData = localStorage.getItem('kycData');
    const savedLoan = localStorage.getItem('loanApplication');
    const savedEWA = localStorage.getItem('ewaApplication');

    // Check if user is registered
    if (!userData) {
      router.push('/auth/choice');
      return;
    }

    // Check actual KYC data
    if (kycData) {
      try {
        const kyc = JSON.parse(kycData);
        console.log('KYC Data:', kyc); // Debug log
        console.log('isVerified:', kyc.isVerified); // Debug log
        
        // Check if all required documents are present (ignore isVerified flag)
        const missingDocs = getMissingDocuments(kyc);
        console.log('Missing documents:', missingDocs); // Debug log
        
        if (missingDocs.length === 0) {
          // All documents present, KYC complete
          setKYCData({ isVerified: true } as KYCData);
        } else {
          // KYC incomplete, show nudge with missing documents
          setKYCData({ 
            isVerified: false,
            missingDocuments: missingDocs
          } as KYCData);
        }
      } catch (error) {
        console.error('Error parsing KYC data:', error);
        setKYCData({ 
          isVerified: false,
          missingDocuments: ['PAN Card', 'Aadhaar Card', 'Live selfie verification']
        } as KYCData);
      }
    } else {
      // No KYC data, show nudge with all documents needed
      console.log('No KYC data found'); // Debug log
      setKYCData({ 
        isVerified: false,
        missingDocuments: ['PAN Card', 'Aadhaar Card', 'Live selfie verification']
      } as KYCData);
    }

    // Check for existing applications
    if (savedLoan) {
      try {
        const loanData = JSON.parse(savedLoan);
        setHasExistingLoan(loanData.status !== 'completed');
        setLoanStatus(loanData.status);
      } catch (error) {
        console.error('Error parsing loan data:', error);
      }
    }

    if (savedEWA) {
      try {
        const ewaData = JSON.parse(savedEWA);
        // EWA applications are always active once created, so we check if they exist
        setHasExistingEWA(true);
      } catch (error) {
        console.error('Error parsing EWA data:', error);
      }
    }
  }, [router]);



  const handleServiceSelect = (service: 'loan' | 'ewa') => {
    if (service === 'loan') {
      if (hasExistingLoan) {
        // Check if loan is disbursed
        if (loanStatus === 'disbursed') {
          router.push('/loan/disbursement');
        } else {
          router.push('/loan/continue');
        }
      } else {
        router.push('/loan/new');
      }
    } else if (service === 'ewa') {
      if (hasExistingEWA) {
        router.push('/ewa/dashboard');
      } else {
        router.push('/ewa/new');
      }
    }
  };

  const handleCallbackRequest = async () => {
    setIsCallbackLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsCallbackLoading(false);
      setShowCallbackModal(true);
    }, 1000);
  };

  if (!kycData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show KYC completion nudge if KYC is incomplete
  if (!kycData.isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Complete Basic KYC First
          </h1>
          
          <p className="text-gray-600 mb-6">
            To access our loan and salary advance services, you need to complete your KYC verification first.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">{t('whatYouStillNeed', 'kyc')}</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              {kycData.missingDocuments?.map((doc, index) => (
                <li key={index}>• {doc}</li>
              ))}
            </ul>
          </div>
          
          <button
            onClick={() => {
              // Determine which document to start with based on what's missing
              const missingDocs = kycData.missingDocuments || [];
              if (missingDocs.includes('PAN Card')) {
                router.push('/kyc/collect/pan');
              } else if (missingDocs.includes('Aadhaar Card')) {
                router.push('/kyc/collect/aadhaar');
              } else if (missingDocs.includes('Live selfie verification')) {
                router.push('/kyc/collect/selfie');
              } else {
                router.push('/kyc/collect/pan');
              }
            }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            Complete KYC Now
          </button>
          
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-6 w-full">
        {/* Main Services Container */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          {/* Services Grid - Vertical Layout */}
          <div className="space-y-6 mb-8">
          {/* Loan Service */}
          <div id="loan-service-card" className="bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('loanService', 'services')}</h2>
                  {hasExistingLoan && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {t('inProgress', 'services')}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{t('loanDescription', 'services')}</p>
              
              {/* Show button only if not pending */}
              {loanStatus !== 'pending' && (
                <button
                  onClick={() => handleServiceSelect('loan')}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>
                    {loanStatus === 'disbursed' 
                      ? 'View Disbursement Info' 
                      : hasExistingLoan 
                        ? t('continueApplication') 
                        : t('startApplication')
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Show pending message if status is pending */}
              {loanStatus === 'pending' && (
                <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 py-3 px-4 rounded-lg text-center">
                  <p className="text-sm">
                    {t('pendingStatusMessage', 'services')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* EWA Service */}
          <div id="ewa-service-card" className="bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('ewaService', 'services')}</h2>
                  {hasExistingEWA && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {t('active', 'services')}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{t('ewaDescription', 'services')}</p>
              
              <button
                onClick={() => handleServiceSelect('ewa')}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>{hasExistingEWA ? t('accessDashboard', 'services') : t('startApplication')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          </div>

          {/* Callback Request Button */}
          <div className="text-center mb-4">
            <button
              onClick={handleCallbackRequest}
              disabled={isCallbackLoading}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                isCallbackLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {isCallbackLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>{t('requestCallback', 'services')}</span>
                </>
              )}
            </button>
          </div>

          {/* Logout Button */}
          <div className="text-center">
            <button
              onClick={() => {
                // Redirect to language selection without clearing data
                router.push('/language');
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Callback Confirmation Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                {t('callbackRequested', 'services')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('callbackMessage', 'services')}
              </p>
              <button
                onClick={() => setShowCallbackModal(false)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
