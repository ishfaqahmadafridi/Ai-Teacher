import type { CountryCodeOption, SocialProviderOption } from '../types/createAccount.types';

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
];

export const DEFAULT_COUNTRY_CODE = '+92';

export const INPUT_BASE_CLASSES =
  'w-full rounded-xl px-4 py-3 text-white text-sm placeholder-[#64748b] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]';

export const SOCIAL_PROVIDERS: SocialProviderOption[] = [
  {
    id: 'google',
    label: 'Google',
    provider: 'google',
  },
  {
    id: 'microsoft',
    label: 'Microsoft',
    provider: 'microsoft',
  },
  {
    id: 'apple',
    label: 'Apple',
    provider: 'apple',
  },
];
