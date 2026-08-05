'use client';

import { Label } from '../Label/Label';
import { ConsentLink } from './ConsentLink';

interface ConsentLabelProps {
  htmlFor: string;
  labelPrefix: string;
  linkHref: string;
  linkText: string;
}

/**
 * Renders the label text alongside the policy link for a consent checkbox row.
 */
export function ConsentLabel({
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
}
