 'use client';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { CIRCUIT_EXAMPLE } from '../constants/circuitConstants';
import type { CircuitParameters } from '../types/circuit.types';
export function useCircuitLesson(parameters?: CircuitParameters) {
  const initialVoltage = parameters?.voltage ?? CIRCUIT_EXAMPLE.voltage;
  const initialResistance = parameters?.resistance ?? CIRCUIT_EXAMPLE.resistance;
  const [voltage, setVoltage] = useState(initialVoltage);
  const [resistance, setResistance] = useState(initialResistance);
  const handleVoltageChange = (event: ChangeEvent<HTMLInputElement>) => setVoltage(Number(event.target.value));
  const handleResistanceChange = (event: ChangeEvent<HTMLInputElement>) => setResistance(Number(event.target.value));
  return { handleVoltageChange, handleResistanceChange, voltage, resistance, current: voltage / resistance, setVoltage, setResistance, illustrative: !parameters };
}
