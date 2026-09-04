import React from 'react';

export default function WelcomeBanner({
  studentName = "Nguyễn Văn An",
  studentCode = "2021001234",
  faculty = "Khoa Công nghệ thông tin",
  className = "—",
  registrationStatus = "ACTIVE",
  documentRatio = "4/4",
  pendingRequestsCount = 1
}) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-4 mb-2">
      {/* Lời chào & Thông tin sinh viên */}
      <div>
        <h1 className="fw-bold fs-2 mb-1" style={{ color: '#cdb501', letterSpacing: '-0.02em' }}>
          Xin chào, {studentName}
        </h1>
        <div className="text-muted fs-6">
          <span>MSSV: {studentCode}</span>
          <span className="mx-2">•</span>
          <span>{faculty}</span>
          <span className="mx-2">•</span>
          <span>Lớp: {className}</span>
        </div>
      </div>

      {/* 3 Chỉ số đếm nhanh bên phải */}
      <div className="d-flex align-items-center gap-4 mt-3 mt-md-0 border-start ps-md-4" style={{ borderColor: 'var(--border-color)' }}>
        {/* Chỉ số 1: Trạng thái hồ sơ */}
        <div className="text-start">
          <div className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            HỒ SƠ NGOẠI TRÚ
          </div>
          <div className="d-flex align-items-center gap-1 mt-1">
            <span 
              className="rounded-circle d-inline-block" 
              style={{ width: '8px', height: '8px', backgroundColor: '#16a34a' }}
            ></span>
            <span className="fw-bolder fs-6" style={{ color: '#15803d' }}>
              {registrationStatus}
            </span>
          </div>
        </div>

        <div className="vr d-none d-sm-block text-muted opacity-25" style={{ height: '35px' }}></div>

        {/* Chỉ số 2: Giấy tờ */}
        <div className="text-start">
          <div className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            GIẤY TỜ
          </div>
          <div className="fw-bolder fs-5 mt-1" style={{ color: 'var(--primary-color)' }}>
            {documentRatio}
          </div>
        </div>

        <div className="vr d-none d-sm-block text-muted opacity-25" style={{ height: '35px' }}></div>

        {/* Chỉ số 3: Yêu cầu */}
        <div className="text-start">
          <div className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            YÊU CẦU
          </div>
          <div className="fw-bold fs-6 mt-1" style={{ color: '#b45309' }}>
            {pendingRequestsCount} đang xử lý
          </div>
        </div>
      </div>
    </div>
  );
}
