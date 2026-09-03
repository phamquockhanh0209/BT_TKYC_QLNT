import React from 'react';

export default function RecentActivityTable() {
  const activities = [
    {
      id: 1,
      date: "20/08/2026",
      time: "10:30",
      action: "Duyệt hồ sơ",
      content: "Hồ sơ ngoại trú đã được duyệt",
      status: "Thành công"
    },
    {
      id: 2,
      date: "18/08/2026",
      time: "14:15",
      action: "Nộp giấy tờ",
      content: "Nộp 4 loại giấy tờ",
      status: "Thành công"
    },
    {
      id: 3,
      date: "16/08/2026",
      time: "09:20",
      action: "Khai báo nơi ở",
      content: "Khai báo nơi ở tại Nhà trọ Minh Anh",
      status: "Thành công"
    }
  ];

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề */}
      <div className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        LỊCH SỬ HOẠT ĐỘNG GẦN ĐÂY
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
          <thead>
            <tr className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
              <th className="fw-bold border-0 ps-0 text-uppercase" style={{ width: '180px' }}>THỜI GIAN</th>
              <th className="fw-bold border-0 text-uppercase" style={{ width: '160px' }}>HOẠT ĐỘNG</th>
              <th className="fw-bold border-0 text-uppercase">NỘI DUNG</th>
              <th className="fw-bold border-0 pe-0 text-end text-uppercase" style={{ width: '130px' }}>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item) => (
              <tr key={item.id} className="border-bottom border-light">
                {/* Thời gian */}
                <td className="ps-0 py-3 text-dark fw-semibold" style={{ fontSize: '0.88rem' }}>
                  <span>{item.date}</span>
                  <span className="text-muted fw-normal ms-3">{item.time}</span>
                </td>

                {/* Hoạt động */}
                <td className="py-3 text-dark fw-medium" style={{ fontSize: '0.88rem' }}>
                  {item.action}
                </td>

                {/* Nội dung */}
                <td className="py-3 text-muted" style={{ fontSize: '0.88rem' }}>
                  {item.content}
                </td>

                {/* Trạng thái */}
                <td className="pe-0 py-3 text-end fw-bold" style={{ fontSize: '0.88rem', color: '#16a34a' }}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
