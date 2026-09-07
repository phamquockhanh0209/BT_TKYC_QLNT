import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ArrowRight, RefreshCw, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import reviewerService from '../../../api/reviewerService';

export default function ReviewerOverduePage() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await reviewerService.getReviewQueue();
      if (Array.isArray(res)) {
        // Lọc các hồ sơ quá hạn hoặc đang ở PENDING_REVIEW / SUBMITTED có SLA cảnh báo
        const overdue = res.filter(r => 
          r.status === 'PENDING_REVIEW' || r.status === 'SUBMITTED' || r.slaTracking?.isBreached
        );
        setRegistrations(overdue);
      }
    } catch (err) {
      console.error("Failed to load overdue registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcessNow = (reg) => {
    navigate(`/reviewer/workspace?regId=${reg.registrationId}`);
  };

  const filtered = registrations.filter(r => {
    const code = r.registrationCode || `REG-${r.registrationId}`;
    const name = r.student?.fullName || '';
    const codeSV = r.student?.studentCode || '';
    const fac = r.student?.faculty || '';

    return !searchTerm ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codeSV.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Hồ Sơ Quá Hạn Xét Duyệt SLA</h2>
          <p className="text-muted mb-0">Danh sách các hồ sơ đã chạm ngưỡng hoặc vượt quá hạn định 72 giờ thẩm định theo quy chuẩn nhà trường</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Cảnh báo vi phạm SLA */}
      <div className="p-3 rounded-3 bg-danger text-white d-flex align-items-center justify-content-between shadow-2xs">
        <div className="d-flex align-items-center gap-2">
          <AlertTriangle size={22} className="flex-shrink-0" />
          <span className="fs-7 fw-semibold">
            Cảnh báo: Hiện có {filtered.length} hồ sơ đang trong diện cảnh báo hoặc quá hạn SLA 72h. Chuyên viên cần khẩn trương thẩm định ngay!
          </span>
        </div>
        <span className="badge bg-white text-danger fw-bold fs-7">{filtered.length} Hồ sơ khẩn</span>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="app-card-clean bg-white border p-3">
        <div className="input-group input-group-sm">
          <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
          <input 
            type="text" 
            className="form-control border-start-0" 
            placeholder="Tìm theo mã hồ sơ, tên sinh viên, MSSV, khoa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng hồ sơ quá hạn */}
      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MỨC ĐỘ</th>
                <th>MÃ HỒ SƠ</th>
                <th>SINH VIÊN</th>
                <th>MSSV / KHOA</th>
                <th>NGÀY TIẾP NHẬN</th>
                <th>TRẠNG THÁI HIỆN TẠI</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang kiểm tra hồ sơ quá hạn...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-success fw-semibold">
                    ✅ Tuyệt vời! Hiện không có hồ sơ nào bị quá hạn xét duyệt SLA.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const code = r.registrationCode || `REG-${r.registrationId}`;
                  const sName = r.student?.fullName || '—';
                  const sCode = r.student?.studentCode || '—';
                  const sFaculty = r.student?.faculty || 'CNTT';
                  const date = r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('vi-VN') : (r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '—');

                  return (
                    <tr key={r.registrationId} className="border-bottom border-light">
                      <td>
                        <span className="badge bg-danger text-white fs-8">
                          QUÁ HẠN SLA
                        </span>
                      </td>
                      <td className="fw-bold"><code>{code}</code></td>
                      <td className="fw-semibold text-dark">{sName}</td>
                      <td>
                        <div className="fw-bold text-dark">{sCode}</div>
                        <div className="text-muted fs-8">{sFaculty}</div>
                      </td>
                      <td className="text-muted fs-8">{date}</td>
                      <td>
                        <span className="badge bg-warning text-dark fs-8">
                          {r.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1"
                          onClick={() => handleProcessNow(r)}
                        >
                          Thẩm định ngay <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
