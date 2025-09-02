'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Webcam from 'react-webcam';

export default function SelfieCollectionPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const { t } = useLanguage();

  // Check if selfie is already uploaded and redirect if so
  React.useEffect(() => {
    const kycData = localStorage.getItem('kycData');
    if (kycData) {
      const parsed = JSON.parse(kycData);
      if (parsed.selfieDocument && parsed.selfieUploaded) {
        // Selfie already uploaded, redirect to services
        router.push('/services');
      }
    }
  }, [router]);

  const handleCameraCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsCapturing(false);
      }
    }
  };

  const handleContinue = () => {
    if (capturedImage) {
      // Get existing KYC data
      const existingKycData = localStorage.getItem('kycData');
      const kycData = existingKycData ? JSON.parse(existingKycData) : {};
      
      // Save selfie and mark KYC as complete
      const updatedKycData = {
        ...kycData,
        selfieDocument: capturedImage,
        selfieUploaded: true,
        isVerified: true,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('kycData', JSON.stringify(updatedKycData));
      
      // Navigate to services page
      router.push('/services');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">3</span>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
            {t('liveSelfie', 'kyc')}
          </h1>
          <p className="text-gray-800">
            {t('selfieHelp', 'kyc')}
          </p>
        </div>

        <div className="space-y-6">
          {!capturedImage ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                {!isCapturing && (
                  <h3 className="text-lg font-semibold text-black mb-4">
                    {t('captureSelfie', 'kyc')}
                  </h3>
                )}
                
                {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-2">📸 {t('selfieHelp', 'kyc')}</h4>
                  <ul className="text-sm text-blue-700 text-left space-y-1">
                    <li>• {t('selfieHelp', 'kyc')}</li>
                    <li>• Make sure your face is clearly visible</li>
                    <li>• Look directly at the camera</li>
                    <li>• Ensure good lighting</li>
                  </ul>
                </div> */}
                
                {!isCapturing ? (
                  <button
                    onClick={() => setIsCapturing(true)}
                    className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    📷 {t('captureSelfie', 'kyc')}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full max-w-md mx-auto">
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        width={400}
                        height={400}
                        screenshotFormat="image/jpeg"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={handleCameraCapture}
                        className="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
                      >
                        📸 Capture
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
                <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={capturedImage} 
                    alt="Captured Selfie" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <p className="text-green-600 font-medium mb-4">
                  {t('selfieCaptured', 'kyc')}
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

        <div className="mt-8 text-center space-y-2">
          <button
            onClick={() => router.push('/kyc/collect/aadhaar')}
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
