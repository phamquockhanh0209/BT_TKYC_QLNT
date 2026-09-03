import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function DossierDetailCard({
  code = "REG-2026-00156",
  studentName = "Nguyễn Văn An",
  studentCode = "2021001234",
  faculty = "Công nghệ thông tin",
  className = "20CNTT01",
  phone = "09xx xxx xxx",
  email = "nguyenvanan@gmail.com",
  submittedDate = "03/09/2026 10:30",
  status = "CHỜ XÉT DUYỆT",
  source = "Sinh viên tự đăng ký",
  term = "2026 - 2027",
  deadline = "10/09/2026",
  daysRemaining = 7
}) {
  return (
    <div className="mb-3">
      {/* Breadcrumb nhỏ trên cùng */}
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
          style={{ backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '0.75rem' }}
        >
          {status}
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
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80" 
                  alt={studentName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Cột 2: Thông tin cơ bản sinh viên */}
          <div className="col">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h4 className="fw-bold fs-5 mb-0 text-dark">{studentName}</h4>
              <CheckCircle2 size={18} className="text-success fill-success" />
            </div>

            <div className="row g-2 fs-7">
              <div className="col-sm-6">
                <span className="text-muted">MSSV:</span> <span className="fw-semibold text-dark">{studentCode}</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Lớp:</span> <span className="fw-semibold text-dark">{className}</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Khoa:</span> <span className="fw-semibold text-dark">{faculty}</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">SĐT:</span> <span className="fw-semibold text-dark">{phone}</span>
              </div>
              <div className="col-12">
                <span className="text-muted">Email:</span> <span className="fw-semibold text-dark">{email}</span>
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
                <span className="fw-semibold text-dark">{submittedDate}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Trạng thái:</span>
                <span className="fw-bold" style={{ color: '#b45309' }}>{status}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Nguồn đăng ký:</span>
                <span className="text-dark">{source}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Kỳ đăng ký:</span>
                <span className="text-dark">{term}</span>
              </div>
              <div className="d-flex justify-content-between pt-1 border-top mt-1">
                <span className="text-muted">Hạn xét duyệt:</span>
                <span className="fw-semibold text-success">{deadline} (Còn {daysRemaining} ngày)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
