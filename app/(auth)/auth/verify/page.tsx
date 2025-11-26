"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

interface VerificationState {
  status: 'loading' | 'success' | 'error';
  message: string;
  email?: string;
}

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email...'
  });

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationState({
        status: 'error',
        message: 'No verification token provided.'
      });
      return;
    }

    // 验证token
    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationState({
          status: 'success',
          message: 'Email verified successfully!',
          email: data.email
        });

        // 3秒后自动跳转到仪表板
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setVerificationState({
          status: 'error',
          message: data.error || 'Verification failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationState({
        status: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    }
  };

  const handleRetry = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/SuperheatConsole.svg"
            alt="Superheat Console"
            width={215}
            height={32}
            className="mx-auto"
          />
          <p className="text-sm text-gray-500 mt-2">
            Manage devices, earnings, and operations in one place
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Loading State */}
          {verificationState.status === 'loading' && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6640] mx-auto"></div>
              <h2 className="text-xl font-medium text-gray-900">
                Verifying Email
              </h2>
              <p className="text-gray-600">
                {verificationState.message}
              </p>
            </div>
          )}

          {/* Success State */}
          {verificationState.status === 'success' && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-900">
                Email Verified!
              </h2>
              <p className="text-gray-600">
                Welcome back! You have been successfully logged in.
              </p>
              {verificationState.email && (
                <p className="text-sm text-gray-500">
                  Logged in as: {verificationState.email}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Redirecting to dashboard in 3 seconds...
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-[#ff6640] text-white py-2 px-4 rounded-md hover:bg-[#e55a36] transition-colors"
              >
                Go to Dashboard Now
              </button>
            </div>
          )}

          {/* Error State */}
          {verificationState.status === 'error' && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-900">
                Verification Failed
              </h2>
              <p className="text-gray-600">
                {verificationState.message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-[#ff6640] text-white py-2 px-4 rounded-md hover:bg-[#e55a36] transition-colors"
                >
                  Back to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Having trouble? Contact support at</p>
          <a href="mailto:support@superheat.com" className="text-[#ff6640] hover:underline">
            support@superheat.com
          </a>
        </div>
      </div>
    </div>
  );
}