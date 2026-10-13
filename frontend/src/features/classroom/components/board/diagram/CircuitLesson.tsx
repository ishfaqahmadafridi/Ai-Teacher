 'use client';
import { memo } from 'react';
import { useCircuitLesson } from '../../../hooks/useCircuitLesson';
import { CIRCUIT_LIMITS } from '../../../constants/circuitConstants';
import type { CircuitLessonProps } from '../../../types/circuit.types';
export const CircuitLesson = memo(function CircuitLesson({ parameters }: CircuitLessonProps) {
  const { voltage, resistance, current, handleVoltageChange, handleResistanceChange, illustrative } = useCircuitLesson(parameters);
  return <section className="w-full h-full flex flex-col justify-center gap-4 p-4 text-slate-100">
    <h3 className="text-lg font-semibold">Ohm’s Law — one resistor</h3>
    <p className="text-sm text-slate-400">{illustrative ? 'Illustrative values. Adjust them to explore the relationship.' : 'Lesson example. Adjusting controls explores a different case.'}</p>
    <svg data-lecture-svg viewBox="0 0 600 320" width="600" height="320" className="w-full h-auto" role="img" aria-label={`A battery supplies ${voltage} volts across a ${resistance} ohm resistor, producing ${current.toFixed(2)} amperes.`}>
      <rect width="600" height="320" rx="16" fill="#0f172a" />
      <path d="M120 135 V70 H440 V120 M440 200 V260 H120 V185" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <path d="M85 135 H155 M100 155 H140 M85 175 H155 M100 195 H140" stroke="#e2e8f0" strokeWidth="5" />
      <rect x="422" y="120" width="36" height="80" fill="#334155" stroke="#fbbf24" strokeWidth="4" />
      <path d="M260 70 H315 L302 60 M315 70 L302 80" fill="none" stroke="#34d399" strokeWidth="4" />
      <text x="185" y="42" fill="#34d399" fontSize="20">I = {current.toFixed(2)} A</text>
      <text x="20" y="225" fill="#e2e8f0" fontSize="18">V = {voltage} V</text>
      <text x="470" y="168" fill="#fbbf24" fontSize="18">R = {resistance} Ω</text>
      <text x="185" y="300" fill="#e2e8f0" fontSize="18">I = V / R = {voltage} / {resistance} = {current.toFixed(2)} A</text>
    </svg>
    <label className="text-sm">Voltage: {voltage} V<input aria-label="Voltage in volts" type="range" {...CIRCUIT_LIMITS.voltage} value={voltage} onChange={handleVoltageChange} className="block w-full" /></label>
    <label className="text-sm">Resistance: {resistance} Ω<input aria-label="Resistance in ohms" type="range" {...CIRCUIT_LIMITS.resistance} value={resistance} onChange={handleResistanceChange} className="block w-full" /></label>
    <p className="text-xs text-slate-400">Ideal ohmic resistor at constant temperature. This model does not describe every component.</p>
  </section>;
});
CircuitLesson.displayName = 'CircuitLesson';
