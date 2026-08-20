'use client';

import { memo } from 'react';
import { Label } from '../Label/Label';
import { ConsentLink } from './ConsentLink';
import type { ConsentLabelProps } from '../../../types/createAccount.types';

export const ConsentLabel = memo(function ConsentLabel({
  htmlFor,
  labelPrefix,
  linkHref,
  linkText,
}: ConsentLabelProps) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-xs font-medium cursor-pointer text-[#c4c5d9] select-none"
    >
      {labelPrefix}{' '}
      <ConsentLink href={linkHref} text={linkText} />
    </Label>
  );
});

ConsentLabel.displayName = 'ConsentLabel';
