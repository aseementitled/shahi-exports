'use client';

import { useState } from 'react';
import { ArrowLeftCircle, CheckCircle, FileText } from 'lucide-react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '@/contexts/LanguageContext';

interface ESignaturePageProps {
  applicationId: string;
  onBack: () => void;
  onSignatureComplete: () => void;
}

export default function ESignaturePage({ applicationId, onBack, onSignatureComplete }: ESignaturePageProps) {
  const [currentStep, setCurrentStep] = useState<'review' | 'signing' | 'completed'>('review');
  const { t } = useLanguage();

  const contractUrl = 'https://production-attachment.s3.ap-south-1.amazonaws.com/68c9ca22-9aa2-498b-9bd6-6f5f9fc87705-unsigned-esign.pdf';

    const handleSignContract = async () => {
    setCurrentStep('signing');
    
    // Simulate signing process
    setTimeout(() => {
      setCurrentStep('completed');
      
      // Show success message briefly then redirect
      setTimeout(() => {
        onSignatureComplete();
      }, 3000);
    }, 2000);
  };

  if (currentStep === 'signing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('signingYourContract', 'loan')}</h2>
          <p className="text-gray-600 mb-6">
            {t('waitProcessSignature', 'loan')}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>{t('note')}:</strong> {t('processMayTakeMoments', 'loan')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contract Signed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your loan agreement has been digitally signed and submitted. Redirecting you back...
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Success:</strong> All documents have been signed and your application is now complete.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
                            <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">E-Signature & Contract Review</h1>
                        <p className="text-gray-600">Please review and sign your loan agreement contract</p>
                        <div className="mt-2 text-sm text-gray-500">
                          Application ID: <span className="font-mono">{applicationId}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // Initialize and start e-signature tour
                            const eSignatureTour = new Shepherd.Tour({
                              defaultStepOptions: {
                                cancelIcon: { enabled: true },
                                classes: 'shadow-md bg-purple-dark',
                                scrollTo: true
                              },
                              useModalOverlay: true
                            });

                            eSignatureTour.addStep({
                              id: 'welcome',
                              text: `
                                <div class="text-center">
                                                                <h3 class="text-lg font-semibold mb-2">${t('welcomeESignature', 'loan')}</h3>
                              <p class="text-sm">${t('finalStepLoanApp', 'loan')}</p>
                              <p class="text-sm mt-2"><strong>${t('reviewSignContract', 'loan')}</strong></p>
                                </div>
                              `,
                              buttons: [{ text: t('next') as string, action: () => eSignatureTour.next() }]
                            });

                            eSignatureTour.addStep({
                              id: 'contract-review',
                              text: `
                                <div class="text-center">
                                  <h3 class="text-lg font-semibold mb-2">${t('reviewYourContract', 'loan')}</h3>
                                  <p class="text-sm">${t('beforeSigning', 'loan')}</p>
                                  <ul class="text-sm text-left mt-2">
                                    <li>• ${t('readContractCarefully', 'loan')}</li>
                                    <li>• ${t('checkLoanTermsConditions', 'loan')}</li>
                                    <li>• ${t('verifyPersonalDetails', 'loan')}</li>
                                    <li>• ${t('understandPaymentObligations', 'loan')}</li>
                                  </ul>
                                  <p class="text-sm mt-2"><strong>${t('takeTimeReview', 'loan')}</strong></p>
                                </div>
                              `,
                              attachTo: { element: '.bg-gray-100', on: 'bottom' },
                              buttons: [
                                { text: t('previous', 'services') as string, action: () => eSignatureTour.back() },
                                { text: t('next') as string, action: () => eSignatureTour.next() }
                              ]
                            });

                            eSignatureTour.addStep({
                              id: 'signing-process',
                              text: `
                                <div class="text-center">
                                  <h3 class="text-lg font-semibold mb-2">${t('digitalSigningProcess', 'loan')}</h3>
                                  <p class="text-sm">${t('whenClickSignContract', 'loan')}</p>
                                  <ul class="text-sm text-left mt-2">
                                    <li>• ${t('digitalSignatureCreated', 'loan')}</li>
                                    <li>• ${t('contractLegallyBinding', 'loan')}</li>
                                    <li>• ${t('seeConfirmationMessage', 'loan')}</li>
                                    <li>• ${t('redirectedMainPage', 'loan')}</li>
                                  </ul>
                                  <p class="text-sm mt-2"><strong>${t('clickWhenReady', 'loan')}</strong></p>
                                </div>
                              `,
                              attachTo: { element: '.bg-gray-50', on: 'bottom' },
                              buttons: [
                                { text: t('previous', 'services') as string, action: () => eSignatureTour.back() },
                                { text: t('finishTour', 'services') as string, action: () => eSignatureTour.complete() }
                              ]
                            });

                            eSignatureTour.start();
                          }}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <span>🎯 Get Help</span>
                        </button>
                        <button
                          onClick={onBack}
                          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          <ArrowLeftCircle className="w-4 h-4" />
                          <span>{t('backToDocumentCheck', 'loan')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

          {/* Contract Display */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">{t('loanAgreementContract', 'loan')}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
{t('reviewTermsBeforeSigning', 'loan')}
              </p>
            </div>

            {/* PDF Viewer */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">{t('contractDocument', 'loan')}</h3>
                <a
                  href={contractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
{t('openInNewTab', 'loan')}
                </a>
              </div>
              
              {/* PDF Embed */}
              <div className="bg-white rounded border border-gray-300 overflow-hidden">
                <iframe
                  src={`${contractUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-96"
                  title="Loan Agreement Contract"
                />
              </div>
              
              <div className="mt-3 text-xs text-gray-500 text-center">
If the PDF doesn&apos;t load, you can <a href={contractUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t('pdfDownloadHere', 'loan')}</a>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">{t('importantTermsReview', 'loan')}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t('loanAmountRepaymentSchedule', 'loan')}</li>
                <li>• {t('interestRatesFees', 'loan')}</li>
                <li>• {t('latePaymentPenalties', 'loan')}</li>
                <li>• {t('prepaymentTerms', 'loan')}</li>
                <li>• {t('defaultConditions', 'loan')}</li>
                <li>• {t('privacyDataUsage', 'loan')}</li>
              </ul>
            </div>

            {/* Signature Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('digitalSignature', 'loan')}</h3>
                              <p className="text-sm text-gray-600 mb-4">
                  {t('clickSignContractAcknowledge', 'loan')}
                </p>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>✓ {t('readUnderstoodTerms', 'loan')}</li>
                <li>✓ {t('agreeToLoanAgreement', 'loan')}</li>
                <li>✓ {t('digitalSignatureLegallyBinding', 'loan')}</li>
                <li>✓ {t('authorizeLenderProcess', 'loan')}</li>
              </ul>
              
              <button
                onClick={handleSignContract}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                {t('signContract', 'loan')}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                {t('signatureEncryptedStored', 'loan')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
