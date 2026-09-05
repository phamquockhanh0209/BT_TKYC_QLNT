import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import officerService from '../../../api/officerService';
import authService from '../../../api/authService';

const TYPE_MAP = {
  RENEW: { label: 'Gia hạn thời hạn thuê', color: '#2563eb', bg: '#eff6ff' },
  CHANGE_ADDRESS: { label: 'Thay đổi nơi ở', color: '#7c3aed', bg: '#f5f3ff' },
  TERMINATE: { label: 'Chấm dứt tạm trú', color: '#dc2626', bg: '#fef2f2' },
  COMPLAINT: { label: 'Khiếu nại / Góp ý', color: '#d97706', bg: '#fffbeb' },
};

const STATUS_MAP = {
  SUBMITTED: { label: 'CHỜ DUYỆT', color: '#b45309' },
  DRAFT: { label: 'BẢN NHÁP', color: '#64748b' },
  APPROVED: { label: 'ĐÃ DUYỆT', color: '#15803d' },
  REJECTED: { label: 'TỪ CHỐI', color: '#b91c1c' },
};

export default function OfficerRequestsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionModal, setActionModal] = useState({ open: false, item: null, action: '', note: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await officerService.getRequests();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách yêu cầu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (e) => {
    e.preventDefault();
    if (!actionModal.item) return;

    try {
      const user = authService.getCurrentUser();
      const updatedData = {
        ...actionModal.item,
        status: actionModal.action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        processedBy: user?.userId,
        processedAt: new Date().toISOString(),
        approvedAt: actionModal.action === 'APPROVE' ? new Date().toISOString() : null,
        rejectedAt: actionModal.action === 'REJECT' ? new Date().toISOString() : null,
        rejectionReason: actionModal.action === 'REJECT' ? actionModal.note : null
      };

      await officerService.updateRequest(actionModal.item.requestId, updatedData);
      setActionModal({ open: false, item: null, action: '', note: '' });
      await loadData();
    } catch (err) {
      console.error('Lỗi xử lý yêu cầu:', err);
      alert(err?.response?.data?.message || 'Không thể cập nhật yêu cầu.');
    }
  };

  const filtered = items.filter(i => {
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const code = (i.requestCode || '').toLowerCase();
      const reason = (i.reason || '').toLowerCase();
      const studentName = (i.registration?.student?.fullName || '').toLowerCase();
      if (!code.includes(q) && !reason.includes(q) && !studentName.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản Lý Yêu Cầu & Khiếu Nại ({items.length})</h2>
          <p className="text-muted mb-0">Tiếp nhận và giải quyết các yêu cầu gia hạn, chuyển trọ từ sinh viên</p>
        </div>
        <button type="button" onClick={loadData} className="btn btn-outline-secondary fs-7 d-inline-flex align-items-center gap-1">
          <RotateCcw size={15} /> Làm mới
        </button>
      </div>

      {/* Tabs lọc trạng thái */}
      <div className="d-flex gap-2 mb-3">
        {[
          { key: 'ALL', label: 'Tất cả' },
          { key: 'SUBMITTED', label: 'Chờ duyệt' },
          { key: 'DRAFT', label: 'Bản nháp' },
          { key: 'APPROVED', label: 'Đã duyệt' },
          { key: 'REJECTED', label: 'Từ chối' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`btn btn-sm px-3 py-1 rounded-pill fs-7 fw-semibold ${
              filterStatus === tab.key ? 'btn-dark' : 'btn-light border text-muted'
            }`}
            onClick={() => setFilterStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="app-card-clean">
        {/* Tìm kiếm */}
        <div className="row g-2 mb-3">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 fs-7"
                placeholder="Tìm theo mã yêu cầu, lý do, sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ YÊU CẦU</th>
                <th>LOẠI YÊU CẦU</th>
                <th>SINH VIÊN / HỒ SƠ</th>
                <th>LÝ DO / NỘI DUNG</th>
                <th>NGÀY GỬI</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end pe-3">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted fs-7">
                    <div className="spinner-border spinner-border-sm mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
                    <div>Đang tải yêu cầu...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted fs-7">
                    Không có yêu cầu nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const typeCfg = TYPE_MAP[item.requestType] || { label: item.requestType, color: '#374151', bg: '#f3f4f6' };
                  const statusCfg = STATUS_MAP[item.status] || { label: 'CHƯA XÁC ĐỊNH', color: '#64748b' };
                  const student = item.registration?.student || {};

                  return (
                    <tr key={item.requestId}>
                      <td className="fw-bold fs-7" style={{ color: 'var(--primary-color)' }}>
                        {item.requestCode || `#${item.requestId}`}
                      </td>
                      <td>
                        <span 
                          className="badge fw-bold px-2 py-1"
                          style={{ backgroundColor: typeCfg.bg, color: typeCfg.color, fontSize: '0.72rem' }}
                        >
                          {typeCfg.label}
                        </span>
                      </td>
                      <td className="fs-7">
                        <div className="fw-bold text-dark">{student.fullName || '—'}</div>
                        <small className="text-muted fs-8">{student.studentCode ? `MSSV: ${student.studentCode}` : ''} • {item.registration?.registrationCode || ''}</small>
                      </td>
                      <td className="fs-7 text-muted" style={{ maxWidth: '280px' }}>
                        <div className="text-truncate">{item.reason || '—'}</div>
                      </td>
                      <td className="fs-7 text-muted">
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td>
                        <span className="fw-bold text-uppercase" style={{ color: statusCfg.color, fontSize: '0.72rem' }}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        {item.status === 'SUBMITTED' || item.status === 'DRAFT' ? (
                          <div className="d-inline-flex gap-1">
                            <button
                              type="button"
                              onClick={() => setActionModal({ open: true, item, action: 'APPROVE', note: 'Chấp thuận yêu cầu.' })}
                              className="btn btn-sm btn-success py-1 px-2 fs-8 fw-semibold"
                            >
                              Duyệt
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionModal({ open: true, item, action: 'REJECT', note: '' })}
                              className="btn btn-sm btn-outline-danger py-1 px-2 fs-8 fw-semibold"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted fs-8">Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận phê duyệt / từ chối yêu cầu */}
      {actionModal.open && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-3">
                <h6 className="modal-title fw-bold">
                  {actionModal.action === 'APPROVE' ? 'Phê duyệt yêu cầu' : 'Từ chối yêu cầu'}
                </h6>
                <button type="button" className="btn-close" onClick={() => setActionModal({ open: false, item: null, action: '', note: '' })}></button>
              </div>
              <form onSubmit={handleDecision}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label text-muted fs-8">Mã yêu cầu</label>
                    <input type="text" className="form-control bg-light fs-7 fw-semibold" value={actionModal.item?.requestCode || ''} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted fs-8">Nội dung sinh viên gửi</label>
                    <div className="p-2 bg-light rounded fs-7">{actionModal.item?.reason || '—'}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-7">
                      Ghi chú / Phản hồi cho sinh viên
                    </label>
                    <textarea 
                      className="form-control fs-7" 
                      rows="3" 
                      required={actionModal.action === 'REJECT'}
                      placeholder={actionModal.action === 'REJECT' ? 'Nhập lý do từ chối cụ thể...' : 'Nhập ghi chú chấp thuận...'}
                      value={actionModal.note}
                      onChange={(e) => setActionModal({ ...actionModal, note: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer py-2">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setActionModal({ open: false, item: null, action: '', note: '' })}>
                    Hủy
                  </button>
                  <button type="submit" className={`btn btn-sm ${actionModal.action === 'APPROVE' ? 'btn-success' : 'btn-danger'}`}>
                    Xác nhận {actionModal.action === 'APPROVE' ? 'Duyệt' : 'Từ chối'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
