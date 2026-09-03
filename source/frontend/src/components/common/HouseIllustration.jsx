import React from 'react';

/**
 * Bản vẽ minh họa kiến trúc nhà trọ / căn hộ sinh viên thanh lịch phong cách sketch
 */
export default function HouseIllustration({ width = "100%", height = "180px", className = "" }) {
  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`} style={{ width, height, overflow: 'hidden' }}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      >
        {/* Background & Ground */}
        <line x1="20" y1="260" x2="380" y2="260" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="265" x2="390" y2="265" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />

        {/* Tree on the Right */}
        <path d="M335 260 V 170" stroke="#475569" strokeWidth="3" />
        <ellipse cx="335" cy="150" rx="30" ry="40" fill="#f1f5f9" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
        <ellipse cx="320" cy="165" rx="22" ry="32" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
        <ellipse cx="350" cy="165" rx="20" ry="30" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />

        {/* Tree on the Left */}
        <path d="M65 260 V 200" stroke="#64748b" strokeWidth="2.5" />
        <circle cx="65" cy="180" r="24" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />

        {/* House Main Body */}
        <rect x="100" y="110" width="200" height="150" fill="#ffffff" stroke="#334155" strokeWidth="2.5" />
        <line x1="100" y1="180" x2="300" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Roof */}
        <polygon points="80,110 200,45 320,110" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="100" y1="100" x2="200" y2="52" stroke="#94a3b8" strokeWidth="1" />
        <line x1="200" y1="52" x2="300" y2="100" stroke="#94a3b8" strokeWidth="1" />
        <rect x="250" y="55" width="20" height="35" fill="#ffffff" stroke="#334155" strokeWidth="2" />

        {/* 2nd Floor Balcony */}
        <rect x="180" y="125" width="80" height="55" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
        <line x1="220" y1="125" x2="220" y2="180" stroke="#475569" strokeWidth="1.5" />
        {/* Balcony Railings */}
        <rect x="175" y="155" width="90" height="25" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
        <line x1="185" y1="155" x2="185" y2="180" stroke="#64748b" strokeWidth="1.2" />
        <line x1="195" y1="155" x2="195" y2="180" stroke="#64748b" strokeWidth="1.2" />
        <line x1="205" y1="155" x2="205" y2="180" stroke="#64748b" strokeWidth="1.2" />
        <line x1="215" y1="155" x2="215" y2="180" stroke="#64748b" strokeWidth="1.2" />
        <line x1="225" y1="155" x2="225" y2="180" stroke="#64748b" strokeWidth="1.2" />
        <line x1="235" y1="155" x2="235" y2="180" stroke="#64748b" strokeWidth="1.2" />
        <line x1="245" y1="155" x2="245" y2="180" stroke="#64748b" strokeWidth="1.2" />
        <line x1="255" y1="155" x2="255" y2="180" stroke="#64748b" strokeWidth="1.2" />

        {/* 2nd Floor Window Left */}
        <rect x="125" y="130" width="35" height="35" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
        <line x1="142" y1="130" x2="142" y2="165" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="125" y1="147" x2="160" y2="147" stroke="#94a3b8" strokeWidth="1.5" />

        {/* 1st Floor Door & Porch */}
        <rect x="195" y="200" width="45" height="60" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
        <circle cx="232" cy="230" r="2.5" fill="#334155" />
        <rect x="125" y="205" width="40" height="40" fill="#ffffff" stroke="#475569" strokeWidth="2" />
        <line x1="145" y1="205" x2="145" y2="245" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="125" y1="225" x2="165" y2="225" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Front Gate & Fence */}
        <rect x="90" y="230" width="220" height="30" fill="none" stroke="#475569" strokeWidth="1.8" />
        <line x1="110" y1="230" x2="110" y2="260" stroke="#64748b" strokeWidth="1.2" />
        <line x1="130" y1="230" x2="130" y2="260" stroke="#64748b" strokeWidth="1.2" />
        <line x1="150" y1="230" x2="150" y2="260" stroke="#64748b" strokeWidth="1.2" />
        <line x1="170" y1="230" x2="170" y2="260" stroke="#64748b" strokeWidth="1.2" />
        <line x1="190" y1="230" x2="190" y2="260" stroke="#334155" strokeWidth="2" />
        <line x1="210" y1="230" x2="210" y2="260" stroke="#64748b" strokeWidth="1.2" />
        <line x1="230" y1="230" x2="230" y2="260" stroke="#64748b" strokeWidth="1.2" />
        <line x1="250" y1="230" x2="250" y2="260" stroke="#334155" strokeWidth="2" />
        <line x1="270" y1="230" x2="270" y2="260" stroke="#64748b" strokeWidth="1.2" />
        <line x1="290" y1="230" x2="290" y2="260" stroke="#64748b" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
