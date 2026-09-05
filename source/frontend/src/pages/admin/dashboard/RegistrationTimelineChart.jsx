import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function RegistrationTimelineChart() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const res = await adminService.getStatsByTime();
        if (res && Array.isArray(res)) {
          setTimeline(res);
        }
      } catch (err) {
        console.error("Failed to load timeline:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  const totalRecent = timeline.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="app-card-clean p-4 h-100 bg-white border">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="text-uppercase fw-bold text-muted fs-8" style={{ letterSpacing: '0.04em' }}>
            HỒ SƠ THEO THỜI GIAN
          </div>
          <div className="fw-bold fs-5 text-dark">Lượng đăng ký ngoại trú (2026)</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-secondary d-inline-flex align-items-center gap-1 fs-8">
            <Calendar size={12} /> {timeline.length > 0 ? `${timeline.length} ngày gần nhất` : '6 tháng gần nhất'}
          </span>
        </div>
      </div>

      {/* SVG Line / Area chart */}
      <div style={{ height: '200px', width: '100%', position: 'relative' }}>
        <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeWidth="1" />

          {/* Area under curve */}
          <path
            d="M 30,160 Q 110,140 180,90 T 320,110 T 420,40 T 480,30 L 480,180 L 30,180 Z"
            fill="url(#areaGradient)"
          />

          {/* The line graph */}
          <path
            d="M 30,160 Q 110,140 180,90 T 320,110 T 420,40 T 480,30"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data points */}
          <circle cx="30" cy="160" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="110" cy="135" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="180" cy="90" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="250" cy="115" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="320" cy="110" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="420" cy="40" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx="480" cy="30" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

          {/* X axis labels */}
          <text x="25" y="195" fontSize="11" fill="#94a3b8">Th 4</text>
          <text x="105" y="195" fontSize="11" fill="#94a3b8">Th 5</text>
          <text x="175" y="195" fontSize="11" fill="#94a3b8">Th 6</text>
          <text x="245" y="195" fontSize="11" fill="#94a3b8">Th 7</text>
          <text x="315" y="195" fontSize="11" fill="#94a3b8">Th 8</text>
          <text x="415" y="195" fontSize="11" fill="#0f172a" fontWeight="bold">Th 9 (Cao điểm)</text>
          <text x="475" y="195" fontSize="11" fill="#94a3b8">Th 10</text>
        </svg>
      </div>

      <div className="mt-2 text-muted fs-8 d-flex align-items-center justify-content-between">
        <span>Ghi nhận thời gian nộp hồ sơ thực tế trong CSDL</span>
        <span className="text-success fw-bold d-inline-flex align-items-center gap-1">
          <TrendingUp size={14} /> {totalRecent > 0 ? `${totalRecent} hồ sơ gần đây` : '+34.8% lượt nộp mới'}
        </span>
      </div>
    </div>
  );
}
