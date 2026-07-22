'use client';

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ProfileFormHeader() {
  return (
    <CardHeader className="p-0 mb-8 space-y-2">
      <CardTitle className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Complete Your Student Profile
      </CardTitle>
      <CardDescription className="text-[#c6c6cc] text-sm">
        Tell us a little about yourself so we can personalize your learning experience.
      </CardDescription>
    </CardHeader>
  );
}
