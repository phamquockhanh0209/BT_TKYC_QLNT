import React from 'react';

const STATUS_LABEL = {
  DRAFT:      { text: 'Bản nháp',       color: '#6b7280' },
  SUBMITTED:  { text: 'Đã nộp',         color: '#2563eb' },
  PROCESSING: { text: 'Đang xử lý',     color: '#d97706' },
  APPROVED:   { text: 'Đã duyệt',       color: '#16a34a' },
  ACTIVE:     { text: 'Đang hoạt động', color: '#16a34a' },
  REJECTED:   { text: 'Bị từ chối',     color: '#dc2626' },
  EXPIRED:    { text: 'Hết hạn',        color: '#9ca3af' },
};

export default function RecentActivityTable({ registrations = [] }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Mỗi registration tạo 1 dòng lịch sử
  const activities = registrations.map((reg) => {
    const addr = reg.addresses?.[0];
    const addressStr = addr
      ? [addr.streetAddress || addr.addressLine, addr.ward, addr.district, addr.city || addr.province]
          .filter(Boolean).join(', ')
      : '(Chưa có địa chỉ)';

    const statusInfo = STATUS_LABEL[reg.status] || { text: reg.status, color: '#6b7280' };
    const eventDate = reg.submittedAt || reg.createdAt;

    return {
      id: reg.registrationId,
      date: formatDate(eventDate),
      time: formatTime(eventDate),
      action: reg.status === 'SUBMITTED' ? 'Nộp hồ sơ'
            : reg.status === 'APPROVED'  ? 'Duyệt hồ sơ'
            : reg.status === 'REJECTED'  ? 'Từ chối hồ sơ'
            : reg.status === 'ACTIVE'    ? 'Kích hoạt'
            : 'Cập nhật hồ sơ',
      content: `Mã ${reg.registrationCode || reg.registrationId} — ${addressStr}`,
      statusText: statusInfo.text,
      statusColor: statusInfo.color,
    };
  });

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề */}
      <div className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        LỊCH SỬ HOẠT ĐỘNG GẦN ĐÂY
      </div>

      {activities.length === 0 ? (
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          Chưa có hoạt động nào. Hãy bắt đầu bằng cách khai báo nơi ở ngoại trú.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
            <thead>
              <tr className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <th className="fw-bold border-0 ps-0 text-uppercase" style={{ width: '180px' }}>THỜI GIAN</th>
                <th className="fw-bold border-0 text-uppercase" style={{ width: '160px' }}>HOẠT ĐỘNG</th>
                <th className="fw-bold border-0 text-uppercase">NỘI DUNG</th>
                <th className="fw-bold border-0 pe-0 text-end text-uppercase" style={{ width: '140px' }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item) => (
                <tr key={item.id} className="border-bottom border-light">
                  <td className="ps-0 py-3 text-dark fw-semibold" style={{ fontSize: '0.88rem' }}>
                    <span>{item.date}</span>
                    <span className="text-muted fw-normal ms-3">{item.time}</span>
                  </td>
                  <td className="py-3 text-dark fw-medium" style={{ fontSize: '0.88rem' }}>
                    {item.action}
                  </td>
                  <td className="py-3 text-muted" style={{ fontSize: '0.88rem' }}>
                    {item.content}
                  </td>
                  <td className="pe-0 py-3 text-end fw-bold" style={{ fontSize: '0.88rem', color: item.statusColor }}>
                    {item.statusText}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


