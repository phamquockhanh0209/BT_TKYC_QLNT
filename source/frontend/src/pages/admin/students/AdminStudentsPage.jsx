import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Download, RefreshCw } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStudents();
      if (res && Array.isArray(res)) {
        setStudents(res);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const defaultStudents = [
    { studentId: 1, studentCode: "2021001234", fullName: "Nguyễn Văn An", faculty: "Công nghệ Thông tin", className: "20CNTT01", phone: "0901234567", email: "an@gmail.com", status: "ACTIVE" },
    { studentId: 2, studentCode: "2021001235", fullName: "Trần Thị Bình", faculty: "Quản trị Kinh doanh", className: "20QTKD02", phone: "0912345678", email: "binh@gmail.com", status: "ACTIVE" },
    { studentId: 3, studentCode: "2021001236", fullName: "Lê Văn Cường", faculty: "Điện - Điện tử", className: "20DDE01", phone: "0923456789", email: "cuong@gmail.com", status: "ACTIVE" }
  ];

  const displayList = students.length > 0 ? students : defaultStudents;

  const filtered = displayList.filter(s => {
    const code = s.studentCode || '';
    const name = s.fullName || '';
    const email = s.email || '';
    const fac = s.faculty || '';

    const matchSearch = !searchTerm ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFac = !filterFaculty || fac === filterFaculty;

    return matchSearch && matchFac;
  });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Dữ Liệu Sinh Viên</h2>
          <p className="text-muted mb-0">Danh mục sinh viên toàn trường, lọc theo khoa/lớp và trạng thái ngoại trú</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadStudents}>
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <Search size={14} className="text-muted" />
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Tìm theo MSSV, họ tên, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select form-select-sm" value={filterFaculty} onChange={e => setFilterFaculty(e.target.value)}>
              <option value="">Tất cả khoa / viện</option>
              <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
              <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
              <option value="Điện - Điện tử">Điện - Điện tử</option>
              <option value="Ngoại ngữ">Ngoại ngữ</option>
              <option value="Kinh tế & Kế toán">Kinh tế & Kế toán</option>
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-light text-dark p-2 w-100 fs-8">{filtered.length} Sinh viên</span>
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
                <th>SỐ ĐIỆN THOẠI</th>
                <th>EMAIL</th>
                <th className="text-end">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải danh sách sinh viên...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">Không tìm thấy sinh viên phù hợp.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.studentId || s.id} className="border-bottom border-light">
                    <td className="fw-bold"><code>{s.studentCode}</code></td>
                    <td className="fw-semibold text-dark">{s.fullName}</td>
                    <td>{s.faculty || '—'}</td>
                    <td><span className="badge bg-light text-dark border">{s.className || '—'}</span></td>
                    <td className="text-muted fs-8">{s.phone || '—'}</td>
                    <td className="text-muted fs-8">{s.email || '—'}</td>
                    <td className="text-end">
                      <span className="badge bg-success-subtle text-success fs-8">
                        {s.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
