import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

export default function SlaUrgentWidget() {
  const items = [
    {
      id: 1,
      code: "REG-2026-00156",
      remaining: "Còn 1 ngày",
      studentName: "Nguyễn Văn An",
      studentCode: "2021001234",
      deadline: "04/09/2026"
    },
    {
      id: 2,
      code: "REG-2026-00155",
      remaining: "Còn 2 ngày",
      studentName: "Trần Thị Bình",
      studentCode: "2021001235",
      deadline: "05/09/2026"
    },
    {
      id: 3,
      code: "REG-2026-00153",
      remaining: "Còn 3 ngày",
      studentName: "Phạm Thị Dung",
      studentCode: "2021001237",
      deadline: "06/09/2026"
    }
  ];

  return (
    <div className="app-card-clean mb-4">
      {/* Header Widget */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
          SLA SẮP QUÁ HẠN
        </div>
        <Link 
          to="/officer/sla" 
          className="text-decoration-none text-dark fw-semibold d-inline-flex align-items-center gap-1"
          style={{ fontSize: '0.82rem' }}
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>

      {/* Danh sách SLA khẩn cấp */}
      <div className="d-flex flex-column gap-3">
        {items.map((item) => (
          <div key={item.id} className="d-flex align-items-start gap-3 pb-2 border-bottom border-light">
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{ width: '32px', height: '32px', backgroundColor: '#fef3c7', color: '#d97706' }}
            >
              <Clock size={16} />
            </div>

            <div className="flex-grow-1">
              <div className="d-flex align-items-center justify-content-between">
                <span className="fw-bold fs-7 text-dark">{item.code}</span>
                <span className="fw-semibold fs-8" style={{ color: '#16a34a' }}>{item.remaining}</span>
              </div>
              <div className="text-muted fs-8">
                {item.studentName} <span className="mx-1">•</span> {item.studentCode}
              </div>
              <small className="text-muted fs-8">
                Hạn: {item.deadline}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
