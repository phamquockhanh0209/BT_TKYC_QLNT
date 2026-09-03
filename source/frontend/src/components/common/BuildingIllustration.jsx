import React from 'react';

/**
 * Bản vẽ minh họa kiến trúc tòa nhà giảng đường / đại học theo phong cách sketch
 */
export default function BuildingIllustration({ width = "100%", height = "140px", className = "" }) {
  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`} style={{ width, height, overflow: 'hidden', opacity: 0.85 }}>
      <svg
        viewBox="0 0 300 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      >
        {/* Ground */}
        <line x1="10" y1="220" x2="290" y2="220" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="225" x2="280" y2="225" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5 3" />

        {/* Building Base & Pillars */}
        <rect x="50" y="80" width="200" height="140" fill="#ffffff" stroke="#334155" strokeWidth="2.5" />
        
        {/* Columns / Pillars */}
        <rect x="70" y="110" width="18" height="105" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />
        <rect x="110" y="110" width="18" height="105" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />
        <rect x="172" y="110" width="18" height="105" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />
        <rect x="212" y="110" width="18" height="105" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />

        {/* Pediment / Triangular Roof */}
        <polygon points="40,80 150,20 260,80" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <polygon points="60,75 150,28 240,75" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="150" cy="55" r="14" fill="#ffffff" stroke="#475569" strokeWidth="1.8" />
        <line x1="150" y1="45" x2="150" y2="65" stroke="#64748b" strokeWidth="1.2" />
        <line x1="140" y1="55" x2="160" y2="55" stroke="#64748b" strokeWidth="1.2" />

        {/* Center Entrance */}
        <path d="M135 220 V 150 C 135 142 165 142 165 150 V 220 Z" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
        <line x1="150" y1="150" x2="150" y2="220" stroke="#475569" strokeWidth="1.5" />

        {/* Windows on side wings */}
        <rect x="52" y="90" width="14" height="20" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
        <rect x="234" y="90" width="14" height="20" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />

        {/* Balustrade / Architrave */}
        <line x1="45" y1="110" x2="255" y2="110" stroke="#334155" strokeWidth="2" />
        <line x1="48" y1="115" x2="252" y2="115" stroke="#94a3b8" strokeWidth="1" />

        {/* Steps */}
        <rect x="40" y="215" width="220" height="5" fill="#f1f5f9" stroke="#475569" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
