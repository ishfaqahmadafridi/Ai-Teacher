'use client';

import { memo, useCallback } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { cn } from '../../../utils';
import { ConsentLabel } from './ConsentLabel';
import { ConsentError } from './ConsentError';
import type { ConsentItemProps } from './ConsentItem.types';

export const ConsentItem = memo(function ConsentItem({
  id,
  checked,
  onChange,
  labelPrefix,
  linkHref,
  linkText,
  disabled = false,
  required = false,
  error,
  className,
}: ConsentItemProps) {
  const errorId = error ? `${id}-error` : undefined;

  // base-ui Checkbox.Root fires onCheckedChange(checked: boolean, eventDetails)
  // — no 'indeterminate' union needed; onChange always receives a plain boolean.
  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      onChange(checked);
    },
    [onChange]
  );

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2.5">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          required={required}
          onCheckedChange={handleCheckedChange}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="border-[#2c3345] bg-[#171c28] data-checked:bg-[#2e5bff] data-checked:border-[#2e5bff]"
        />
        <ConsentLabel
          htmlFor={id}
          labelPrefix={labelPrefix}
          linkHref={linkHref}
          linkText={linkText}
        />
      </div>

      {error && errorId && <ConsentError id={errorId} message={error} />}
    </div>
  );
});

ConsentItem.displayName = 'ConsentItem';

