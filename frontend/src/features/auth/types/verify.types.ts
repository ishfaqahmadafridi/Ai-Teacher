import type { KeyboardEvent, ClipboardEvent } from 'react';

export type VerificationMethod = 'email' | 'sms';

export interface VerifyOtpFormData {
  method: VerificationMethod;
  code: string;
}

export interface MethodSelectorProps {
  method: VerificationMethod;
  onSelectMethod: (method: VerificationMethod) => void;
}

export interface OtpInputGroupProps {
  otp: string[];
  inputRefs: import('react').RefObject<(HTMLInputElement | null)[]>;
  onChangeOtp: (index: number, value: string) => void;
  onKeyDownOtp: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onPasteOtp: (e: ClipboardEvent<HTMLInputElement>) => void;
}

export interface ResendTimerProps {
  timer: number;
  onResend: () => void;
  isLoading?: boolean;
  canResend?: boolean;
}
