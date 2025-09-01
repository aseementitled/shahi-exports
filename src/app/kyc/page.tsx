'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Phone, FileText, Camera, Loader2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

// Use the actual Shepherd Tour type
type TourType = unknown;

interface StoredFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface KYCData {
  name: string;
  mobile: string;
  gender: string;
  pancard: File | StoredFile | null;
  adhaar: File | StoredFile | null;
  selfie: string | null;
  otp: string;
  isVerified: boolean;
}



export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { currentLanguage, t } = useLanguage();
  const [kycData, setKYCData] = useState<KYCData>({
    name: '',
    mobile: '',
    gender: '',
    pancard: null,
    adhaar: null,
    selfie: null,
    otp: '',
    isVerified: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [tour, setTour] = useState<TourType | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const totalSteps = 4;

  // Load KYC data from localStorage on component mount
  useEffect(() => {
    const savedKYC = localStorage.getItem('kycData');
    const savedStep = localStorage.getItem('kycCurrentStep');
    
    if (savedKYC) {
      try {
        const parsed = JSON.parse(savedKYC);
        setKYCData(parsed);
        
        // If KYC is already verified, redirect to services
        if (parsed.isVerified) {
          window.location.href = '/services';
          return;
        }
        
        // Restore the step user was on
        if (savedStep) {
          const stepNumber = parseInt(savedStep);
          if (stepNumber >= 1 && stepNumber <= 4) {
            setCurrentStep(stepNumber);
            setIsReturningUser(true);
          }
        }
      } catch (error) {
        console.error('Error parsing saved KYC data:', error);
      }
    }
  }, []);

  // Save KYC data and current step to localStorage whenever they change
  useEffect(() => {
    // Save current step
    localStorage.setItem('kycCurrentStep', currentStep.toString());
    
    // Convert File objects to base64 before saving
    const saveData = async () => {
      const dataToSave = { ...kycData };
      
      // Convert PAN card file to base64 if it exists and is a File
      if (kycData.pancard instanceof File) {
        try {
          const base64 = await fileToBase64(kycData.pancard);
          dataToSave.pancard = {
            name: kycData.pancard.name,
            type: kycData.pancard.type,
            size: kycData.pancard.size,
            base64: base64
          };
        } catch (error) {
          console.error('Error converting PAN card to base64:', error);
        }
      }
      
      // Convert Aadhaar card file to base64 if it exists and is a File
      if (kycData.adhaar instanceof File) {
        try {
          const base64 = await fileToBase64(kycData.adhaar);
          dataToSave.adhaar = {
            name: kycData.adhaar.name,
            type: kycData.adhaar.type,
            size: kycData.adhaar.size,
            base64: base64
          };
        } catch (error) {
          console.error('Error converting Aadhaar card to base64:', error);
        }
      }
      
      localStorage.setItem('kycData', JSON.stringify(dataToSave));
    };
    
    saveData();
  }, [kycData, currentStep]);

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Helper function to check if we have stored file data
  const hasStoredFile = (fileData: File | StoredFile | null): boolean => {
    if (!fileData) return false;
    if (fileData instanceof File) return true;
    if (fileData.base64 && fileData.name) return true;
    return false;
  };

  // Helper function to get file name for display
  const getFileName = (fileData: File | StoredFile | null): string => {
    if (fileData instanceof File) {
      return fileData.name;
    } else if (fileData && fileData.name) {
      return fileData.name;
    }
    return '';
  };

  const handleInputChange = (field: keyof KYCData, value: string | File | null) => {
    setKYCData(prev => ({ ...prev, [field]: value }));
  };

  const captureSelfie = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setKYCData(prev => ({ ...prev, selfie: imageSrc }));
        setShowCamera(false);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentStep === 1) {
      // Personal details validation
      if (kycData.name && kycData.mobile && kycData.gender) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Document upload validation
      if (hasStoredFile(kycData.pancard) && hasStoredFile(kycData.adhaar)) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      // Selfie validation
      if (kycData.selfie) {
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      // OTP verification
      if (kycData.otp.length === 6) {
        // Simulate OTP verification
        setIsLoading(true);
        setTimeout(() => {
          setKYCData(prev => ({ ...prev, isVerified: true }));
          setIsLoading(false);
          // Clear step tracking since KYC is complete
          localStorage.removeItem('kycCurrentStep');
          // Redirect to services page
          window.location.href = '/services';
        }, 2000);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return kycData.name && kycData.mobile && kycData.gender;
      case 2:
        return hasStoredFile(kycData.pancard) && hasStoredFile(kycData.adhaar);
      case 3:
        return kycData.selfie;
      case 4:
        return kycData.otp.length === 6;
      default:
        return false;
    }
  };

  // Initialize Shepherd tour
  useEffect(() => {
    const newTour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'shadow-md bg-purple-dark',
        scrollTo: true
      },
      useModalOverlay: true
    });

    // Add tour steps based on current step
    if (currentStep === 1) {
      newTour.addStep({
        id: 'personal-details',
        title: t('personalDetails', 'kyc') as string,
        text: t('personalDetailsTourText', 'kyc') as string,
        attachTo: {
          element: '.personal-details-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('gotIt', 'kyc') as string,
            action: () => newTour.complete()
          }
        ]
      });
    } else if (currentStep === 2) {
      newTour.addStep({
        id: 'documents',
        title: t('documentUpload', 'kyc') as string,
        text: t('documentUploadTourText', 'kyc') as string,
        attachTo: {
          element: '.document-upload-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('gotIt', 'kyc') as string,
            action: () => newTour.complete()
          }
        ]
      });
    } else if (currentStep === 3) {
      newTour.addStep({
        id: 'selfie',
        title: t('selfieCapture', 'kyc') as string,
        text: t('selfieCaptureTourText', 'kyc') as string,
        attachTo: {
          element: '.selfie-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('gotIt', 'kyc') as string,
            action: () => newTour.complete()
          }
        ]
      });
    } else if (currentStep === 4) {
      newTour.addStep({
        id: 'otp',
        title: t('otpVerification', 'kyc') as string,
        text: t('otpVerificationTourText', 'kyc') as string,
        attachTo: {
          element: '.otp-section',
          on: 'bottom'
        },
        buttons: [
          {
            text: t('gotIt', 'kyc') as string,
            action: () => newTour.complete()
          }
        ]
      });
    }

    setTour(newTour);

    return () => {
      // Cleanup tour if needed
      if (newTour) {
        try {
          // @ts-expect-error - Shepherd tour cleanup
          if (newTour.destroy) newTour.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [currentStep, t]); // Re-initialize tour when step changes

  const startTour = () => {
    if (tour) {
      // @ts-expect-error - Shepherd tour methods
      tour.start();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 personal-details-section">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('personalDetails', 'kyc')}</h2>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>{t('help')}:</strong> {t('personalDetailsHelp', 'kyc')}
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName', 'kyc')}</label>
                <input
                  type="text"
                  value={kycData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder={t('fullNamePlaceholder', 'kyc') as string}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('mobileNumber', 'kyc')}</label>
                <input
                  type="tel"
                  value={kycData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder={t('mobilePlaceholder', 'kyc') as string}
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender', 'kyc')}</label>
                <select
                  value={kycData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">{t('selectGender', 'kyc')}</option>
                  <option value="male">{t('male', 'kyc')}</option>
                  <option value="female">{t('female', 'kyc')}</option>
                  <option value="other">{t('other', 'kyc')}</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 document-upload-section">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('documentUpload', 'kyc')}</h2>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>{t('help')}:</strong> {t('documentHelp', 'kyc')}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('panCard', 'kyc')}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleInputChange('pancard', e.target.files?.[0] || null)}
                    className="hidden"
                    id="pancard-upload"
                  />
                  <label htmlFor="pancard-upload" className="cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {hasStoredFile(kycData.pancard) ? getFileName(kycData.pancard) : t('panCardPlaceholder', 'kyc')}
                    </p>
                  </label>
                </div>
                
                {/* Show file preview if available */}
                {hasStoredFile(kycData.pancard) && (
                  <div className="mt-2 text-center">
                    <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">PAN Card uploaded successfully</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('aadhaarCard', 'kyc')}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleInputChange('adhaar', e.target.files?.[0] || null)}
                    className="hidden"
                    id="aadhaar-upload"
                  />
                  <label htmlFor="aadhaar-upload" className="cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {hasStoredFile(kycData.adhaar) ? getFileName(kycData.adhaar) : t('aadhaarPlaceholder', 'kyc')}
                    </p>
                  </label>
                </div>
                
                {/* Show file preview if available */}
                {hasStoredFile(kycData.adhaar) && (
                  <div className="mt-2 text-center">
                    <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">Aadhaar Card uploaded successfully</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 selfie-section">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('liveSelfie', 'kyc')}</h2>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>{t('help')}:</strong> {t('selfieHelp', 'kyc')}
            </p>
            
            <div className="text-center">
              {!showCamera && !kycData.selfie && (
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {showCamera && (
                <div className="mb-4">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={captureSelfie}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📷 {t('captureSelfie', 'kyc')}
                    </button>
                    <button
                      onClick={() => setShowCamera(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {kycData.selfie && !showCamera && (
                <div className="mb-4">
                  <img 
                    src={kycData.selfie} 
                    alt="Selfie" 
                    className="w-full max-w-md mx-auto rounded-lg border"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {t('selfieCaptured', 'kyc')}
                  </div>
                  <button
                    onClick={() => setShowCamera(true)}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    📷 {t('retakeSelfie', 'kyc')}
                  </button>
                </div>
              )}

              {!showCamera && !kycData.selfie && (
                <button
                  onClick={() => setShowCamera(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📷 {t('captureSelfie', 'kyc')}
                </button>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 otp-section">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('otpVerification', 'kyc')}</h2>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 <strong>{t('help')}:</strong> {t('otpHelp', 'kyc')}
            </p>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-3 text-sm">
                {t('otpSentMessage', 'kyc')} <span className="font-semibold">{kycData.mobile}</span>
              </p>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={kycData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder={t('otpPlaceholder', 'kyc') as string}
                  maxLength={6}
                />
              </div>

              <button
                onClick={() => {
                  handleInputChange('otp', '');
                  setCurrentStep(1);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {t('didntReceiveOtp', 'kyc')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title', 'kyc')}</h1>
          <p className="text-gray-600">{t('subtitle', 'kyc')}</p>
          
          {/* Language Selector */}
          <div className="mt-6 max-w-xs mx-auto">
            <LanguageSelector size="md" />
          </div>
          
          {/* Welcome Back Message */}
          {isReturningUser && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-blue-600">🔄</span>
                <p className="text-sm text-blue-800">
                  <strong>{t('welcomeBack', 'kyc')}</strong> {(t('continuingFromStep', 'kyc') as string).replace('{step}', currentStep.toString()).replace('{total}', '4')}
                </p>
              </div>
            </div>
          )}
          
          {/* Tour Controls */}
          <div className="mt-4 space-x-2">
            <button
              onClick={startTour}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
🎯 {(t('getHelpForStep', 'kyc') as string).replace('{step}', currentStep.toString())}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md">
            {/* Progress Bar */}
            <div className="bg-blue-50 px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">{t('step', 'kyc')} {currentStep} {t('of', 'kyc')} {totalSteps}</span>
                <span className="text-xs font-medium text-blue-600">{Math.round((currentStep / totalSteps) * 100)}% {t('complete', 'kyc')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-all duration-200 text-sm font-medium ${
                    currentStep === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('back')}</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                    canProceed() && !isLoading
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {currentStep === 4 ? t('verifyingOtp', 'kyc') : t('sendingOtp', 'kyc')}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {currentStep === 4 ? t('verifyComplete', 'kyc') : t('next')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
