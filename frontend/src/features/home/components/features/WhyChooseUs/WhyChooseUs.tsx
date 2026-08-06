'use client';

import { CHOOSE_US_DATA } from '../../../data/WhyChooseUs/whyChooseUsData';
import { WhyChooseUsIcon } from './WhyChooseUsIcon';

export function WhyChooseUs() {
  return (
    <section className="feat-section" id="features">
      <div className="feat-header">
        <span className="feat-subtitle">Overview</span>
        <h2 className="feat-title">Why Students Choose Us</h2>
        <p className="feat-desc">Engineered to deliver the most efficient learning experience ever conceived.</p>
      </div>

      <div className="feat-grid-6">
        {CHOOSE_US_DATA.map((card) => (
          <div key={card.title} className="feat-card">
            <div className="feat-icon-wrapper">
              <WhyChooseUsIcon name={card.iconName} />
            </div>
            <h3 className="feat-card-title">{card.title}</h3>
            <p className="feat-card-desc">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
