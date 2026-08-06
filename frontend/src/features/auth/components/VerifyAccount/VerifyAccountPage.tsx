'use client';

import { AmbientGlows } from '../CreateAccount/AmbientGlows';
import { AuthNavbar } from '../CreateAccount/AuthNavbar';
import { VerifyAccountForm } from './VerifyAccountForm';

export function VerifyAccountPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-10 py-12 relative overflow-x-hidden"
      style={{ background: '#0A0F1D', fontFamily: 'Inter, sans-serif' }}
    >
      <AmbientGlows />
      <AuthNavbar />

      <main className="w-full max-w-2xl pt-24 pb-16 relative z-10">
        <VerifyAccountForm />
      </main>
    </div>
  );
}
