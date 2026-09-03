import React from 'react';
import { Cpu, Zap, Activity } from 'lucide-react';

export default function NeuralCore({ sifCount, totalCount, status = 'ACTIVE' }) {
  const isAlert = sifCount > 0;
  const coreColor = isAlert ? '#ef4444' : '#06b6d4';
  const glowClass = isAlert ? 'glow-sif' : 'glow-cyan';

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Outer Holographic Orbital Ring 1 */}
      <div 
        className="absolute w-24 h-24 rounded-full border border-dashed animate-spin"
        style={{ 
          borderColor: `${coreColor}40`,
          animationDuration: '12s'
        }} 
      />

      {/* Outer Holographic Orbital Ring 2 (Reverse Spin) */}
      <div 
        className="absolute w-20 h-20 rounded-full border border-dotted animate-spin"
        style={{ 
          borderColor: `${coreColor}60`,
          animationDuration: '8s',
          animationDirection: 'reverse'
        }} 
      />

      {/* Core Glowing Sphere */}
      <div 
        className={`w-14 h-14 rounded-full bg-gradient-to-tr ${
          isAlert ? 'from-red-600 via-amber-500 to-red-400' : 'from-cyan-600 via-blue-500 to-cyan-400'
        } flex items-center justify-center shadow-2xl ${glowClass} relative z-10 transition-all duration-500`}
      >
        {/* Pulsing Energy Core Icon */}
        <Cpu className="w-7 h-7 text-slate-950 animate-pulse" />
        
        {/* Ambient Ring Pulse */}
        <span 
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: coreColor }}
        />
      </div>

      {/* Data Pulse Particles floating around core */}
      <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-80" />
      <div className="absolute bottom-2 left-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping opacity-70" />
    </div>
  );
}
