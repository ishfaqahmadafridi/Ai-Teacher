import { ConsentItem } from '../ui/ConsentItem';

interface TermsConsentRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function TermsConsentRow({ checked, onChange, error }: TermsConsentRowProps) {
  return (
    <ConsentItem
      id="agreeToTerms"
      checked={checked}
      onChange={onChange}
      labelPrefix="I agree to the"
      linkHref="/terms"
      linkText="Terms & Conditions"
      error={error}
    />
  );
}

