import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, FileText, HelpCircle, ChevronRight } from 'lucide-react';

export default function QuickActionsWidget() {
  const actions = [
    {
      id: 1,
      title: "Khai báo nơi ở mới",
      link: "/residence",
      icon: <Home size={18} />
    },
    {
      id: 2,
      title: "Tạo yêu cầu mới",
      link: "/requests",
      icon: <Plus size={18} />
    },
    {
      id: 3,
      title: "Cập nhật giấy tờ",
      link: "/documents",
      icon: <FileText size={18} />
    },
    {
      id: 4,
      title: "Xem hướng dẫn",
      link: "#",
      icon: <HelpCircle size={18} />
    }
  ];

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề mục */}
      <div className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        THAO TÁC NHANH
      </div>

      {/* Danh sách nút bấm */}
      <div className="d-flex flex-column">
        {actions.map((item) => (
          <Link key={item.id} to={item.link} className="quick-action-item">
            <div className="quick-action-left">
              <span className="text-muted d-flex align-items-center">
                {item.icon}
              </span>
              <span>{item.title}</span>
            </div>
            <ChevronRight size={18} className="text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
