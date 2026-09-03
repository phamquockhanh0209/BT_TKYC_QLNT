import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, MessageSquare, UserCheck, BarChart2 } from 'lucide-react';

export default function OfficerQuickActions() {
  const actions = [
    {
      id: 1,
      title: "Tiếp nhận hồ sơ",
      link: "/officer/registrations",
      icon: <FilePlus size={20} />
    },
    {
      id: 2,
      title: "Tạo yêu cầu bổ sung",
      link: "/officer/requests",
      icon: <MessageSquare size={20} />
    },
    {
      id: 3,
      title: "Tìm kiếm sinh viên",
      link: "/officer/students",
      icon: <UserCheck size={20} />
    },
    {
      id: 4,
      title: "Xuất báo cáo",
      link: "/officer/reports",
      icon: <BarChart2 size={20} />
    }
  ];

  return (
    <div className="app-card-clean">
      {/* Tiêu đề mục */}
      <div className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        THAO TÁC NHANH
      </div>

      {/* Lưới 2x2 nút bấm */}
      <div className="row g-2">
        {actions.map((act) => (
          <div key={act.id} className="col-6">
            <Link
              to={act.link}
              className="p-3 border rounded-3 bg-white d-flex align-items-center gap-2 text-decoration-none text-dark h-100 officer-quick-card transition"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="text-muted flex-shrink-0">
                {act.icon}
              </div>
              <span className="fw-semibold fs-7 lh-sm">
                {act.title}
              </span>
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        .officer-quick-card:hover {
          background-color: #fafbfc !important;
          border-color: var(--primary-color) !important;
          color: var(--primary-color) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.03);
        }
      `}</style>
    </div>
  );
}
