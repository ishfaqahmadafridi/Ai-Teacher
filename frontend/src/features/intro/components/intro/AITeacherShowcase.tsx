'use client';

import { memo } from 'react';
import { CTAButton } from './CTAButton';

export const AITeacherShowcase = memo(function AITeacherShowcase() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16">
      <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#101a28] via-[#0b121e] to-[#070b13] p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider font-mono">
              AI Classroom Simulator
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight leading-tight">
              Interactive Physics Teacher & Visual Learning Studio
            </h2>
            <p className="mt-4 text-blue-100/70 text-base leading-relaxed">
              Step into an immersive digital classroom with an AI teacher avatar, live voice interactions, real-time math proofs, dynamic physics simulation widgets, and automated homework evaluation.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              {['Kinematics & Newton Laws', 'Optics & Wave Motion', 'Quantum Mechanics', 'Thermodynamics'].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-cyan-300"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
            <CTAButton label="Experience AI Teacher Simulator" className="mt-8" />
          </div>

          {/* Interactive Graphic Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-3xl border border-cyan-400/40 bg-[#060b12] p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400">Classroom: Physics 101</span>
              </div>

              {/* Simulated Teacher Canvas */}
              <div className="flex-1 my-4 rounded-xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-blue-950/20 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-1 animate-pulse shadow-[0_0_30px_#22d3ee]">
                  <div className="w-full h-full bg-[#0a111a] rounded-full flex items-center justify-center text-3xl">
                    🤖
                  </div>
                </div>
                <span className="mt-3 text-sm font-semibold text-white">Dr. Neuro AI Tutor</span>
                <span className="text-xs text-cyan-300/80 font-mono">"Let's simulate projectile motion..."</span>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-200/60 font-mono">
                <span>FPS: 60</span>
                <span>Latency: 180ms</span>
                <span className="text-cyan-400">Connected ●</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

AITeacherShowcase.displayName = 'AITeacherShowcase';
