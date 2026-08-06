export interface ConsentItemProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelPrefix: string;
  linkHref: string;
  linkText: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}
