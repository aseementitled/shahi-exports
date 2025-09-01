'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, CheckCircle } from 'lucide-react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function NewEWAPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tour, setTour] = useState<any>(null);
  const [kycData, setKYCData] = useState(null);
  const { t } = useLanguage();
  const [consentGiven, setConsentGiven] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [authorizationChecked, setAuthorizationChecked] = useState(false);
  const [signatureStep, setSignatureStep] = useState<'review' | 'signing' | 'completed'>('review');
  const router = useRouter();

  useEffect(() => {
    // Check if KYC is completed
    const savedKYC = localStorage.getItem('kycData');
    
    if (savedKYC) {
      try {
        const parsed = JSON.parse(savedKYC);
        if (parsed.isVerified) {
          setKYCData(parsed);
        } else {
          router.push('/kyc');
        }
      } catch {
        router.push('/kyc');
      }
    } else {
      router.push('/kyc');
    }
  }, [router]);

  // Initialize Shepherd tour
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          cancelIcon: { enabled: true },
          classes: 'shadow-md bg-purple-dark',
          scrollTo: true
        },
        useModalOverlay: true
      });

      tour.addStep({
        id: 'welcome',
        title: t('welcomeToEWASetup', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('ewaExplanation', 'loan')}</p>
            <p class="text-sm mt-2"><strong>${t('noInterestNoFees', 'loan')}</strong></p>
          </div>
        `,
        buttons: [{ text: t('next') as string, action: () => tour.next() }]
      });

      tour.addStep({
        id: 'language-selection',
        title: t('chooseYourLanguage', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('selectPreferredLanguage', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('englishDefaultLanguage', 'loan')}</li>
              <li>• ${t('hindiLanguage', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('chooseComfortable', 'loan')}</strong></p>
          </div>
        `,
        attachTo: { element: '.max-w-xs', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('next') as string, action: () => tour.next() }
        ]
      });

      tour.addStep({
        id: 'ewa-configuration',
        title: t('ewaConfigurationSettings', 'loan') as string,
        text: `
          <div class="text-center">
            <p class="text-sm">${t('setupYourPreferences', 'loan')}</p>
            <ul class="text-sm text-left mt-2">
              <li>• ${t('maxWithdrawalAmountSetting', 'loan')}</li>
              <li>• ${t('withdrawalFrequencySetting', 'loan')}</li>
              <li>• ${t('settingsHelpControl', 'loan')}</li>
            </ul>
            <p class="text-sm mt-2"><strong>${t('configureAccordingNeeds', 'loan')}</strong></p>
          </div>
        `,
        attachTo: { element: '.bg-white', on: 'bottom' },
        buttons: [
          { text: t('previous', 'services') as string, action: () => tour.back() },
          { text: t('finishTour', 'services') as string, action: () => tour.complete() }
        ]
      });

      setTour(tour);
    }
  }, [t]);

  const handleSubmit = async () => {
    if (!consentGiven) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(2); // Move to mandate screen
    }, 2000);
  };

  const completeMandate = async () => {
    if (!authorizationChecked) {
      return;
    }

    setIsLoading(true);
    
    // Simulate mandate completion
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3); // Move to E-signature screen
    }, 2000);
  };

  const handleSignContract = async () => {
    setSignatureStep('signing');
    
    // Simulate signing process
    setTimeout(() => {
      setSignatureStep('completed');
      
      // Show success message briefly then complete
      setTimeout(() => {
        // Save EWA application to localStorage
        const ewaApplication = {
          id: `EWA-${Date.now()}`,
          maxWithdrawal: 16000, // Default maximum withdrawal amount
          withdrawalFrequency: 'monthly', // Default frequency
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('ewaApplication', JSON.stringify(ewaApplication));
        
        // Redirect to EWA dashboard
        router.push('/ewa/dashboard');
      }, 3000);
    }, 2000);
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

  // Step 2: Mandate Screen
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">EWA Mandate Setup</h1>
            <p className="text-gray-600">Complete the mandate to enable Earned Wage Access</p>
            
            {/* Help Button */}
            <div className="mt-4">
              <button
                onClick={() => tour?.start()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm mx-auto"
              >
                <span>🎯 Get Help</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Top Banner */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-800">⚠️</span>
                    <span className="text-yellow-800 text-sm font-medium">Important: Please read all details carefully before proceeding</span>
                  </div>
                </div>
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Review & Authenticate EWA Mandate</h1>
                  <div className="mt-2 text-sm text-gray-500">
                    EWA Account ID: <span className="font-mono">EWA-{Date.now()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-semibold text-lg">EWA Service</div>
                </div>
              </div>
              
              {/* Mandate Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">EWA Mandate Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date - End Date</label>
                    <p className="text-sm text-gray-900">25th Sep 2025 - 25th Sep 2028</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <p className="text-sm text-gray-900">Monthly</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                    <p className="text-sm text-gray-900">ADHIKOSH FINANCIAL AD...</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Amount</label>
                    <p className="text-sm text-green-600 font-semibold">₹ 16,000</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <p className="text-sm text-gray-900">Earned Wage Access</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Utility Code</label>
                    <p className="text-sm text-gray-900 font-mono">NACH00000000057248</p>
                  </div>
                </div>
              </div>
              
              {/* Bank Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">Bank Details</span>
                    <span className="text-gray-600">🏦</span>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-semibold text-lg">Canara Bank</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <p className="text-sm text-gray-900">D**** P*****</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <p className="text-sm text-gray-900">Savings</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <p className="text-sm text-gray-900">XXXX0643</p>
                  </div>
                </div>
              </div>
              
              {/* Authentication Mode Selection */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Authentication Mode</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border-2 border-blue-500 rounded-lg p-4 text-center cursor-pointer bg-blue-50">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">🏦</span>
                    </div>
                    <div className="text-sm font-medium text-blue-900">Net Banking</div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">🆔</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700">Aadhaar</div>
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mx-auto mt-2"></div>
                  </div>
                </div>
              </div>
              
              {/* Authorization */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="authorization"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={authorizationChecked}
                    onChange={(e) => setAuthorizationChecked(e.target.checked)}
                  />
                  <label htmlFor="authorization" className="text-sm font-medium text-blue-900">
                    I authorize the company to set up automatic EWA mandate for my account
                  </label>
                </div>
                <p className="text-xs text-blue-700">
                  By checking this box, you agree to the terms and conditions and authorize automatic EWA setup
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <span>← Back to Setup</span>
                </button>
                <button
                  onClick={completeMandate}
                  disabled={!authorizationChecked}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                    authorizationChecked
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Complete Mandate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: E-Signature Screen
  if (currentStep === 3) {
    const contractUrl = 'https://production-attachment.s3.ap-south-1.amazonaws.com/68c9ca22-9aa2-498b-9bd6-6f5f9fc87705-unsigned-esign.pdf';

    // Signing progress screen
    if (signatureStep === 'signing') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Signing Your EWA Agreement</h2>
            <p className="text-gray-600 mb-6">
              Please wait while we process your digital signature...
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> This process may take a few moments. Please do not close this page.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Signature completed screen
    if (signatureStep === 'completed') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">EWA Agreement Signed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your EWA agreement has been digitally signed and processed. You will be redirected to your dashboard shortly.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Status:</strong> Agreement signed and activated. You can now access your EWA services.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Main signature review screen
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">EWA E-Signature</h1>
            <p className="text-gray-600">Review and digitally sign your EWA agreement</p>
            
            {/* Help Button */}
            <div className="mt-4">
              <button
                onClick={() => tour?.start()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm mx-auto"
              >
                <span>🎯 Get Help</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">EWA Agreement & E-Signature</h1>
                    <p className="text-gray-600">Please review the agreement document and provide your digital signature</p>
                    <div className="mt-2 text-sm text-gray-500">
                      EWA Account ID: <span className="font-mono">EWA-{Date.now()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <span>← Back to Mandate</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Please review the entire agreement document below before signing. 
                    Your digital signature will be legally binding.
                  </p>
                </div>

                {/* PDF Viewer */}
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">EWA Agreement Document</h3>
                    <a
                      href={contractUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Open in New Tab
                    </a>
                  </div>
                  
                  {/* PDF Embed */}
                  <div className="bg-white rounded border border-gray-300 overflow-hidden">
                    <iframe
                      src={`${contractUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-96"
                      title="EWA Agreement Contract"
                    />
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    If the PDF doesn&apos;t load, you can <a href={contractUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">download it here</a>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-green-900 mb-2">{t('keyTermsEWAAgreement', 'ewa')}:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• {t('maxWithdrawalMonthly', 'ewa')}: ₹16,000 per month</li>
                    <li>• {t('withdrawalFrequency', 'ewa')}: {t('monthly', 'ewa')}</li>
                    <li>• {t('noInterestFees', 'ewa')}</li>
                    <li>• {t('autoSalaryDeduction', 'ewa')}</li>
                    <li>• {t('bankMandateAuth', 'ewa')}</li>
                    <li>• {t('privacyDataTerms', 'ewa')}</li>
                  </ul>
                </div>

                {/* Signature Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">{t('digitalSignature', 'ewa')}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('signContractAcknowledge', 'ewa')}
                  </p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>• {t('readUnderstoodAgreement', 'ewa')}</li>
                    <li>• {t('agreeAllTermsDocument', 'ewa')}</li>
                    <li>• {t('authorizeAutoDeduction', 'ewa')}</li>
                    <li>• {t('digitalSignatureLegallyBinding', 'ewa')}</li>
                  </ul>
                  
                  <button
                    onClick={handleSignContract}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg flex items-center justify-center space-x-2"
                  >
                    <span>{t('signContract', 'ewa')}</span>
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: EWA Setup (Default)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EWA Application</h1>
          <p className="text-gray-600">Set up your Earned Wage Access account</p>
          
          {/* Help Button */}
          <div className="mt-4">
            <button
              onClick={() => tour?.start()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm mx-auto"
            >
              <span>🎯 Get Help</span>
            </button>
          </div>
          
          {/* Language Selector */}
          <div className="flex justify-center mt-4">
            <div className="w-48">
              <LanguageSelector size="sm" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('ewaConsentSetup', 'ewa')}</h2>
              <p className="text-gray-600">{t('completeSetupEarnedWageAccess', 'ewa')}</p>
            </div>

            {/* Consent Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('consentAuthorization', 'ewa')}</h3>
              <p className="text-sm text-blue-800 mb-4">
                {t('consentText', 'ewa')}
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                />
                <label htmlFor="consent" className="text-sm font-medium text-blue-900">
                  {t('agreeTermsConditions', 'ewa')}
                </label>
              </div>
            </div>

            {/* Max Drawdown Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">{t('yourEWALimits', 'ewa')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Monthly Salary</label>
                  <p className="text-lg font-semibold text-green-900">₹20,000</p>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">{t('maxDrawdown', 'ewa')}</label>
                  <p className="text-lg font-semibold text-green-900">₹16,000</p>
                </div>
              </div>
              <p className="text-xs text-green-700 mt-2">
{t('basedOnSalary', 'ewa')}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={!consentGiven || isLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                  consentGiven && !isLoading
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('settingUpEWA', 'ewa')}</span>
                  </div>
                ) : (
                  t('completeSetupProceedMandate', 'ewa')
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> Your KYC information has been automatically filled in. 
                    You can start using EWA services once this setup is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
