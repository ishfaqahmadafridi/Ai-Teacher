import { chatStreamEventSchema } from '../validators/ask.schema';

/** Decode SSE across arbitrary byte boundaries, including UTF-8 and CRLF. */
export async function readChatStream(body: ReadableStream<Uint8Array>, onToken: (token: string) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let complete = false;
  const consume = (event: string) => {
    const data = event.split('\n').filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
    if (!data) return;
    const payload = chatStreamEventSchema.parse(JSON.parse(data));
    if (payload.error) throw new Error(payload.error);
    if (payload.token) onToken(payload.token);
    complete = payload.done;
  };
  try {
    while (!complete) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, '\n');
      let boundary;
      while (!complete && (boundary = buffer.indexOf('\n\n')) >= 0) {
        consume(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
      }
      if (done) {
        if (!complete && buffer.trim()) consume(buffer);
        if (!complete) throw new Error('The response was interrupted. Please try again.');
        break;
      }
    }
  } finally {
    try { await reader.cancel(); } finally { reader.releaseLock(); }
  }
}
