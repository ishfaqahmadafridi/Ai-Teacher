/** Prefer the requested voice, then same-language installed voices that have not failed. */
export function selectSpeechVoice(voices: SpeechSynthesisVoice[], selectedURI: string, failed: Set<string>, language: string) {
  const usable = voices.filter(voice => !failed.has(voice.voiceURI));
  const matches = (voice: SpeechSynthesisVoice) => voice.lang.split('-')[0] === language.split('-')[0];
  return usable.find(voice => voice.voiceURI === selectedURI)
    ?? usable.find(voice => matches(voice) && voice.default && voice.localService)
    ?? usable.find(voice => matches(voice) && voice.localService)
    ?? usable.find(voice => matches(voice))
    ?? usable.find(voice => voice.default) ?? usable[0];
}
