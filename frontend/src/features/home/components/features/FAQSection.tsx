import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../../constants/faqConstants';

export const FAQSection = memo(function FAQSection() {
  return (
    <section className="feat-section" id="faq">
      <div className="feat-header">
        <span className="feat-subtitle">Questions, answered</span>
        <h2 className="feat-title">Frequently asked questions</h2>
        <p className="feat-desc">A few things to know before you start.</p>
      </div>
      <div className="home-faq">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question}>
            <summary>{item.question}<ChevronDown aria-hidden="true" size={20} strokeWidth={1.75} /></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';
