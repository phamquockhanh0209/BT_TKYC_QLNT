import React, { useState, useEffect } from 'react';
import { CheckCheck, Download, Search, RefreshCw, Eye, X, Filter } from 'lucide-react';
import reviewerService from '../../../api/reviewerService';

export default function ReviewerProcessedPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await reviewerService.getProcessedRegistrations();
      if (Array.isArray(data)) {
        setRegistrations(data);
      }
    } catch (err) {
      console.error("Failed to load processed registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = registrations.filter(r => {
    const code = r.registrationCode || `REG-${r.registrationId}`;
    const name = r.student?.fullName || '';
    const studentCode = r.student?.studentCode || '';
    const faculty = r.student?.faculty || '';

    const matchSearch = !searchTerm ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDecision = !filterDecision || r.status === filterDecision;

    return matchSearch && matchDecision;
  });

  const handleExport = () => {
    const jsonStr = JSON.stringify(filteredList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ho_so_da_xu_ly_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Hồ Sơ Đã Xử Lý</h2>
          <p className="text-muted mb-0">Danh sách các hồ sơ ngoại trú đã được chuyên viên thẩm định đưa ra quyết định phê duyệt hoặc từ chối</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={handleExport}>
            <Download size={16} /> Xuất Dữ Liệu
          </button>
        </div>
      </div>

      {/* Thanh lọc & tìm kiếm */}
      <div className="app-card-clean bg-white border p-3">
        <div className="row g-2">
          <div className="col-md-6">
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
          <div className="col-md-4">
            <select className="form-select form-select-sm" value={filterDecision} onChange={e => setFilterDecision(e.target.value)}>
              <option value="">Tất cả quyết định (Đã duyệt & Từ chối)</option>
              <option value="APPROVED">ĐÃ PHÊ DUYỆT (APPROVED)</option>
              <option value="REJECTED">ĐÃ TỪ CHỐI (REJECTED)</option>
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-dark text-white p-2 w-100 fs-8">{filteredList.length} Hồ sơ đã xử lý</span>
          </div>
        </div>
      </div>

      {/* Bảng danh sách hồ sơ đã xử lý */}
      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ HỒ SƠ</th>
                <th>SINH VIÊN</th>
                <th>MSSV / LỚP</th>
                <th>ĐỊA CHỈ NGOẠI TRÚ</th>
                <th>NGÀY XỬ LÝ</th>
                <th>QUYẾT ĐỊNH</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải danh sách hồ sơ...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">Không tìm thấy hồ sơ đã xử lý nào phù hợp.</td>
                </tr>
              ) : (
                filteredList.map((r) => {
                  const code = r.registrationCode || `REG-${r.registrationId}`;
                  const sName = r.student?.fullName || '—';
                  const sCode = r.student?.studentCode || '—';
                  const sClass = r.student?.className || '—';
                  const addr = r.address ? `${r.address.streetAddress || ''}, ${r.address.ward || ''}, ${r.address.district || ''}` : 'Chưa có địa chỉ';
                  const processedDate = r.approvedAt ? new Date(r.approvedAt).toLocaleDateString('vi-VN') : (r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('vi-VN') : '—');
                  const isApproved = r.status === 'APPROVED';

                  return (
                    <tr key={r.registrationId} className="border-bottom border-light">
                      <td className="fw-bold"><code>{code}</code></td>
                      <td className="fw-semibold text-dark">{sName}</td>
                      <td>
                        <div className="fw-bold text-dark">{sCode}</div>
                        <div className="text-muted fs-8">{sClass}</div>
                      </td>
                      <td className="text-muted fs-8" style={{ maxWidth: '240px' }}>{addr}</td>
                      <td className="text-muted fs-8">{processedDate}</td>
                      <td>
                        {isApproved ? (
                          <span className="badge bg-success text-white fs-8">ĐÃ PHÊ DUYỆT</span>
                        ) : (
                          <span className="badge bg-danger text-white fs-8">ĐÃ TỪ CHỐI</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" onClick={() => setSelectedReg(r)}>
                          <Eye size={13} /> Xem
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

      {/* Modal Xem chi tiết hồ sơ đã xử lý */}
      {selectedReg && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">
                  Hồ Sơ: {selectedReg.registrationCode || `REG-${selectedReg.registrationId}`}
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedReg(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted fs-8 text-uppercase">Thông tin sinh viên</h6>
                    <div className="p-3 bg-light rounded-2">
                      <div><strong>Họ và tên:</strong> {selectedReg.student?.fullName}</div>
                      <div><strong>Mã số SV:</strong> {selectedReg.student?.studentCode}</div>
                      <div><strong>Khoa / Lớp:</strong> {selectedReg.student?.faculty} — {selectedReg.student?.className}</div>
                      <div><strong>Số điện thoại:</strong> {selectedReg.student?.phone || '—'}</div>
                      <div><strong>Email:</strong> {selectedReg.student?.email || '—'}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted fs-8 text-uppercase">Địa chỉ ngoại trú</h6>
                    <div className="p-3 bg-light rounded-2">
                      <div><strong>Địa chỉ:</strong> {selectedReg.address?.streetAddress || '—'}</div>
                      <div><strong>Phường / Xã:</strong> {selectedReg.address?.ward || '—'}</div>
                      <div><strong>Quận / Huyện:</strong> {selectedReg.address?.district || '—'}</div>
                      <div><strong>Tỉnh / Thành phố:</strong> {selectedReg.address?.province || '—'}</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <h6 className="fw-bold text-muted fs-8 text-uppercase">Kết quả thẩm định bởi Reviewer</h6>
                    <div className="p-3 border rounded-2 d-flex flex-column gap-2 bg-light">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold text-dark">Quyết định chính thức:</span>
                        {selectedReg.status === 'APPROVED' ? (
                          <span className="badge bg-success text-white fs-7">ĐÃ PHÊ DUYỆT (APPROVED)</span>
                        ) : (
                          <span className="badge bg-danger text-white fs-7">ĐÃ TỪ CHỐI (REJECTED)</span>
                        )}
                      </div>
                      <div className="text-muted fs-8">
                        Thời gian quyết định: {selectedReg.approvedAt ? new Date(selectedReg.approvedAt).toLocaleString('vi-VN') : (selectedReg.updatedAt ? new Date(selectedReg.updatedAt).toLocaleString('vi-VN') : '—')}
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
