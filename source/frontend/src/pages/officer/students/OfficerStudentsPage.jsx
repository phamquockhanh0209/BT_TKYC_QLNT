import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, User, Mail, Phone, BookOpen } from 'lucide-react';
import officerService from '../../../api/officerService';

export default function OfficerStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await officerService.getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách sinh viên:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const faculties = Array.from(new Set(students.map(s => s.faculty).filter(Boolean)));

  const filtered = students.filter(s => {
    if (selectedFaculty !== 'ALL' && s.faculty !== selectedFaculty) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const code = (s.studentCode || '').toLowerCase();
      const name = (s.fullName || '').toLowerCase();
      const className = (s.className || '').toLowerCase();
      if (!code.includes(q) && !name.includes(q) && !className.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Danh Sách Sinh Viên Toàn Trường ({students.length})</h2>
          <p className="text-muted mb-0">Tra cứu thông tin cá nhân, khoa lớp và tình trạng quản lý sinh viên</p>
        </div>
        <button type="button" onClick={loadData} className="btn btn-outline-secondary fs-7 d-inline-flex align-items-center gap-1">
          <RotateCcw size={15} /> Làm mới
        </button>
      </div>

      <div className="app-card-clean">
        {/* Tìm kiếm & lọc */}
        <div className="row g-2 mb-3">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 fs-7"
                placeholder="Tìm kiếm theo MSSV, họ tên, lớp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select fs-7"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="ALL">Tất cả Khoa/Viện</option>
              {faculties.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bảng sinh viên */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MSSV</th>
                <th>HỌ VÀ TÊN</th>
                <th>KHOA / VIỆN</th>
                <th>LỚP</th>
                <th>LIÊN HỆ</th>
                <th>NGÀY SINH</th>
                <th>TRẠNG THÁI HỌC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted fs-7">
                    <div className="spinner-border spinner-border-sm mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
                    <div>Đang tải danh sách sinh viên...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted fs-7">
                    Không tìm thấy sinh viên nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.studentId}>
                    <td className="fw-bold fs-7" style={{ color: 'var(--primary-color)' }}>
                      {s.studentCode}
                    </td>
                    <td>
                      <div className="fw-bold text-dark fs-7">{s.fullName}</div>
                      <small className="text-muted fs-8">{s.gender || '—'}</small>
                    </td>
                    <td className="fs-7 text-muted">{s.faculty || '—'}</td>
                    <td className="fs-7 fw-semibold">{s.className || '—'}</td>
                    <td className="fs-8 text-muted">
                      <div><Mail size={12} className="me-1 inline" />{s.email || '—'}</div>
                      <div><Phone size={12} className="me-1 inline" />{s.phone || '—'}</div>
                    </td>
                    <td className="fs-7 text-muted">
                      {s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td>
                      <span className={`badge px-2 py-1 ${s.academicStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.72rem' }}>
                        {s.academicStatus === 'ACTIVE' ? 'ĐANG HỌC' : s.academicStatus || 'ĐANG HỌC'}
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
