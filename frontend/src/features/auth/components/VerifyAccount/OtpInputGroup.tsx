'use client';

import { memo } from 'react';
import { Input } from '../ui/Input/Input';
import type { OtpInputGroupProps } from '../../types/verify.types';

export const OtpInputGroup = memo(function OtpInputGroup({
  otp,
  inputRefs,
  onChangeOtp,
  onKeyDownOtp,
  onPasteOtp,
}: OtpInputGroupProps) {
  return (
    <div className="flex items-center gap-3 mb-8" onPaste={onPasteOtp}>
      {/* Digits 1-3 */}
      {otp.slice(0, 3).map((digit, i) => (
        <Input
          key={i}
          ref={(el) => {
            if (inputRefs.current) inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChangeOtp(i, e.target.value)}
          onKeyDown={(e) => onKeyDownOtp(i, e)}
          autoFocus={i === 0}
          className="w-12 h-14 md:w-16 md:h-20 bg-black/30 border border-white/10 rounded-xl text-center text-2xl font-bold text-[#e5e2e3] focus:outline-none focus:border-[#b8c3ff] focus:shadow-[0_0_15px_rgba(184,195,255,0.3)] transition-all"
        />
      ))}

      {/* Middle Divider */}
      <div className="flex items-center justify-center text-white/20 mx-1">
        <span className="w-2 h-0.5 bg-white/20"></span>
      </div>

      {/* Digits 4-6 */}
      {otp.slice(3, 6).map((digit, i) => {
        const actualIndex = i + 3;
        return (
          <Input
            key={actualIndex}
            ref={(el) => {
              if (inputRefs.current) inputRefs.current[actualIndex] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onChangeOtp(actualIndex, e.target.value)}
            onKeyDown={(e) => onKeyDownOtp(actualIndex, e)}
            className="w-12 h-14 md:w-16 md:h-20 bg-black/30 border border-white/10 rounded-xl text-center text-2xl font-bold text-[#e5e2e3] focus:outline-none focus:border-[#b8c3ff] focus:shadow-[0_0_15px_rgba(184,195,255,0.3)] transition-all"
          />
        );
      })}
    </div>
  );
});

OtpInputGroup.displayName = 'OtpInputGroup';
