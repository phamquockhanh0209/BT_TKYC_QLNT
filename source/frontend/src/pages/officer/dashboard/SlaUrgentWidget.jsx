import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, AlertTriangle } from 'lucide-react';

export default function SlaUrgentWidget({ items = [] }) {
  const urgentList = items.length > 0 ? items.slice(0, 4) : [];

  const formatDeadline = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getRemainingText = (dueAt) => {
    if (!dueAt) return '—';
    const diff = new Date(dueAt) - new Date();
    const hours = Math.round(diff / (1000 * 60 * 60));
    if (hours < 0) return { text: `Quá hạn ${Math.abs(hours)}h`, isOverdue: true };
    if (hours < 24) return { text: `Còn ${hours}h`, isOverdue: false };
    return { text: `Còn ${Math.ceil(hours / 24)} ngày`, isOverdue: false };
  };

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
        {urgentList.length === 0 ? (
          <div className="py-3 text-center text-muted fs-8">
            Không có hồ sơ nào sắp quá hạn SLA cần xử lý khẩn cấp.
          </div>
        ) : (
          urgentList.map((item) => {
            const sla = item.slaTrackings?.[0];
            const dueInfo = getRemainingText(sla?.dueAt);
            const student = item.student || {};

            return (
              <div key={item.registrationId} className="d-flex align-items-start gap-3 pb-2 border-bottom border-light">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: dueInfo.isOverdue ? '#fee2e2' : '#fef3c7', 
                    color: dueInfo.isOverdue ? '#dc2626' : '#d97706' 
                  }}
                >
                  {dueInfo.isOverdue ? <AlertTriangle size={16} /> : <Clock size={16} />}
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold fs-7" style={{ color: 'var(--primary-color)' }}>
                      {item.registrationCode || `#${item.registrationId}`}
                    </span>
                    <span 
                      className="fw-bold fs-8" 
                      style={{ color: dueInfo.isOverdue ? '#dc2626' : '#d97706' }}
                    >
                      {dueInfo.text}
                    </span>
                  </div>

                  <div className="text-dark fs-8 fw-semibold mt-1">
                    {student.fullName || 'Sinh viên'} <span className="text-muted fw-normal">({student.studentCode || '—'})</span>
                  </div>

                  <div className="text-muted fs-8 mt-1">
                    Hạn chót: {formatDeadline(sla?.dueAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
