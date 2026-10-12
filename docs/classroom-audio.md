# Local classroom audio

The browser speech engine remains the initial playback path. If it fails to start, authenticated saved lecture chunks are fetched as WAV files and played using HTMLAudioElement. Subsequent chunks use file playback for that classroom mount. This does not use a WebSocket or another LLM call.

The private POST /api/notes/{id}/audio/{section}/ endpoint verifies that requested speech exactly matches the saved chunk. GET supports authorized retrieval. Owner checks, input limits, native-process timeouts, output-size validation and per-user throttling apply. Text is passed to subprocess stdin without a shell. Temporary files are removed after generation. Best-effort Django caching reuses generated WAV bytes.

For local macOS development the provider is the installed say executable. Linux Docker installs espeak-ng; rebuild the backend image to include it. Currently only English is supported; other languages are rejected explicitly rather than synthesized using an unrelated voice. In-process caching and synchronous synthesis are local-development choices, not a proven 1000-user deployment. Production needs a queued reusable audio asset provider and shared limits.

A media autoplay rejection is reported; Retry audio is an explicit click. Native WAV generation can be verified independently of Chrome. Actual audible browser playback and output-device settings still require user verification.
