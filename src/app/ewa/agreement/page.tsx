'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EWAAgreementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'review' | 'signing' | 'completed'>('review');
  const router = useRouter();
  const { t } = useLanguage();

  // Hardcoded PDF URL
  const contractUrl = 'https://production-attachment.s3.ap-south-1.amazonaws.com/68c9ca22-9aa2-498b-9bd6-6f5f9fc87705-unsigned-esign.pdf';

  const handleSignContract = async () => {
    setCurrentStep('signing');
    
    // Simulate signing process
    setTimeout(() => {
      setCurrentStep('completed');
      
      // Save progress and update EWA status
      const ewaProgress = {
        currentStep: 'completed',
        completedSteps: ['setup', 'mandate', 'agreement'],
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('ewaProgress', JSON.stringify(ewaProgress));
      
      // Update EWA application status to active
      const savedEWA = localStorage.getItem('ewaApplication');
      if (savedEWA) {
        try {
          const ewaData = JSON.parse(savedEWA);
          ewaData.status = 'active';
          ewaData.activatedDate = new Date().toISOString();
          localStorage.setItem('ewaApplication', JSON.stringify(ewaData));
        } catch (error) {
          console.error('Error updating EWA status:', error);
        }
      }
      
      // Show success message briefly then redirect
      setTimeout(() => {
        router.push('/ewa/dashboard');
      }, 3000);
    }, 2000);
  };

  const handleBack = () => {
    router.push('/ewa/mandate');
  };

  if (currentStep === 'signing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-black mb-4">Signing Your Contract</h2>
          <p className="text-black mb-6">
            Please wait while we process your signature...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This process may take a few moments
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
          <h2 className="text-xl font-semibold text-black mb-4">Contract Signed Successfully!</h2>
          <p className="text-black mb-6">
            Your Salary Advance agreement has been successfully signed and processed.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Success:</strong> Redirecting you to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">E-Signature & Agreement</h1>
              <p className="text-gray-600">
                Complete E-Signature to finalize your Salary Advance application
              </p>
              <div className="mt-2 text-sm text-gray-500">
                EWA Account ID: <span className="font-mono">EWA-{Date.now()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-semibold text-lg">Kosh</div>
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
                <h3 className="text-md font-medium text-black">Contract Document</h3>
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
              <h4 className="font-medium text-green-900 mb-2">Important Terms to Review</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Salary advance amount and repayment terms</li>
                <li>• Automatic deduction from salary</li>
                <li>• No interest or fees charged</li>
                <li>• Flexible withdrawal amounts</li>
                <li>• Terms and conditions for usage</li>
                <li>• Privacy policy and data usage</li>
              </ul>
            </div>

            {/* Signature Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-black mb-4">Digital Signature</h4>
              <p className="text-sm text-black mb-4">
                By clicking "Sign Contract" below, you agree to the terms and conditions outlined in the agreement document above.
              </p>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleSignContract}
                  className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <span>Sign Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
