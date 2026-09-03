import React from 'react';
import { Check } from 'lucide-react';

export default function ReviewerTimelineWidget() {
  const steps = [
    {
      id: 1,
      title: "Sinh viên nộp hồ sơ",
      time: "03/09/2026 10:30",
      status: "completed"
    },
    {
      id: 2,
      title: "Cán bộ tiếp nhận",
      time: "03/09/2026 11:15",
      author: "Nguyễn Văn Cán Bộ",
      status: "completed"
    },
    {
      id: 3,
      title: "Reviewer xét duyệt",
      time: "Chờ xử lý",
      status: "current"
    },
    {
      id: 4,
      title: "Phê duyệt",
      time: "Chờ xử lý",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Hoàn tất",
      time: "Chờ xử lý",
      status: "upcoming"
    }
  ];

  return (
    <div className="app-card-clean p-3 mb-3">
      {/* Tiêu đề widget */}
      <div className="text-uppercase fw-bold text-muted fs-8 mb-3" style={{ letterSpacing: '0.04em' }}>
        TIẾN TRÌNH XỬ LÝ
      </div>

      {/* Vertical Stepper */}
      <div className="position-relative ps-2">
        {/* Đường kẻ dọc kết nối */}
        <div 
          className="position-absolute" 
          style={{ left: '17px', top: '15px', bottom: '25px', width: '2px', backgroundColor: '#e2e8f0', zIndex: 1 }}
        />

        <div className="d-flex flex-column gap-3 position-relative" style={{ zIndex: 2 }}>
          {steps.map((step) => (
            <div key={step.id} className="d-flex align-items-start gap-3">
              {/* Vòng tròn trạng thái */}
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: step.status === 'completed' ? '#16a34a' : (step.status === 'current' ? '#ffffff' : '#f1f5f9'),
                  border: step.status === 'current' ? '2px solid #16a34a' : (step.status === 'upcoming' ? '2px solid #cbd5e1' : 'none'),
                  color: '#ffffff'
                }}
              >
                {step.status === 'completed' && <Check size={14} strokeWidth={3} />}
                {step.status === 'current' && <span className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: '#16a34a' }} />}
              </div>

              {/* Thông tin bước */}
              <div className="lh-sm">
                <div className="fw-bold fs-7 text-dark">{step.title}</div>
                <div className="text-muted fs-8 mt-1">
                  {step.time} {step.author && `• ${step.author}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
