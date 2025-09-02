'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Webcam from 'react-webcam';

// Helper function to get next missing document
const getNextMissingDocument = (kycData: any): string => {
  // Check if Aadhaar is missing
  if ((!kycData.aadhaarDocument || kycData.aadhaarDocument === null || kycData.aadhaarDocument === '') && !kycData.aadhaarSkipped) {
    return '/kyc/collect/aadhaar';
  }
  
  // Check if Selfie is missing
  if (!kycData.selfieDocument || kycData.selfieDocument === null || kycData.selfieDocument === '') {
    return '/kyc/collect/selfie';
  }
  
  // All documents complete, go to services
  return '/services';
};

export default function PANCollectionPage() {
  const [hasDocument, setHasDocument] = useState<string>('');
  const [showCapture, setShowCapture] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const { t } = useLanguage();

  // Check if PAN is already uploaded and redirect if so
  React.useEffect(() => {
    const kycData = localStorage.getItem('kycData');
    if (kycData) {
      const parsed = JSON.parse(kycData);
      if (parsed.panDocument && parsed.panUploaded) {
        // PAN already uploaded, redirect to next missing document
        const nextStep = getNextMissingDocument(parsed);
        router.push(nextStep);
      }
    }
  }, [router]);

  const handleDocumentChoice = (choice: string) => {
    setHasDocument(choice);
    if (choice === 'yes') {
      setShowCapture(true);
    } else {
      // Skip to next document (Aadhaar)
      router.push('/kyc/collect/aadhaar');
    }
  };

  const handleCameraCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsCapturing(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (capturedImage) {
      // Get existing KYC data first
      const existingKycData = localStorage.getItem('kycData');
      const kycData = existingKycData ? JSON.parse(existingKycData) : {};
      
      // Save PAN document
      const updatedKycData = {
        ...kycData,
        panDocument: capturedImage,
        panUploaded: true,
        currentStep: 'aadhaar'
      };
      
      console.log('Saving PAN data:', updatedKycData); // Debug log
      localStorage.setItem('kycData', JSON.stringify(updatedKycData));
      
      // Navigate to next missing document
      const nextStep = getNextMissingDocument(updatedKycData);
      router.push(nextStep);
    }
  };

  const handleSkip = () => {
    // Get existing KYC data first
    const existingKycData = localStorage.getItem('kycData');
    const kycData = existingKycData ? JSON.parse(existingKycData) : {};
    
    // Mark PAN as skipped
    const updatedKycData = {
      ...kycData,
      panSkipped: true,
      currentStep: 'aadhaar'
    };
    
    console.log('Skipping PAN, saving data:', updatedKycData); // Debug log
    localStorage.setItem('kycData', JSON.stringify(updatedKycData));
    
    // Navigate to next missing document
    const nextStep = getNextMissingDocument(updatedKycData);
    router.push(nextStep);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">1</span>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
            {t('panCard', 'kyc')}
          </h1>
          <p className="text-gray-800">
            {t('panCardPlaceholder', 'kyc')}
          </p>
        </div>

        {!showCapture ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black mb-4">
                {t('doYouHavePan', 'kyc')}
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDocumentChoice('yes')}
                  className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200"
                >
                  {t('yes', 'kyc')}
                </button>
                <button
                  onClick={() => handleDocumentChoice('no')}
                  className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
                >
                  {t('no', 'kyc')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="text-center">
                  {!isCapturing && (
                    <h3 className="text-lg font-semibold text-black mb-4">
                      {t('uploadFile', 'kyc')} {t('panCard', 'kyc')}
                    </h3>
                  )}
                  
                  {!isCapturing ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => setIsCapturing(true)}
                        className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                      >
                        📷 {t('captureSelfie', 'kyc')}
                      </button>
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-gray-600 text-white hover:bg-gray-700"
                      >
                        📁 {t('uploadFile', 'kyc')}
                      </button>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-full max-w-md mx-auto">
                        <Webcam
                          ref={webcamRef}
                          audio={false}
                          width={400}
                          height={300}
                          screenshotFormat="image/jpeg"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={handleCameraCapture}
                          className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
                        >
                          📸 Capture Photo
                        </button>
                        <button
                          onClick={() => setIsCapturing(false)}
                          className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-gray-600 text-white hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-48 h-32 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={capturedImage} 
                      alt="Captured Document" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-green-600 font-medium mb-4">
                    {t('fileSelected', 'kyc')} {t('panCard', 'kyc')}
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleContinue}
                      className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {t('continue', 'common')}
                    </button>
                    
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setUploadedFile(null);
                      }}
                      className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      {t('retakeSelfie', 'kyc')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center space-y-2">
          <button
            onClick={() => router.push('/auth/choice')}
            className="text-blue-600 hover:text-blue-800 text-sm block"
          >
            {t('backToRegistration', 'kyc')}
          </button>
          <button
            onClick={() => router.push('/services')}
            className="text-gray-600 hover:text-gray-800 text-sm block"
          >
            {t('backToHome', 'services')}
          </button>
        </div>
      </div>
    </div>
  );
}
