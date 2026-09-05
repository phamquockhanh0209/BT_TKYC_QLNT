import React from 'react';
import { CheckCircle2, ChevronRight, Clock, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG = {
  SUBMITTED:    { label: 'CHỜ XÉT DUYỆT', bg: '#fef3c7', color: '#b45309' },
  UNDER_REVIEW: { label: 'ĐANG XÉT DUYỆT', bg: '#e0e7ff', color: '#3730a3' },
  PROCESSING:   { label: 'ĐANG XỬ LÝ',     bg: '#e0e7ff', color: '#3730a3' },
  APPROVED:     { label: 'ĐÃ DUYỆT',       bg: '#dcfce7', color: '#15803d' },
  ACTIVE:       { label: 'ĐANG HOẠT ĐỘNG', bg: '#dcfce7', color: '#15803d' },
  REJECTED:     { label: 'BỔ SUNG / TỪ CHỐI', bg: '#fee2e2', color: '#b91c1c' },
  DRAFT:        { label: 'BẢN NHÁP',       bg: '#f1f5f9', color: '#475569' },
};

export default function DossierDetailCard({ registration = null }) {
  if (!registration) {
    return (
      <div className="app-card-clean p-4 text-center text-muted">
        Vui lòng chọn một hồ sơ từ danh sách hàng đợi bên trái.
      </div>
    );
  }

  const student = registration.student || {};
  const code = registration.registrationCode || `#${registration.registrationId}`;
  const statusCfg = STATUS_CONFIG[registration.status] || {
    label: registration.status,
    bg: '#fef3c7',
    color: '#b45309'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Tính SLA
  const sla = registration.slaTrackings?.[0];
  let deadlineText = '48 giờ làm việc';
  let hoursRemaining = null;
  if (sla?.dueAt) {
    const due = new Date(sla.dueAt);
    const diffMs = due - new Date();
    hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));
    deadlineText = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')} (${hoursRemaining > 0 ? `Còn ${hoursRemaining}h` : 'Đã quá hạn'})`;
  }

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80";
  const avatarUrl = student.avatarPath ? `http://localhost:5005${student.avatarPath}` : defaultAvatar;

  return (
    <div className="mb-3">
      {/* Breadcrumb */}
      <nav className="d-flex align-items-center gap-1 text-muted fs-8 mb-2">
        <span>Hồ sơ chờ xét duyệt</span>
        <ChevronRight size={13} />
        <span className="fw-semibold text-dark">{code}</span>
      </nav>

      {/* Header Hồ sơ ngoại trú #MÃ HỒ SƠ */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <h2 className="fw-bold fs-4 mb-0 text-dark">
          HỒ SƠ NGOẠI TRÚ #{code}
        </h2>
        <span 
          className="badge fw-bold px-2 py-1 text-uppercase"
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color, borderRadius: '4px', fontSize: '0.75rem' }}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* Card Thông tin sinh viên & Thông tin hồ sơ */}
      <div className="app-card-clean p-4">
        <div className="row g-4 align-items-center">
          {/* Cột 1: Avatar */}
          <div className="col-auto">
            <div className="position-relative">
              <div 
                className="rounded-circle overflow-hidden border"
                style={{ width: '80px', height: '80px', borderColor: 'var(--border-color)' }}
              >
                <img 
                  src={avatarUrl} 
                  alt={student.fullName || 'Student'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
              </div>
            </div>
          </div>

          {/* Cột 2: Thông tin cơ bản sinh viên */}
          <div className="col">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h4 className="fw-bold fs-5 mb-0 text-dark">{student.fullName || '—'}</h4>
              <CheckCircle2 size={18} className="text-success fill-success" />
            </div>

            <div className="row g-2 fs-7">
              <div className="col-sm-6">
                <span className="text-muted">MSSV:</span> <span className="fw-semibold text-dark">{student.studentCode || '—'}</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Lớp:</span> <span className="fw-semibold text-dark">{student.className || '—'}</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Khoa:</span> <span className="fw-semibold text-dark">{student.faculty || '—'}</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">SĐT:</span> <span className="fw-semibold text-dark">{student.phone || '—'}</span>
              </div>
              <div className="col-12">
                <span className="text-muted">Email:</span> <span className="fw-semibold text-dark">{student.email || '—'}</span>
              </div>
            </div>
          </div>

          {/* Cột 3: Thông tin đợt nộp hồ sơ */}
          <div className="col-lg-4 col-md-12 border-start ps-lg-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="text-uppercase fw-bold text-muted fs-8 mb-2" style={{ letterSpacing: '0.04em' }}>
              THÔNG TIN HỒ SƠ
            </div>
            <div className="d-flex flex-column gap-1 fs-7">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Ngày nộp:</span>
                <span className="fw-semibold text-dark">{formatDate(registration.submittedAt || registration.createdAt)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Trạng thái:</span>
                <span className="fw-bold" style={{ color: statusCfg.color }}>{statusCfg.label}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Nguồn đăng ký:</span>
                <span className="text-dark">Cổng sinh viên trực tuyến</span>
              </div>
              <div className="d-flex justify-content-between pt-1 border-top mt-1">
                <span className="text-muted">Hạn SLA:</span>
                <span className={`fw-semibold ${hoursRemaining !== null && hoursRemaining <= 0 ? 'text-danger' : 'text-success'}`}>
                  {deadlineText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

