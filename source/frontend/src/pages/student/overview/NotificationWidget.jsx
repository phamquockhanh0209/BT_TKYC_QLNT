import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Info, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

const STATUS_MAP = {
  SUBMITTED:  { type: 'info',    icon: <Clock size={18} strokeWidth={2.5} />,         label: 'Đang chờ xác nhận',    msg: 'Hồ sơ ngoại trú của bạn đã được nộp và đang chờ cán bộ xét duyệt.' },
  PROCESSING: { type: 'info',    icon: <Info size={18} strokeWidth={2.5} />,           label: 'Đang xử lý',           msg: 'Hồ sơ của bạn đang trong quá trình xét duyệt.' },
  APPROVED:   { type: 'success', icon: <Check size={18} strokeWidth={2.5} />,          label: 'Đã duyệt',             msg: 'Hồ sơ ngoại trú của bạn đã được phê duyệt.' },
  ACTIVE:     { type: 'success', icon: <Check size={18} strokeWidth={2.5} />,          label: 'Đang hoạt động',       msg: 'Hồ sơ ngoại trú đang có hiệu lực.' },
  REJECTED:   { type: 'warning', icon: <AlertTriangle size={18} strokeWidth={2.5} />, label: 'Bị từ chối',           msg: 'Hồ sơ của bạn đã bị từ chối. Vui lòng kiểm tra và nộp lại.' },
  EXPIRED:    { type: 'warning', icon: <AlertTriangle size={18} strokeWidth={2.5} />, label: 'Hết hạn',              msg: 'Hồ sơ đã hết hạn. Vui lòng gia hạn hoặc tạo hồ sơ mới.' },
};

export default function NotificationWidget({ registrations = [] }) {
  // Sinh thông báo động từ danh sách hồ sơ thật
  const notifications = registrations.slice(0, 3).map((reg, idx) => {
    const info = STATUS_MAP[reg.status] || {
      type: 'info',
      icon: <Info size={18} strokeWidth={2.5} />,
      label: reg.status,
      msg: `Hồ sơ ${reg.registrationCode || '#' + reg.registrationId} — ${reg.status}`
    };

    const submittedAt = reg.submittedAt ? new Date(reg.submittedAt) : null;
    const timeLabel = submittedAt
      ? submittedAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '—';

    return {
      id: reg.registrationId || idx,
      type: info.type,
      icon: info.icon,
      content: `${info.msg} (Mã: ${reg.registrationCode || reg.registrationId})`,
      time: timeLabel
    };
  });

  // Nếu chưa có hồ sơ → thông báo nhắc đăng ký
  if (notifications.length === 0) {
    notifications.push({
      id: 0,
      type: 'warning',
      icon: <AlertTriangle size={18} strokeWidth={2.5} />,
      content: 'Bạn chưa có hồ sơ ngoại trú. Hãy khai báo để hoàn thiện thủ tục.',
      time: 'Ngay bây giờ'
    });
  }

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

