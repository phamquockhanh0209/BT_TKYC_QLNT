import React from 'react';
import { Check, ShieldCheck, Home, FileText, UserCheck } from 'lucide-react';

// Mapping status → bước đang active
const STATUS_STEP = {
  DRAFT:      1,
  SUBMITTED:  2,
  PROCESSING: 3,
  APPROVED:   4,
  ACTIVE:     5,
  REJECTED:   3,
};

export default function RegistrationStepper({ activeReg = null }) {
  // Nếu không có hồ sơ, bước 0 (chưa bắt đầu)
  const currentStep = activeReg ? (STATUS_STEP[activeReg.status] ?? 1) : 0;

  const steps = [
    { id: 1, title: 'Tạo hồ sơ',       icon: <ShieldCheck size={20} /> },
    { id: 2, title: 'Khai báo nơi ở',  icon: <Home size={20} /> },
    { id: 3, title: 'Nộp giấy tờ',     icon: <FileText size={20} /> },
    { id: 4, title: 'Cán bộ xét duyệt', icon: <UserCheck size={20} /> },
    { id: 5, title: 'Hoàn tất',         icon: <Check size={24} strokeWidth={3} /> },
  ];

  const getStepClass = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return activeReg?.status === 'ACTIVE' ? 'success-active' : 'current';
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
                  <div className="stepper-status-text">{activeReg.status}</div>
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
      {activeReg?.status === 'SUBMITTED' && (
        <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
          Hồ sơ đã được nộp và đang chờ cán bộ xét duyệt.
        </p>
      )}
      {activeReg?.status === 'PROCESSING' && (
        <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
          🔍 Cán bộ đang xem xét hồ sơ của bạn.
        </p>
      )}
      {activeReg?.status === 'REJECTED' && (
        <p className="text-danger mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
          ❌ Hồ sơ bị từ chối: {activeReg.rejectionReason || '(Xem chi tiết)'}
        </p>
      )}
    </div>
  );
}

