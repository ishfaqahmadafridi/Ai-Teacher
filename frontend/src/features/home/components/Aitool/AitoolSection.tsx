'use client';

import { AitoolCard } from './AitoolCard';
import { AI_TOOLS_DATA } from '../../data/Aitool/aiTools';

export function AitoolSection() {
  return (
    <section className="feat-section" id="ai-tools">
      <div className="feat-header">
        <span className="feat-subtitle">AI Powerhouses</span>
        <h2 className="feat-title">Advanced AI Tool Suite</h2>
        <p className="feat-desc">Unlock state-of-the-art educational engines designed to elevate intellectual potential.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {AI_TOOLS_DATA.map((tool) => (
          <AitoolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export default AitoolSection;
