'use client';

import { AmbientGlows } from './AmbientGlows';
import { AuthNavbar } from './AuthNavbar';
import { GlassCard } from './GlassCard';
import { AuthHeader } from './AuthHeader';
import { CreateAccountForm } from './CreateAccountForm';

export function CreateAccountPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col overflow-x-hidden"
      style={{ background: '#0A0F1D', fontFamily: 'Inter, sans-serif' }}
    >
      <AmbientGlows />
      <AuthNavbar />
      <GlassCard>
        <AuthHeader
          title="Start Your Journey"
          subtitle="Begin your high-tech gateway to the future of learning."
        />
        <CreateAccountForm />
      </GlassCard>
    </div>
  );
}
