import React, { useState, useEffect } from 'react';
import { FileEdit, Search, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import reviewerService from '../../../api/reviewerService';

export default function ReviewerAdditionalInfoPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await reviewerService.getReviewQueue({ status: 'NEED_MORE_INFO' });
      if (Array.isArray(res)) {
        setRegistrations(res.filter(r => r.status === 'NEED_MORE_INFO'));
      }
    } catch (err) {
      console.error("Failed to load request-info registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = registrations.filter(r => {
    const code = r.registrationCode || `REG-${r.registrationId}`;
    const name = r.student?.fullName || '';
    const codeSV = r.student?.studentCode || '';

    return !searchTerm ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codeSV.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Hồ Sơ Chờ Bổ Sung Giấy Tờ</h2>
          <p className="text-muted mb-0">Theo dõi các hồ sơ đã gửi yêu cầu sinh viên cung cấp lại giấy tờ chứng thực (CT07, hợp đồng thuê...)</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Thông tin thời hạn */}
      <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <AlertCircle size={20} className="text-muted flex-shrink-0" />
          <span className="fs-7 text-dark">
            Theo quy định, sinh viên có thời hạn tối đa <strong>120 giờ (5 ngày)</strong> để nộp lại tài liệu bổ sung trước khi hồ sơ bị tự động hủy bỏ.
          </span>
        </div>
        <span className="badge bg-dark text-white fs-8">{filtered.length} Hồ sơ chờ sinh viên</span>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="app-card-clean bg-white border p-3">
        <div className="input-group input-group-sm">
          <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
          <input 
            type="text" 
            className="form-control border-start-0" 
            placeholder="Tìm theo mã hồ sơ, tên sinh viên, MSSV..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng hồ sơ chờ bổ sung */}
      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ HỒ SƠ</th>
                <th>SINH VIÊN</th>
                <th>MSSV / LỚP</th>
                <th>KHOA</th>
                <th>NGÀY YÊU CẦU</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải danh sách...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Không có hồ sơ nào đang chờ sinh viên bổ sung tài liệu.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const code = r.registrationCode || `REG-${r.registrationId}`;
                  const sName = r.student?.fullName || '—';
                  const sCode = r.student?.studentCode || '—';
                  const sClass = r.student?.className || '—';
                  const sFaculty = r.student?.faculty || 'CNTT';
                  const reqDate = r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('vi-VN') : '—';

                  return (
                    <tr key={r.registrationId} className="border-bottom border-light">
                      <td className="fw-bold"><code>{code}</code></td>
                      <td className="fw-semibold text-dark">{sName}</td>
                      <td>
                        <div className="fw-bold text-dark">{sCode}</div>
                        <div className="text-muted fs-8">{sClass}</div>
                      </td>
                      <td className="text-muted fs-8">{sFaculty}</td>
                      <td className="text-muted fs-8">{reqDate}</td>
                      <td>
                        <span className="badge bg-info text-white fs-8">
                          CHỜ SV BỔ SUNG
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" onClick={() => setSelectedReg(r)}>
                          <Eye size={13} /> Chi tiết
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

      {/* Modal Xem chi tiết */}
      {selectedReg && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">Hồ Sơ: {selectedReg.registrationCode || selectedReg.registrationId}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedReg(null)} />
              </div>
              <div className="modal-body d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded-2">
                  <div><strong>Sinh viên:</strong> {selectedReg.student?.fullName || '—'}</div>
                  <div><strong>MSSV:</strong> {selectedReg.student?.studentCode || '—'}</div>
                  <div><strong>Khoa:</strong> {selectedReg.student?.faculty || '—'}</div>
                  {(() => {
                    const addrObj = selectedReg.addresses?.[0] || selectedReg.address || {};
                    const addrStr = [addrObj.addressLine || addrObj.streetAddress, addrObj.ward, addrObj.district, addrObj.province || addrObj.city].filter(Boolean).join(', ');
                    return <div><strong>Địa chỉ:</strong> {addrStr || 'Chưa có địa chỉ'}</div>;
                  })()}
                </div>
                <div className="p-3 border rounded-2 bg-white">
                  <div className="fw-semibold text-dark mb-1">Trạng thái hồ sơ:</div>
                  <span className="badge bg-info text-white fs-7">CẦN BỔ SUNG GIẤY TỜ</span>
                  <div className="text-muted fs-8 mt-2">
                    Sinh viên đã nhận được thông báo yêu cầu tải lại các tài liệu minh chứng hợp lệ để tiếp tục quy trình xét duyệt.
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
