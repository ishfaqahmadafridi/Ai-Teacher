import Image from 'next/image';
import { FUTURE_ITEMS } from '../../../data/FutureInterface/futureInterfaceData';
import { FutureInterfaceIcon } from './FutureInterfaceIcon';

export function FutureInterface() {
  return (
    <section className="feat-section" id="future-interface">
      <div className="future-flex">
        {/* Left Side: Content */}
        <div className="future-left">
          <span className="feat-subtitle">Design System</span>
          <h2 className="feat-title">
            Experience the <span className="future-title-gradient">Future Interface</span>
          </h2>
          <p className="feat-desc">
            Our dashboard isn't just a list of courses. It's a high-tech command center designed to 
            eliminate friction, optimize cognitive loading, and maximize focus.
          </p>

          <div className="future-list">
            {FUTURE_ITEMS.map((item) => (
              <div key={item.title} className="future-item-card">
                <div className="future-item-icon">
                  <FutureInterfaceIcon name={item.iconName} />
                </div>
                <div>
                  <h4 className="future-item-title">{item.title}</h4>
                  <p className="future-item-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Smartphone Mockup */}
        <div className="future-right">
          <div className="future-mockup-container">
            <div className="future-mockup-glow" />
            <div className="future-mockup-img" style={{ width: 420, height: 420 }}>
              <Image
                src="/future-interface-phone.png"
                alt="AI Learning Dashboard Mockup"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FutureInterface;
