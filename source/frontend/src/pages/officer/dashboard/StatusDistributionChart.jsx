import React from 'react';

const STATUS_COLOR_MAP = {
  SUBMITTED:    { label: 'Chờ xử lý', color: '#f59e0b' },
  UNDER_REVIEW: { label: 'Đang xem xét', color: '#3b82f6' },
  PROCESSING:   { label: 'Đang xử lý', color: '#6366f1' },
  APPROVED:     { label: 'Đã duyệt', color: '#16a34a' },
  ACTIVE:       { label: 'Hiệu lực', color: '#10b981' },
  REJECTED:     { label: 'Bổ sung / Từ chối', color: '#ef4444' },
  DRAFT:        { label: 'Bản nháp', color: '#94a3b8' },
};

export default function StatusDistributionChart({ data = [] }) {
  // Chuẩn hóa dữ liệu thống kê từ API hoặc tính toán
  const total = data.reduce((sum, item) => sum + (item.count || item.total || 0), 0) || 1;

  const stats = data.length > 0 ? data.map(item => {
    const statusKey = item.status || item.label || 'OTHER';
    const cfg = STATUS_COLOR_MAP[statusKey] || { label: statusKey, color: '#64748b' };
    const count = item.count || item.total || 0;
    const percent = Math.round((count / total) * 100);
    return {
      label: cfg.label,
      count: count,
      percent: percent,
      color: cfg.color
    };
  }) : [
    { label: "Chờ xử lý", count: 8, percent: 35, color: "#f59e0b" },
    { label: "Đang xem xét", count: 8, percent: 35, color: "#3b82f6" },
    { label: "Đã duyệt", count: 7, percent: 30, color: "#16a34a" }
  ];

  // Tính toán stroke-dasharray và offset cho vòng tròn SVG
  let currentOffset = 0;
  const circumference = 2 * Math.PI * 35; // ~220

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
            {stats.map((st, idx) => {
              const dash = (st.percent / 100) * circumference;
              const empty = circumference - dash;
              const offset = currentOffset;
              currentOffset -= dash;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke={st.color}
                  strokeWidth="18"
                  strokeDasharray={`${dash} ${empty}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </svg>
        </div>

        {/* Chú thích dữ liệu */}
        <div className="d-flex flex-column gap-2 flex-grow-1 ps-3">
          {stats.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between fs-8">
              <div className="d-flex align-items-center gap-2">
                <span 
                  className="rounded-circle d-inline-block flex-shrink-0" 
                  style={{ width: '10px', height: '10px', backgroundColor: item.color }}
                />
                <span className="text-muted">{item.label}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">{item.count}</span>
                <span className="text-muted" style={{ fontSize: '0.75rem', width: '32px', textAlign: 'right' }}>
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
