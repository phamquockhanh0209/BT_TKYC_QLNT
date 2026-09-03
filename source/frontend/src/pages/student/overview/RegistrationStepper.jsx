import React from 'react';
import { Check, ShieldCheck, Home, FileText, UserCheck } from 'lucide-react';

export default function RegistrationStepper() {
  const steps = [
    {
      id: 1,
      title: "Tạo hồ sơ",
      date: "15/08/2026",
      status: "completed",
      icon: <ShieldCheck size={20} />
    },
    {
      id: 2,
      title: "Khai báo nơi ở",
      date: "15/08/2026",
      status: "completed",
      icon: <Home size={20} />
    },
    {
      id: 3,
      title: "Nộp giấy tờ",
      date: "16/08/2026",
      status: "completed",
      icon: <FileText size={20} />
    },
    {
      id: 4,
      title: "Cán bộ xét duyệt",
      date: "20/08/2026",
      status: "completed",
      icon: <UserCheck size={20} />
    },
    {
      id: 5,
      title: "Hoàn tất",
      badge: "ACTIVE",
      status: "finished",
      icon: <Check size={24} strokeWidth={3} />
    }
  ];

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề mục */}
      <div className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        TIẾN TRÌNH HỒ SƠ
      </div>

      {/* Stepper timeline */}
      <div className="stepper-container">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            {/* Vòng tròn bước */}
            <div className="stepper-item">
              <div 
                className={`stepper-circle ${
                  step.status === 'finished' 
                    ? 'success-active' 
                    : step.status === 'completed' 
                    ? 'completed' 
                    : 'current'
                }`}
              >
                {step.icon}
              </div>

              {/* Tên bước */}
              <div className="stepper-title">
                {step.title}
              </div>

              {/* Ngày tháng hoặc Badge */}
              {step.date && (
                <div className="stepper-subtitle">
                  {step.date}
                </div>
              )}
              {step.badge && (
                <div className="stepper-status-text">
                  {step.badge}
                </div>
              )}
            </div>

            {/* Đường nối giữa các bước */}
            {idx < steps.length - 1 && (
              <div 
                className={`stepper-line ${
                  idx === steps.length - 2 ? 'gold' : 'completed'
                }`} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
