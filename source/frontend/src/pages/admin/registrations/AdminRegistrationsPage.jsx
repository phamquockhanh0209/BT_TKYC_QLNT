import React, { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const [filterStatus, setFilterStatus] = useState('');

  const registrations = [
    { id: 1, code: "REG-2026-00156", studentName: "Nguyễn Văn An", studentCode: "2021001234", faculty: "CNTT", submittedDate: "03/09/2026", status: "CHỜ XÉT DUYỆT", sla: "12h còn lại" },
    { id: 2, code: "REG-2026-00155", studentName: "Trần Thị Bình", studentCode: "2021001235", faculty: "QTKD", submittedDate: "02/09/2026", status: "CHỜ XỬ LÝ", sla: "6h còn lại" },
    { id: 3, code: "REG-2026-00154", studentName: "Lê Văn Cường", studentCode: "2021001236", faculty: "DDE", submittedDate: "01/09/2026", status: "ACTIVE", sla: "Đúng hạn" },
    { id: 4, code: "REG-2026-00153", studentName: "Phạm Thị Dung", studentCode: "2021001237", faculty: "NN", submittedDate: "31/08/2026", status: "QUÁ HẠN", sla: "Vi phạm 2h" },
    { id: 5, code: "REG-2026-00152", studentName: "Hoàng Văn Em", studentCode: "2021001238", faculty: "KT", submittedDate: "30/08/2026", status: "YÊU CẦU BỔ SUNG", sla: "Chờ SV cập nhật" }
  ];

  const statusColor = (status) => {
    if (status === 'ACTIVE') return '#16a34a';
    if (status === 'CHỜ XÉT DUYỆT' || status === 'CHỜ XỬ LÝ') return '#ca8a04';
    if (status === 'QUÁ HẠN') return '#dc2626';
    if (status === 'YÊU CẦU BỔ SUNG') return '#0891b2';
    return '#64748b';
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Hồ Sơ Ngoại Trú</h2>
          <p className="text-muted mb-0">Toàn bộ hồ sơ khai báo ngoại trú của sinh viên. Theo dõi tiến trình và cảnh báo SLA</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7">
          <Download size={16} /> Xuất dữ liệu
        </button>
      </div>

      {/* Thanh lọc */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
              <input type="text" className="form-control border-start-0" placeholder="Mã hồ sơ, MSSV, tên sinh viên..." />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option>ACTIVE</option>
              <option>CHỜ XÉT DUYỆT</option>
              <option>CHỜ XỬ LÝ</option>
              <option>QUÁ HẠN</option>
              <option>YÊU CẦU BỔ SUNG</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm">
              <option value="">Tất cả khoa</option>
              <option>CNTT</option>
              <option>QTKD</option>
              <option>DDE</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-sm w-100" style={{ backgroundColor: '#0f172a', color: '#fff' }}>
              <Filter size={14} /> Lọc
            </button>
          </div>
        </div>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ HỒ SƠ</th>
                <th>SINH VIÊN</th>
                <th>KHOA</th>
                <th>NGÀY NỘP</th>
                <th>TRẠNG THÁI</th>
                <th>SLA</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-bottom border-light">
                  <td className="fw-bold text-primary"><code>{r.code}</code></td>
                  <td>
                    <div className="fw-semibold text-dark">{r.studentName}</div>
                    <div className="text-muted fs-8">{r.studentCode}</div>
                  </td>
                  <td><span className="badge bg-light text-dark border">{r.faculty}</span></td>
                  <td className="text-muted fs-8">{r.submittedDate}</td>
                  <td><span className="fw-semibold fs-8" style={{ color: statusColor(r.status) }}>{r.status}</span></td>
                  <td>
                    <span className={`fs-8 fw-semibold ${r.status === 'QUÁ HẠN' ? 'text-danger' : 'text-muted'}`}>
                      {r.sla}
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
        <div className="px-3 py-2 border-top d-flex align-items-center justify-content-between fs-8 text-muted">
          <span>Hiển thị 5 / 326 hồ sơ</span>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-outline-secondary">‹</button>
            <button className="btn btn-sm" style={{ backgroundColor: '#0f172a', color: '#fff' }}>1</button>
            <button className="btn btn-sm btn-outline-secondary">2</button>
            <button className="btn btn-sm btn-outline-secondary">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
