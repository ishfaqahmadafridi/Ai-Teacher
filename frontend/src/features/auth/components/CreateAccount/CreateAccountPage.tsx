'use client';

import { memo } from 'react';
import { AuthBrand } from '../AuthBrand';
import { AuthPageLayout } from '../AuthPageLayout';
import { useRegister } from '../../hooks/useRegister';
import { AuthLearningPanel } from '../AuthLearningPanel';
import { CreateAccountForm } from './CreateAccountForm';

export const CreateAccountPage = memo(function CreateAccountPage() {
  const registerState = useRegister();

  return (
    <AuthPageLayout>
      {/* ── Left Form Panel ── */}
      <div className="w-full min-w-0 flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
        {/* Form content */}
        <div className="w-full max-w-[34rem]">
          <AuthBrand />
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-panel p-5 sm:p-8">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-dashboard-text mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-dashboard-muted text-base mb-8">
            Create your account and start learning at your pace.
          </p>

          {/* Form Component */}
          <CreateAccountForm {...registerState} />
          </div>
        </div>
      </div>

      <AuthLearningPanel />
    </AuthPageLayout>
  );
});

CreateAccountPage.displayName = 'CreateAccountPage';
