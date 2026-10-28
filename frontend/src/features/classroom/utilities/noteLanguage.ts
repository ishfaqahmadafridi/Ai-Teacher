import ISO6391 from 'iso-639-1';

export function resolveNoteLanguageCode(language: string): string {
  const value = language.trim();
  const code = value.toLowerCase();
  return ISO6391.validate(code) ? code : ISO6391.getCode(value);
}
