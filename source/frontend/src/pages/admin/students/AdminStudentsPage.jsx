import React from 'react';
import { GraduationCap, Search, Download } from 'lucide-react';

export default function AdminStudentsPage() {
  const students = [
    { id: 1, studentCode: "2021001234", fullName: "Nguyễn Văn An", faculty: "Công nghệ Thông tin", className: "20CNTT01", phone: "0901234567", email: "an@gmail.com", status: "ACTIVE" },
    { id: 2, studentCode: "2021001235", fullName: "Trần Thị Bình", faculty: "Quản trị Kinh doanh", className: "20QTKD02", phone: "0912345678", email: "binh@gmail.com", status: "ACTIVE" },
    { id: 3, studentCode: "2021001236", fullName: "Lê Văn Cường", faculty: "Điện - Điện tử", className: "20DDE01", phone: "0923456789", email: "cuong@gmail.com", status: "ACTIVE" },
    { id: 4, studentCode: "2021001237", fullName: "Phạm Thị Dung", faculty: "Ngoại ngữ", className: "20NN03", phone: "0934567890", email: "dung@gmail.com", status: "INACTIVE" },
    { id: 5, studentCode: "2021001238", fullName: "Hoàng Văn Em", faculty: "Kinh tế & Kế toán", className: "20KT01", phone: "0945678901", email: "em@gmail.com", status: "ACTIVE" }
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Dữ Liệu Sinh Viên</h2>
          <p className="text-muted mb-0">Danh mục sinh viên toàn trường, lọc theo khoa/lớp và tra cứu trạng thái khai báo ngoại trú</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7">
            <Download size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <Search size={14} className="text-muted" />
              </span>
              <input type="text" className="form-control border-start-0" placeholder="Tìm theo MSSV, họ tên..." />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm">
              <option value="">Tất cả khoa / viện</option>
              <option>Công nghệ Thông tin</option>
              <option>Quản trị Kinh doanh</option>
              <option>Điện - Điện tử</option>
              <option>Ngoại ngữ</option>
              <option>Kinh tế & Kế toán</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm">
              <option value="">Trạng thái</option>
              <option>ACTIVE</option>
              <option>INACTIVE</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-sm w-100" style={{ backgroundColor: '#0f172a', color: '#fff' }}>Tìm kiếm</button>
          </div>
        </div>
      </div>

      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MSSV</th>
                <th>HỌ VÀ TÊN</th>
                <th>KHOA / VIỆN</th>
                <th>LỚP</th>
                <th>SĐT</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-bottom border-light">
                  <td className="fw-bold"><code>{s.studentCode}</code></td>
                  <td>{s.fullName}</td>
                  <td className="text-muted">{s.faculty}</td>
                  <td><span className="fw-semibold fs-8 text-secondary">{s.className}</span></td>
                  <td className="text-muted fs-8">{s.phone}</td>
                  <td>
                    <span className={`fw-semibold fs-8 ${s.status === 'ACTIVE' ? 'text-success' : 'text-secondary'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-1">Xem hồ sơ</button>
                    <button className="btn btn-sm btn-outline-secondary">Sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-3 py-2 border-top d-flex align-items-center justify-content-between fs-8 text-muted">
          <span>Hiển thị 5 / 1,248 sinh viên</span>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-outline-secondary">‹</button>
            <button className="btn btn-sm" style={{ backgroundColor: '#0f172a', color: '#fff' }}>1</button>
            <button className="btn btn-sm btn-outline-secondary">2</button>
            <button className="btn btn-sm btn-outline-secondary">3</button>
            <button className="btn btn-sm btn-outline-secondary">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
