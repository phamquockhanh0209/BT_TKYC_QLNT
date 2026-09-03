import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function AdminRequestsPage() {
  const requests = [
    { id: 1, code: "REQ-2026-00045", type: "Gia hạn hợp đồng", studentName: "Nguyễn Văn An", submittedDate: "02/09/2026", status: "CHỜ DUYỆT" },
    { id: 2, code: "REQ-2026-00044", type: "Cập nhật địa chỉ", studentName: "Trần Thị Bình", submittedDate: "01/09/2026", status: "ĐÃ DUYỆT" },
    { id: 3, code: "REQ-2026-00043", type: "Đổi phòng trọ", studentName: "Lê Văn Cường", submittedDate: "31/08/2026", status: "TỪ CHỐI" }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Quản Lý Yêu Cầu & Khiếu Nại</h2>
        <p className="text-muted mb-0">Các yêu cầu gia hạn, cập nhật thông tin và khiếu nại từ sinh viên</p>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ YÊU CẦU</th>
                <th>LOẠI YÊU CẦU</th>
                <th>SINH VIÊN</th>
                <th>NGÀY GỬI</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-bottom border-light">
                  <td className="fw-bold"><code>{r.code}</code></td>
                  <td>{r.type}</td>
                  <td>{r.studentName}</td>
                  <td className="text-muted fs-8">{r.submittedDate}</td>
                  <td>
                    <span className={`fw-semibold fs-8 ${r.status === 'ĐÃ DUYỆT' ? 'text-success' : r.status === 'TỪ CHỐI' ? 'text-danger' : 'text-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
