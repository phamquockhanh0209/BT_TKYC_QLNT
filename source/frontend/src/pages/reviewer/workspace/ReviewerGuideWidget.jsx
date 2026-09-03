import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export default function ReviewerGuideWidget() {
  const guides = [
    { id: 1, title: "Quy định quản lý ngoại trú", size: "PDF • 1.2 MB" },
    { id: 2, title: "Hướng dẫn xét duyệt hồ sơ", size: "PDF • 2.1 MB" },
    { id: 3, title: "Checklist hồ sơ ngoại trú", size: "PDF • 856 KB" }
  ];

  return (
    <div className="app-card-clean p-3 mb-3">
      {/* Tiêu đề widget */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="text-uppercase fw-bold text-muted fs-8" style={{ letterSpacing: '0.04em' }}>
          TÀI LIỆU HƯỚNG DẪN
        </div>
        <a href="#" className="text-decoration-none text-dark fw-semibold d-inline-flex align-items-center gap-1 fs-8">
          Xem tất cả <ArrowRight size={13} />
        </a>
      </div>

      {/* Danh sách tài liệu */}
      <div className="d-flex flex-column gap-2">
        {guides.map((g) => (
          <a
            key={g.id}
            href="#"
            className="p-2 rounded-2 border d-flex align-items-center gap-2 text-decoration-none text-dark bg-white hover-light transition"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div 
              className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
              style={{ width: '28px', height: '28px', backgroundColor: '#fee2e2', color: '#dc2626' }}
            >
              <FileText size={15} />
            </div>
            <div className="lh-sm text-truncate">
              <div className="fw-semibold fs-7 text-truncate">{g.title}</div>
              <small className="text-muted fs-8">{g.size}</small>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
