'use client';

import { useState } from 'react';
import type { TailoredLevelTab } from '../../../types';
import { LEVEL_TABS, TAB_CARDS } from '../../../data/TailoredLevels/tailoredLevelsData';
import { TailoredLevelsIcon } from './TailoredLevelsIcon';

export function TailoredLevels() {
  const [activeTab, setActiveTab] = useState<TailoredLevelTab['id']>('k12');

  return (
    <section className="feat-section" id="faq">
      <div className="feat-header">
        <span className="feat-subtitle">Adaptability</span>
        <h2 className="feat-title">Tailored for Every Level</h2>
      </div>

      {/* Tabs */}
      <div className="level-tabs">
        {LEVEL_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`level-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <TailoredLevelsIcon name={tab.iconName} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="level-grid-4">
        {TAB_CARDS[activeTab].map((card) => (
          <div key={card.title} className="level-card">
            <div className="level-icon-box">
              <TailoredLevelsIcon name={card.iconName} />
            </div>
            <h3 className="level-card-title">{card.title}</h3>
            <p className="level-card-desc">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TailoredLevels;
