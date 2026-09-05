import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Eye } from 'lucide-react';
import adminService from '../../../api/adminService';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const res = await adminService.getRegistrations();
      if (res && Array.isArray(res)) {
        setRegistrations(res);
      }
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#16a34a';
      case 'PENDING_REVIEW':
      case 'SUBMITTED': return '#ca8a04';
      case 'REJECTED': return '#dc2626';
      case 'REQUEST_INFO': return '#0891b2';
      case 'DRAFT': return '#64748b';
      default: return '#64748b';
    }
  };

  const filtered = registrations.filter(r => {
    const code = r.registrationCode || `REG-${r.registrationId}`;
    const sName = r.student?.fullName || '';
    const sCode = r.student?.studentCode || '';
    const matchSearch = !searchTerm ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Toàn Bộ Hồ Sơ Ngoại Trú</h2>
          <p className="text-muted mb-0">Hệ thống giám sát hồ sơ khai báo cư trú toàn trường từ cơ sở dữ liệu</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadRegistrations}>
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Thanh lọc */}
      <div className="app-card-clean bg-white border p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Mã hồ sơ, MSSV, họ tên sinh viên..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="APPROVED">APPROVED (Đã duyệt)</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW (Chờ thẩm định)</option>
              <option value="SUBMITTED">SUBMITTED (Cán bộ tiếp nhận)</option>
              <option value="REQUEST_INFO">REQUEST_INFO (Yêu cầu bổ sung)</option>
              <option value="REJECTED">REJECTED (Từ chối)</option>
              <option value="DRAFT">DRAFT (Bản nháp)</option>
            </select>
          </div>
          <div className="col-md-3 text-end">
            <span className="badge bg-light text-dark p-2 w-100 fs-8">{filtered.length} Hồ sơ ghi nhận</span>
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
                <th>MSSV / LỚP</th>
                <th>KHOA</th>
                <th>NGÀY NỘP</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end">CHI TIẾT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải dữ liệu hồ sơ...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">Không có hồ sơ nào phù hợp.</td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const code = r.registrationCode || `REG-${r.registrationId}`;
                  const sName = r.student?.fullName || '—';
                  const sCode = r.student?.studentCode || '—';
                  const sClass = r.student?.className || '—';
                  const sFaculty = r.student?.faculty || 'CNTT';
                  const date = r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('vi-VN') : '—';

                  return (
                    <tr key={r.registrationId} className="border-bottom border-light">
                      <td className="fw-bold"><code>{code}</code></td>
                      <td className="fw-semibold text-dark">{sName}</td>
                      <td>
                        <div><code>{sCode}</code></div>
                        <div className="text-muted fs-8">{sClass}</div>
                      </td>
                      <td className="text-muted fs-8">{sFaculty}</td>
                      <td className="text-muted fs-8">{date}</td>
                      <td>
                        <span 
                          className="badge"
                          style={{ 
                            backgroundColor: `${statusColor(r.status)}15`,
                            color: statusColor(r.status),
                            border: `1px solid ${statusColor(r.status)}40`
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedReg(r)}>
                          <Eye size={13} />
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

      {/* Modal Xem Chi Tiết */}
      {selectedReg && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Chi Tiết Hồ Sơ: {selectedReg.registrationCode || selectedReg.registrationId}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedReg(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted fs-8 text-uppercase">Thông tin sinh viên</h6>
                    <div className="p-3 bg-light rounded-2">
                      <div><strong>Họ tên:</strong> {selectedReg.student?.fullName}</div>
                      <div><strong>MSSV:</strong> {selectedReg.student?.studentCode}</div>
                      <div><strong>Khoa:</strong> {selectedReg.student?.faculty}</div>
                      <div><strong>Lớp:</strong> {selectedReg.student?.className}</div>
                      <div><strong>Số điện thoại:</strong> {selectedReg.student?.phone || '—'}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted fs-8 text-uppercase">Địa chỉ cư trú</h6>
                    <div className="p-3 bg-light rounded-2">
                      <div><strong>Số nhà / Tên đường:</strong> {selectedReg.address?.streetAddress || '—'}</div>
                      <div><strong>Phường / Xã:</strong> {selectedReg.address?.ward || '—'}</div>
                      <div><strong>Quận / Huyện:</strong> {selectedReg.address?.district || '—'}</div>
                      <div><strong>Tỉnh / Thành phố:</strong> {selectedReg.address?.province || '—'}</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <h6 className="fw-bold text-muted fs-8 text-uppercase">Trạng thái xét duyệt</h6>
                    <div className="p-3 border rounded-2 d-flex justify-content-between align-items-center">
                      <div>
                        Trạng thái hiện tại: <strong style={{ color: statusColor(selectedReg.status) }}>{selectedReg.status}</strong>
                      </div>
                      <div className="text-muted fs-8">
                        Ngày tạo: {selectedReg.createdAt ? new Date(selectedReg.createdAt).toLocaleString('vi-VN') : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setSelectedReg(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
