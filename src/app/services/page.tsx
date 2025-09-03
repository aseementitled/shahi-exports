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
const getMissingDocuments = (kyc: any, language: string = 'en'): string[] => {
  const missing: string[] = [];
  
  // Check if PAN document exists and is uploaded (and not skipped)
  if ((!kyc.panDocument || kyc.panDocument === null || kyc.panDocument === '') && !kyc.panSkipped) {
    missing.push(language === 'hi' ? 'पैन कार्ड' : 'PAN Card');
  }
  
  // Check if Aadhaar document exists and is uploaded (and not skipped)
  if ((!kyc.aadhaarDocument || kyc.aadhaarDocument === null || kyc.aadhaarDocument === '') && !kyc.aadhaarSkipped) {
    missing.push(language === 'hi' ? 'आधार कार्ड' : 'Aadhaar Card');
  }
  
  // Check if selfie document exists and is uploaded (selfie cannot be skipped)
  if (!kyc.selfieDocument || kyc.selfieDocument === null || kyc.selfieDocument === '') {
    missing.push(language === 'hi' ? 'लाइव सेल्फी सत्यापन' : 'Live selfie verification');
  }
  
  return missing;
};

// Helper function to check if loan is in disbursement period
const isInDisbursementPeriod = (loanStatus: string | null, loanProgress: any): boolean => {
  // Debug logging
  console.log('Checking disbursement period:', {
    loanStatus,
    loanProgress,
    hasProgress: !!loanProgress,
    currentStep: loanProgress?.currentStep,
    completedSteps: loanProgress?.completedSteps,
    lastUpdated: loanProgress?.lastUpdated
  });
  
  // Only show disbursement message if:
  // 1. Status is 'approved' (not yet 'disbursed')
  // 2. Agreement has been completed (currentStep is 'completed' AND agreement is in completedSteps)
  // 3. Agreement was completed recently (within last 25 seconds to account for the 20-second disbursement delay)
  const now = new Date().getTime();
  const lastUpdated = loanProgress?.lastUpdated ? new Date(loanProgress.lastUpdated).getTime() : 0;
  const timeSinceCompletion = (now - lastUpdated) / 1000; // seconds
  
  const result = loanStatus === 'approved' && 
         loanProgress && 
         loanProgress.currentStep === 'completed' && 
         loanProgress.completedSteps && 
         Array.isArray(loanProgress.completedSteps) &&
         loanProgress.completedSteps.includes('agreement') &&
         timeSinceCompletion <= 25; // Only show for 25 seconds after agreement completion
  
  console.log('Disbursement period result:', result, 'Time since completion:', timeSinceCompletion);
  return result;
};

export default function ServicesPage() {
  const [kycData, setKYCData] = useState<KYCData | null>(null);
  const [hasExistingLoan, setHasExistingLoan] = useState(false);
  const [hasExistingEWA, setHasExistingEWA] = useState(false);
  const [loanStatus, setLoanStatus] = useState<string | null>(null);
  const [loanProgress, setLoanProgress] = useState<any>(null);
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
    const loanProgressData = localStorage.getItem('loanProgress');

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
        const missingDocs = getMissingDocuments(kyc, currentLanguage);
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
          missingDocuments: currentLanguage === 'hi' 
            ? ['पैन कार्ड', 'आधार कार्ड', 'लाइव सेल्फी सत्यापन']
            : ['PAN Card', 'Aadhaar Card', 'Live selfie verification']
        } as KYCData);
      }
    } else {
      // No KYC data, show nudge with all documents needed
      console.log('No KYC data found'); // Debug log
      setKYCData({ 
        isVerified: false,
        missingDocuments: currentLanguage === 'hi' 
          ? ['पैन कार्ड', 'आधार कार्ड', 'लाइव सेल्फी सत्यापन']
          : ['PAN Card', 'Aadhaar Card', 'Live selfie verification']
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

    // Check for loan progress
    if (loanProgressData) {
      try {
        const progress = JSON.parse(loanProgressData);
        setLoanProgress(progress);
      } catch (error) {
        console.error('Error parsing loan progress:', error);
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

  // Check for loan status and progress updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const savedLoan = localStorage.getItem('loanApplication');
      const loanProgressData = localStorage.getItem('loanProgress');
      
      if (savedLoan) {
        try {
          const loanData = JSON.parse(savedLoan);
          if (loanData.status !== loanStatus) {
            setLoanStatus(loanData.status);
            console.log('Loan status updated to:', loanData.status);
          }
        } catch (error) {
          console.error('Error parsing loan data:', error);
        }
      }

      if (loanProgressData) {
        try {
          const progress = JSON.parse(loanProgressData);
          if (JSON.stringify(progress) !== JSON.stringify(loanProgress)) {
            setLoanProgress(progress);
            console.log('Loan progress updated:', progress);
          }
        } catch (error) {
          console.error('Error parsing loan progress:', error);
        }
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [loanStatus, loanProgress]);

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
            {t('kycRequiredTitle', 'kyc')}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {(() => {
              const missingDocs = kycData.missingDocuments || [];
              if (currentLanguage === 'hi') {
                // Convert English document names to Hindi for display
                const hindiDocs = missingDocs.map(doc => {
                  if (doc === 'PAN Card') return 'पैन कार्ड';
                  if (doc === 'Aadhaar Card') return 'आधार कार्ड';
                  if (doc === 'Live selfie verification') return 'लाइव सेल्फी सत्यापन';
                  return doc; // Return as-is if already in Hindi
                });
                
                if (hindiDocs.length === 1) {
                  return `हमारे साथ ऋण का उपयोग करने के लिए आपको ${hindiDocs[0]} की आवश्यकता होगी। हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी और केवाईसी प्रक्रिया पूरी करने में आपकी मदद करेगी।`;
                } else {
                  return `हमारे साथ ऋण का उपयोग करने के लिए आपको ${hindiDocs.join(', ')} की आवश्यकता होगी। हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी और केवाईसी प्रक्रिया पूरी करने में आपकी मदद करेगी।`;
                }
              } else {
                if (missingDocs.length === 1) {
                  return `You will need a ${missingDocs[0]} to access loans with us. Our team will reach out to you within 24 hours to help you with it and complete the KYC process.`;
                } else {
                  return `You will need ${missingDocs.join(', ')} to access loans with us. Our team will reach out to you within 24 hours to help you with it and complete the KYC process.`;
                }
              }
            })()}
          </p>
          
          <button
            onClick={() => {
              // Determine which document to start with based on what's missing
              const missingDocs = kycData.missingDocuments || [];
              if (missingDocs.includes('PAN Card') || missingDocs.includes('पैन कार्ड')) {
                router.push('/kyc/collect/pan');
              } else if (missingDocs.includes('Aadhaar Card') || missingDocs.includes('आधार कार्ड')) {
                router.push('/kyc/collect/aadhaar');
              } else if (missingDocs.includes('Live selfie verification') || missingDocs.includes('लाइव सेल्फी सत्यापन')) {
                router.push('/kyc/collect/selfie');
              } else {
                router.push('/kyc/collect/pan');
              }
            }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            {t('completeKycNow', 'kyc')}
          </button>
          
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {t('backToLogin', 'kyc')}
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
              
              {/* Show button only if not pending and not in disbursement period */}
              {loanStatus !== 'pending' && !isInDisbursementPeriod(loanStatus, loanProgress) && (
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

              {/* Show disbursement in progress message if in disbursement period */}
              {isInDisbursementPeriod(loanStatus, loanProgress) && (
                <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 py-3 px-4 rounded-lg text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm">
                      <strong>Disbursement in Progress:</strong> Your loan is being processed and will be disbursed shortly ..
                    </p>
                  </div>
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
