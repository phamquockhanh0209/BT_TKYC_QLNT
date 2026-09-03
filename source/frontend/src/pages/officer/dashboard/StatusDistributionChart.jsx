import React from 'react';

export default function StatusDistributionChart() {
  const stats = [
    { label: "Chờ xử lý", count: 24, percent: 45, color: "#16a34a" },
    { label: "Đang xem xét", count: 62, percent: 25, color: "#f59e0b" },
    { label: "Yêu cầu bổ sung", count: 8, percent: 15, color: "#6366f1" },
    { label: "Đã duyệt", count: 40, percent: 10, color: "#14b8a6" },
    { label: "Từ chối", count: 6, percent: 5, color: "#ef4444" }
  ];

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề */}
      <div className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        THỐNG KÊ THEO TRẠNG THÁI
      </div>

      <div className="d-flex align-items-center justify-content-between g-3">
        {/* Biểu đồ tròn SVG */}
        <div style={{ width: '130px', height: '130px', flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            {/* Vòng 1: 45% (Chờ xử lý) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#16a34a"
              strokeWidth="20"
              strokeDasharray="99 121"
              strokeDashoffset="0"
            />
            {/* Vòng 2: 25% (Đang xem xét) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="20"
              strokeDasharray="55 165"
              strokeDashoffset="-99"
            />
            {/* Vòng 3: 15% (Yêu cầu bổ sung) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#6366f1"
              strokeWidth="20"
              strokeDasharray="33 187"
              strokeDashoffset="-154"
            />
            {/* Vòng 4: 10% (Đã duyệt) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#14b8a6"
              strokeWidth="20"
              strokeDasharray="22 198"
              strokeDashoffset="-187"
            />
            {/* Vòng 5: 5% (Từ chối) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="20"
              strokeDasharray="11 209"
              strokeDashoffset="-209"
            />
          </svg>
        </div>

        {/* Chú thích & Tỷ lệ */}
        <div className="flex-grow-1 ps-3 d-flex flex-column gap-1">
          {stats.map((s, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between fs-8">
              <div className="d-flex align-items-center gap-2">
                <span 
                  className="rounded-circle d-inline-block flex-shrink-0" 
                  style={{ width: '8px', height: '8px', backgroundColor: s.color }} 
                />
                <span className="text-dark fw-medium text-truncate" style={{ maxWidth: '100px' }}>{s.label}</span>
              </div>
              <span className="text-muted fw-bold">
                {s.count} <span className="fw-normal">({s.percent}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
