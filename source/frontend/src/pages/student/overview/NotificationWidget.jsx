import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Info, AlertTriangle, ArrowRight } from 'lucide-react';

export default function NotificationWidget() {
  const notifications = [
    {
      id: 1,
      type: "success",
      icon: <Check size={18} strokeWidth={2.5} />,
      content: "Hồ sơ ngoại trú của bạn đã được duyệt và đang hoạt động.",
      time: "2 giờ trước"
    },
    {
      id: 2,
      type: "info",
      icon: <Info size={18} strokeWidth={2.5} />,
      content: "Yêu cầu gia hạn hợp đồng của bạn đang được cán bộ xử lý.",
      time: "1 ngày trước"
    },
    {
      id: 3,
      type: "warning",
      icon: <AlertTriangle size={18} strokeWidth={2.5} />,
      content: "Vui lòng cập nhật giấy xác nhận cư trú trước ngày 30/09/2026.",
      time: "3 ngày trước"
    }
  ];

  return (
    <div className="app-card-clean mb-4">
      {/* Header Widget */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
          THÔNG BÁO MỚI
        </div>
        <Link 
          to="/notifications" 
          className="text-decoration-none text-dark fw-semibold d-inline-flex align-items-center gap-1"
          style={{ fontSize: '0.82rem' }}
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>

      {/* Danh sách thông báo */}
      <div className="d-flex flex-column">
        {notifications.map((item) => (
          <div key={item.id} className="notification-item-card">
            {/* Icon theo phân loại màu */}
            <div className={`notif-icon-box notif-icon-${item.type}`}>
              {item.icon}
            </div>

            {/* Nội dung thông báo & Thời gian */}
            <div className="flex-grow-1">
              <p className="mb-1 text-dark fw-medium lh-sm" style={{ fontSize: '0.88rem' }}>
                {item.content}
              </p>
              <small className="text-muted" style={{ fontSize: '0.76rem' }}>
                {item.time}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
