'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Upload, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

interface FormData {
  loanAmount: string;
  tenure: string;
  hasBankStatement: string;
  bankStatementFile?: File;
}

export default function SimpleLoanForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    loanAmount: '',
    tenure: '',
    hasBankStatement: '',
    bankStatementFile: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleInputChange = (field: keyof FormData, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('bankStatementFile', file);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save application to localStorage
    const applicationData = {
      id: `LOAN_${Date.now()}`,
      loanAmount: formData.loanAmount,
      tenure: formData.tenure,
      hasBankStatement: formData.hasBankStatement,
      bankStatementFile: formData.bankStatementFile ? formData.bankStatementFile.name : null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('loanApplication', JSON.stringify(applicationData));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleGoToServices = () => {
    router.push('/services');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-md mx-2 sm:mx-4 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t('applicationSubmitted', 'services')}
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {t('applicationSubmittedMessage', 'services')}
          </p>
          
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">
              {t('nextSteps', 'services')}
            </h3>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5 sm:space-y-2 text-left">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                {t('teamReview', 'services')}
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                {t('approvalNotification', 'services')}
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                {t('documentCollection', 'services')}
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                {t('disbursementProcess', 'services')}
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleGoToServices}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <span>Back to Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-md mx-2 sm:mx-4">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Step {currentStep} of 3
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {Math.round((currentStep / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Loan Amount and Tenure */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {t('loanAmount', 'services')} & {t('loanTenure', 'services')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Please provide your loan requirements
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('loanAmount', 'services')} (₹)
                </label>
                <input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  placeholder="Enter loan amount"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('loanTenure', 'services')} (Months)
                </label>
                <select
                  value={formData.tenure}
                  onChange={(e) => handleInputChange('tenure', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                >
                  <option value="">Select tenure</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{month} month{month > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.loanAmount || !formData.tenure}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Bank Statement Check */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {t('bankStatementCheck', 'services')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Do you have your bank statement ready?
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleInputChange('hasBankStatement', 'yes')}
                  className={`p-3 sm:p-4 border-2 rounded-lg text-center transition-colors ${
                    formData.hasBankStatement === 'yes'
                      ? 'border-blue-500 bg-blue-50 text-black'
                      : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <FileText className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
                    formData.hasBankStatement === 'yes' ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium text-sm sm:text-base">{t('bankStatementYes', 'services')}</span>
                </button>

                <button
                  onClick={() => handleInputChange('hasBankStatement', 'no')}
                  className={`p-3 sm:p-4 border-2 rounded-lg text-center transition-colors ${
                    formData.hasBankStatement === 'no'
                      ? 'border-blue-500 bg-blue-50 text-black'
                      : 'border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <FileText className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
                    formData.hasBankStatement === 'no' ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium text-sm sm:text-base">{t('bankStatementNo', 'services')}</span>
                </button>
              </div>

              {formData.hasBankStatement === 'yes' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('bankStatementUpload', 'services')}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="bank-statement-upload"
                    />
                    <label
                      htmlFor="bank-statement-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 10MB
                      </span>
                    </label>
                  </div>
                  {formData.bankStatementFile && (
                    <p className="text-xs sm:text-sm text-green-600 mt-2">
                      ✓ {formData.bankStatementFile.name} uploaded
                    </p>
                  )}
                </div>
              )}

              {formData.hasBankStatement === 'no' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    No problem! You can complete this later. Our team will guide you through the process.
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 sm:space-x-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.hasBankStatement}
                className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Submit */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Review Your Application
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Please review your details before submitting
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-black">Loan Amount:</span>
                <span className="font-medium text-sm sm:text-base text-black">₹{formData.loanAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-black">Tenure:</span>
                <span className="font-medium text-sm sm:text-base text-black">{formData.tenure} month{formData.tenure !== '1' ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-black">Bank Statement:</span>
                <span className="font-medium text-sm sm:text-base text-black">
                  {formData.hasBankStatement === 'yes' 
                    ? (formData.bankStatementFile ? 'Uploaded' : 'Will upload later')
                    : 'Will arrange later'
                  }
                </span>
              </div>
            </div>

            <div className="flex space-x-2 sm:space-x-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
