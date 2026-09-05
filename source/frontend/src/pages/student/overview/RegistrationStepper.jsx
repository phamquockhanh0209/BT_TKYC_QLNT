import React from 'react';
import { Check, ShieldCheck, Home, FileText, UserCheck } from 'lucide-react';

// Mapping status → bước đang active
const STATUS_STEP = {
  DRAFT:        1,
  SUBMITTED:    2,
  UNDER_REVIEW: 4,
  PROCESSING:   4,
  APPROVED:     5,
  ACTIVE:       5,
  REJECTED:     3,
};

export default function RegistrationStepper({ activeReg = null }) {
  // Nếu không có hồ sơ, bước 0 (chưa bắt đầu)
  const currentStep = activeReg ? (STATUS_STEP[activeReg.status] ?? 1) : 0;

  const steps = [
    { id: 1, title: 'Tạo hồ sơ',       icon: <ShieldCheck size={20} /> },
    { id: 2, title: 'Khai báo nơi ở',  icon: <Home size={20} /> },
    { id: 3, title: 'Nộp giấy tờ',     icon: <FileText size={20} /> },
    { id: 4, title: 'Cán bộ xét duyệt', icon: <UserCheck size={20} /> },
    { id: 5, title: 'Đã duyệt',         icon: <Check size={24} strokeWidth={3} /> },
  ];

  const getStepClass = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) {
      if (['APPROVED', 'ACTIVE'].includes(activeReg?.status)) return 'completed success-active';
      return 'current';
    }
    return 'pending';
  };

  const formatDate = (reg) => {
    if (!reg) return null;
    const d = reg.submittedAt || reg.createdAt;
    return d ? new Date(d).toLocaleDateString('vi-VN') : null;
  };

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề mục */}
      <div className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        TIẾN TRÌNH HỒ SƠ
      </div>

      {/* Stepper timeline */}
      <div className="stepper-container">
        {steps.map((step, idx) => {
          const cls = getStepClass(step.id);
          return (
            <React.Fragment key={step.id}>
              {/* Vòng tròn bước */}
              <div className="stepper-item">
                <div className={`stepper-circle ${cls}`}>
                  {step.icon}
                </div>

                {/* Tên bước */}
                <div className="stepper-title">{step.title}</div>

                {/* Badge hoặc ngày */}
                {step.id === currentStep && activeReg?.status && (
                  <div className="stepper-status-text">
                    {['APPROVED', 'ACTIVE'].includes(activeReg.status) ? 'ĐÃ DUYỆT' :
                     activeReg.status === 'UNDER_REVIEW' ? 'ĐANG XÉT DUYỆT' :
                     activeReg.status === 'SUBMITTED' ? 'CHỜ XÉT DUYỆT' : activeReg.status}
                  </div>
                )}
                {step.id === 2 && activeReg?.submittedAt && step.id < currentStep && (
                  <div className="stepper-subtitle">{formatDate(activeReg)}</div>
                )}
              </div>

              {/* Đường nối */}
              {idx < steps.length - 1 && (
                <div className={`stepper-line ${step.id < currentStep ? 'completed' : 'gold'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Trạng thái mô tả */}
      {['APPROVED', 'ACTIVE'].includes(activeReg?.status) && (
        <p className="text-success mt-3 mb-0 fw-semibold" style={{ fontSize: '0.85rem' }}>
          ✅ Hồ sơ ngoại trú đã được Cán bộ Quản lý phê duyệt chính thức thành công. Thông tin cư trú đã có hiệu lực!
        </p>
      )}
      {activeReg?.status === 'UNDER_REVIEW' && (
        <p className="text-primary mt-3 mb-0 fw-semibold" style={{ fontSize: '0.85rem' }}>
          🔍 Hồ sơ đã qua thẩm định của Reviewer và đang chờ Cán bộ Quản lý phê duyệt cấp trường.
        </p>
      )}
      {activeReg?.status === 'SUBMITTED' && (
        <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
          Hồ sơ đã được nộp và đang chờ Cán bộ thẩm định.
        </p>
      )}
      {activeReg?.status === 'REJECTED' && (
        <p className="text-danger mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
          ❌ Hồ sơ cần bổ sung / bị từ chối: {activeReg.rejectionReason || '(Xem chi tiết)'}
        </p>
      )}
    </div>
  );
}

