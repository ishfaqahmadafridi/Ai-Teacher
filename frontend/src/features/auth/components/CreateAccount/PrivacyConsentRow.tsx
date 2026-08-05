import { ConsentItem } from '../ui/ConsentItem';

interface PrivacyConsentRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function PrivacyConsentRow({ checked, onChange, error }: PrivacyConsentRowProps) {
  return (
    <ConsentItem
      id="agreeToPrivacy"
      checked={checked}
      onChange={onChange}
      labelPrefix="I agree to the"
      linkHref="/privacy"
      linkText="Privacy Policy"
      error={error}
    />
  );
}

