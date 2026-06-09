import { useState, useEffect } from 'react';

function getVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis?.getVoices() ?? [];
}

export function useSpeechVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    const load = () => {
      const v = getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        const preferred = v.find(x => x.lang.startsWith('en') && x.localService) ?? v[0];
        setSelectedVoice(preferred?.voiceURI ?? preferred?.name ?? '');
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  return { voices, selectedVoice, setSelectedVoice };
}
