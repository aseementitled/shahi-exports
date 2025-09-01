'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if KYC is completed
    const savedKYC = localStorage.getItem('kycData');
    
    if (savedKYC) {
      try {
        const kycData = JSON.parse(savedKYC);
        if (kycData.isVerified) {
          // KYC is verified, redirect to services
          router.push('/services');
        } else {
          // KYC is incomplete, redirect to KYC page
          router.push('/kyc');
        }
      } catch (error) {
        // Error parsing KYC data, redirect to KYC page
        router.push('/kyc');
      }
    } else {
      // No KYC data, redirect to KYC page
      router.push('/kyc');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
