export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function stripForSpeech(text: string): string {
  return text
    .replace(/<svg[\s\S]*?<\/svg>/gi, 'See the diagram on screen.')
    .replace(/\$\$[\s\S]*?\$\$/g, 'See the formula on screen.')
    .replace(/\$[^$]*?\$/g, 'See the formula on screen.')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#*_~>`|]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
