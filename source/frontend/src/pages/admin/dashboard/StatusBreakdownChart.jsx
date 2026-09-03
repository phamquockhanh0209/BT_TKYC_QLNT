import React from 'react';

export default function StatusBreakdownChart() {
  const breakdown = [
    { label: "ACTIVE", name: "Đã duyệt & Hoạt động", count: 215, percent: 66, color: "#16a34a" },
    { label: "PENDING", name: "Chờ xét duyệt", count: 42, percent: 13, color: "#d97706" },
    { label: "EXPIRED", name: "Hết hạn hợp đồng", count: 38, percent: 12, color: "#64748b" },
    { label: "REJECTED", name: "Từ chối hồ sơ", count: 31, percent: 9, color: "#dc2626" }
  ];

  return (
    <div className="app-card-clean p-4 h-100 bg-white border">
      <div className="text-uppercase fw-bold text-muted fs-8 mb-1" style={{ letterSpacing: '0.04em' }}>
        THEO TRẠNG THÁI
      </div>
      <div className="fw-bold fs-5 text-dark mb-3">Tỷ trọng hồ sơ hệ thống</div>

      {/* Progress bars */}
      <div className="d-flex flex-column gap-3">
        {breakdown.map((item, idx) => (
          <div key={idx}>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-bold fs-7 text-dark">
                <code>{item.label}</code> <span className="text-muted fw-normal ms-1">({item.name})</span>
              </span>
              <span className="fw-bold fs-7" style={{ color: item.color }}>
                {item.count} <span className="text-muted fs-8 fw-normal">({item.percent}%)</span>
              </span>
            </div>

            {/* Thanh tiến trình ngang */}
            <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
              <div 
                className="progress-bar rounded" 
                role="progressbar" 
                style={{ width: `${item.percent}%`, backgroundColor: item.color }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-top text-muted fs-8">
        Tổng số hồ sơ được ghi nhận trong cơ sở dữ liệu: <strong className="text-dark">326 hồ sơ</strong>
      </div>
    </div>
  );
}
