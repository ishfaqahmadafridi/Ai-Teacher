'use client';

import { useVerifyAccount } from '../../hooks/useVerifyAccount';
import { MethodSelector } from './MethodSelector';
import { OtpInputGroup } from './OtpInputGroup';
import { ResendTimer } from './ResendTimer';
import { AuthError } from '../CreateAccount/AuthError';
import { Button } from '../ui/Button/Button';

export function VerifyAccountForm() {
  const {
    method,
    otp,
    timer,
    isLoading,
    error,
    success,
    inputRefs,
    handleSelectMethod,
    handleChangeOtp,
    handleKeyDownOtp,
    handlePasteOtp,
    handleResend,
    handleSubmit,
  } = useVerifyAccount();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header text */}
      <div className="text-center mb-10">
        <h2 className="text-[32px] font-semibold leading-10 text-[#e5e2e3] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Verify Your Identity
        </h2>
        <p className="text-[18px] leading-7 text-[#c6c6cc]/80 font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
          Choose a method to receive your verification code.
        </p>
      </div>

      {/* Error alert */}
      <AuthError message={error ?? ''} />

      {/* Success alert */}
      {success && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm text-center animate-pulse">
          ✓ Identity verified successfully! Redirecting to classroom...
        </div>
      )}

      {/* Method Selection (Email OTP vs SMS OTP) */}
      <MethodSelector method={method} onSelectMethod={handleSelectMethod} />

      {/* OTP Input Section */}
      <div className="flex flex-col items-center">
        <p className="text-[#c6c6cc]/80 mb-6 text-center text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          We've sent a 6-digit code to{' '}
          <span className="text-[#b8c3ff] font-semibold">
            {method === 'email' ? 'l***a@lumina.edu' : '+1 ••• ••• 4293'}
          </span>
        </p>

        {/* 6-Digit OTP Group */}
        <OtpInputGroup
          otp={otp}
          inputRefs={inputRefs}
          onChangeOtp={handleChangeOtp}
          onKeyDownOtp={handleKeyDownOtp}
          onPasteOtp={handlePasteOtp}
        />

        {/* Primary Action Button */}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || otp.join('').length < 6}
          className="glow-button w-full bg-[#0043eb] hover:bg-[#0043eb]/90 text-[#c6ceff] font-semibold text-[14px] py-4 rounded-full mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,67,235,0.4)]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {isLoading ? 'Verifying Code...' : 'Verify & Complete'}
        </Button>

        {/* Resend Timer */}
        <ResendTimer timer={timer} onResend={handleResend} isLoading={isLoading} />
      </div>
    </div>
  );
}
