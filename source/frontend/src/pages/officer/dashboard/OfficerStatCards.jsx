import React from 'react';
import { Files, Clock, FileEdit, AlertTriangle } from 'lucide-react';

export default function OfficerStatCards({
  totalRegistrations = 156,
  pendingCount = 24,
  additionalInfoCount = 8,
  overdueCount = 5
}) {
  const cards = [
    {
      id: 1,
      title: "Tổng hồ sơ",
      value: totalRegistrations,
      subtitle: "Tất cả hồ sơ",
      icon: <Files size={22} />,
      iconBg: '#e6f4ea',
      iconColor: '#137333'
    },
    {
      id: 2,
      title: "Chờ xử lý",
      value: pendingCount,
      subtitle: "Hồ sơ cần tiếp nhận",
      icon: <Clock size={22} />,
      iconBg: '#fef3c7',
      iconColor: '#d97706'
    },
    {
      id: 3,
      title: "Yêu cầu bổ sung",
      value: additionalInfoCount,
      subtitle: "Chờ sinh viên bổ sung",
      icon: <FileEdit size={22} />,
      iconBg: '#f3e8ff',
      iconColor: '#7e22ce'
    },
    {
      id: 4,
      title: "Quá hạn xử lý",
      value: overdueCount,
      subtitle: "Hồ sơ quá hạn SLA",
      icon: <AlertTriangle size={22} />,
      iconBg: '#fee2e2',
      iconColor: '#dc2626'
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div key={card.id} className="col-xl-3 col-sm-6 col-12">
          <div className="app-card-clean h-100 d-flex align-items-center gap-3 py-3 px-4 shadow-2xs">
            {/* Khối Icon tròn theo màu */}
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{ width: '48px', height: '48px', backgroundColor: card.iconBg, color: card.iconColor }}
            >
              {card.icon}
            </div>

            {/* Chỉ số & Tiêu đề */}
            <div>
              <div className="text-muted fw-semibold" style={{ fontSize: '0.82rem' }}>
                {card.title}
              </div>
              <div className="fw-bolder fs-3 lh-1 my-1" style={{ color: 'var(--text-dark)' }}>
                {card.value}
              </div>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                {card.subtitle}
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
