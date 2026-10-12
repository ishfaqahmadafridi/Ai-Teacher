"""Generate bounded WAV speech from private saved chunks, without an LLM."""
import hashlib
import shutil
import subprocess
import sys
import wave
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
from django.core.cache import cache
from rest_framework.exceptions import APIException, ValidationError
from apps.classroom.constants.audio import AUDIO_TIMEOUT_SECONDS, AUDIO_MAX_CHARACTERS, AUDIO_MAX_BYTES, AUDIO_CACHE_SECONDS


class AudioUnavailable(APIException):
    status_code = 503
    default_detail = 'Server speech is unavailable. Your lesson remains saved.'


def generate_audio(text, language):
    if len(text) > AUDIO_MAX_CHARACTERS:
        raise ValidationError('This speech segment exceeds the audio size limit.')
    if language.split('-')[0] != 'en':
        raise ValidationError('This local speech provider currently supports English lessons only.')
    with TemporaryDirectory(prefix='classroom-speech-') as directory:
        target = Path(directory) / 'speech.wav'
        if sys.platform == 'darwin' and shutil.which('say'):
            command = ['say', '--file-format=WAVE', '--data-format=LEI16@22050', '-o', str(target)]
        elif shutil.which('espeak-ng'):
            command = ['espeak-ng', '-v', 'en', '-w', str(target), '--stdin']
        else:
            raise AudioUnavailable()
        try:
            subprocess.run(command, input=text, text=True, timeout=AUDIO_TIMEOUT_SECONDS,
                           check=True, capture_output=True)
            if target.stat().st_size > AUDIO_MAX_BYTES:
                raise ValueError('Oversized audio')
            data = target.read_bytes()
            with wave.open(BytesIO(data)) as audio:
                if not audio.getnframes():
                    raise ValueError('Empty audio')
            return data
        except (subprocess.SubprocessError, OSError, ValueError, EOFError, wave.Error):
            raise AudioUnavailable() from None


def lesson_audio(note, section_index):
    if section_index >= len(note.answer['chunks']):
        raise ValidationError('Unknown lesson section.')
    text = note.answer['chunks'][section_index]['speak']
    key = 'lesson-audio:v1:' + hashlib.sha256(f'{note.id}:{note.version}:{section_index}'.encode()).hexdigest()
    try:
        saved = cache.get(key)
    except Exception:
        saved = None
    if saved is not None:
        return saved
    data = generate_audio(text, note.answer['language'])
    try:
        cache.set(key, data, AUDIO_CACHE_SECONDS)
    except Exception:
        pass
    return data
