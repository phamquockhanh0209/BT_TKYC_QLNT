import React from 'react';
import { Check, Info, AlertTriangle } from 'lucide-react';

export default function NotificationPage() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Hồ sơ ngoại trú đã được phê duyệt",
      content: "Hồ sơ đăng ký ngoại trú học kỳ 1 năm học 2026-2027 của bạn đã được cán bộ CTSV xét duyệt thành công.",
      time: "2 giờ trước",
      read: false
    },
    {
      id: 2,
      type: "info",
      title: "Yêu cầu gia hạn hợp đồng",
      content: "Yêu cầu gia hạn hợp đồng thuê nhà tại Nhà trọ Minh Anh đang được cán bộ thụ lý kiểm tra tính hợp lệ.",
      time: "1 ngày trước",
      read: true
    },
    {
      id: 3,
      type: "warning",
      title: "Nhắc nhở cập nhật giấy xác nhận cư trú",
      content: "Vui lòng cập nhật giấy xác nhận cư trú (Mẫu CT07) trước ngày 30/09/2026 để đảm bảo quyền lợi đánh giá điểm rèn luyện.",
      time: "3 ngày trước",
      read: true
    }
  ];

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Tất Cả Thông Báo</h2>
        <p className="text-muted mb-0">Cập nhật tin tức, kết quả xét duyệt và nhắc nhở từ Nhà trường</p>
      </div>

      <div className="app-card-clean">
        <div className="d-flex flex-column gap-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 border rounded-3 d-flex align-items-start gap-3 bg-white">
              <div className={`notif-icon-box notif-icon-${n.type}`}>
                {n.type === 'success' && <Check size={18} />}
                {n.type === 'info' && <Info size={18} />}
                {n.type === 'warning' && <AlertTriangle size={18} />}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h6 className="fw-bold mb-0">{n.title}</h6>
                  <small className="text-muted">{n.time}</small>
                </div>
                <p className="text-muted mb-0 lh-sm fs-7">{n.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
