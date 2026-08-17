'use client';

import { memo } from 'react';
import { useFeatureGrid } from '../../hooks/useFeatureGrid';
import { FEATURE_HIGHLIGHTS } from '../../constants/featureGridConstants';

export const FeatureGridSection = memo(function FeatureGridSection() {
  const { selectedFeatureId, handleSelectFeature, selectedFeature } = useFeatureGrid();

  return (
    <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Next-Generation <span className="text-cyan-400">AI Education</span> Architecture
        </h2>
        <p className="mt-4 text-blue-100/60 max-w-2xl mx-auto text-base">
          Built for interactive comprehension with high-performance real-time simulation, SSE streaming, and voice dialogs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Feature List (Left side - 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {FEATURE_HIGHLIGHTS.map((item) => {
            const isSelected = item.id === selectedFeatureId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectFeature(item.id)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <span className="text-xs text-cyan-400/80 font-mono">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-blue-100/60 leading-relaxed mt-2">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Feature Showcase Card (Right side - 7 cols) */}
        <div className="lg:col-span-7 relative">
          <div className="rounded-3xl border border-cyan-500/30 bg-[#101926]/90 p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedFeature.icon}</span>
                <div>
                  <h4 className="text-xl font-bold text-white">
                    {selectedFeature.title}
                  </h4>
                  <span className="text-xs text-cyan-400 font-mono">
                    {selectedFeature.subtitle}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {selectedFeature.badge}
              </span>
            </div>

            {/* Dynamic Card Display Content */}
            <div className="relative min-h-[260px] rounded-2xl border border-white/10 bg-[#0a0f18] p-6 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {selectedFeature.previewType === 'simulator' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
                    <span>Simulating: Projectile Trajectory & Vectors</span>
                    <span className="animate-pulse">● LIVE 60 FPS</span>
                  </div>
                  <div className="h-32 rounded-xl border border-cyan-500/20 bg-cyan-950/30 flex items-center justify-center p-4">
                    <div className="w-full flex items-center justify-between px-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold">
                        g=9.8
                      </div>
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-4 relative">
                        <div className="absolute -top-3 right-1/2 w-6 h-6 rounded-full bg-purple-400 animate-bounce shadow-[0_0_10px_#c084fc]" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 font-bold">
                        v₀
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedFeature.previewType === 'voice' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs text-purple-400 font-mono">
                    <span>Voice Synthesizer & Audio Waves</span>
                    <span className="animate-pulse">● Active Listener</span>
                  </div>
                  <div className="h-32 rounded-xl border border-purple-500/20 bg-purple-950/30 flex items-center justify-center gap-1.5 px-6">
                    {[40, 70, 30, 90, 50, 80, 60, 100, 45, 85, 35, 75].map((h, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-full bg-gradient-to-t from-purple-500 to-cyan-400 animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedFeature.previewType === 'blackboard' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-mono">
                    <span>Dynamic Blackboard Canvas</span>
                    <span>Auto-Render active</span>
                  </div>
                  <div className="h-32 rounded-xl border border-blue-500/20 bg-[#08121e] p-4 font-mono text-xs text-cyan-300 flex flex-col justify-center gap-2">
                    <div>F = m * a  ==&gt; [Force = Mass * Acceleration]</div>
                    <div className="text-purple-300">∫ v(t) dt = s(t) + C  [Velocity to Displacement]</div>
                    <div className="text-emerald-300">E = h * ν  [Quantum Energy Photons]</div>
                  </div>
                </div>
              )}

              {selectedFeature.previewType === 'analytics' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                    <span>Comprehension & Performance Curve</span>
                    <span>Score: 96% Mastery</span>
                  </div>
                  <div className="h-32 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-4 flex items-end gap-3">
                    {[35, 50, 65, 80, 95, 92, 98].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-cyan-400"
                          style={{ height: `${val * 0.8}%` }}
                        />
                        <span className="text-[9px] text-emerald-300/80 font-mono">W{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs text-blue-100/70">
                {selectedFeature.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

FeatureGridSection.displayName = 'FeatureGridSection';
