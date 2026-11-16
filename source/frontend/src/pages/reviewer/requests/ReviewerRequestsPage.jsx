import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Search, RefreshCw, Eye } from 'lucide-react';
import reviewerService from '../../../api/reviewerService';

export default function ReviewerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modal từ chối
  const [rejectModalReq, setRejectModalReq] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await reviewerService.getRequests();
      if (Array.isArray(res)) {
        setRequests(res);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
      showToast("Không thể tải danh sách yêu cầu", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = async (req) => {
    if (!window.confirm(`Xác nhận phê duyệt yêu cầu "${req.requestCode || req.requestId}"?`)) return;
    setActionLoading(true);
    try {
      await reviewerService.approveRequest(req.requestId);
      showToast("Đã phê duyệt yêu cầu thành công!");
      loadRequests();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi phê duyệt yêu cầu", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (req) => {
    setRejectModalReq(req);
    setRejectionReason('');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalReq) return;
    setActionLoading(true);
    try {
      await reviewerService.rejectRequest(rejectModalReq.requestId, rejectionReason || 'Không đáp ứng điều kiện quy định');
      showToast("Đã từ chối yêu cầu!");
      setRejectModalReq(null);
      loadRequests();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi từ chối yêu cầu", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const code = r.requestCode || `REQ-${r.requestId}`;
    const type = r.requestType || '';
    const creator = r.createdByNavigation?.fullName || '';
    const reason = r.reason || '';

    const matchSearch = !searchTerm ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !filterStatus || r.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="badge bg-success text-white">ĐÃ PHÊ DUYỆT</span>;
      case 'REJECTED': return <span className="badge bg-danger text-white">ĐÃ TỪ CHỐI</span>;
      case 'SUBMITTED':
      case 'PENDING': return <span className="badge bg-warning text-dark">CHỜ DUYỆT</span>;
      default: return <span className="badge bg-secondary text-white">{status}</span>;
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Toast alert */}
      {notification && (
        <div className={`alert alert-${notification.type} position-fixed top-0 end-0 m-4 shadow`} style={{ zIndex: 9999 }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Yêu Cầu Phê Duyệt & Kiến Nghị</h2>
          <p className="text-muted mb-0">Xem xét và thẩm định các yêu cầu gia hạn nơi ở, chuyển phòng trọ, cập nhật hợp đồng từ sinh viên</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7" onClick={loadRequests}>
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="app-card-clean bg-white border p-3">
        <div className="row g-2">
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><Search size={14} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Tìm theo mã yêu cầu, loại yêu cầu, người gửi, lý do..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="SUBMITTED">Chờ duyệt (SUBMITTED / PENDING)</option>
              <option value="APPROVED">Đã phê duyệt (APPROVED)</option>
              <option value="REJECTED">Đã từ chối (REJECTED)</option>
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="badge bg-dark text-white p-2 w-100 fs-8">{filteredRequests.length} Yêu cầu</span>
          </div>
        </div>
      </div>

      {/* Bảng yêu cầu */}
      <div className="app-card-clean bg-white border">
        <div className="table-responsive">
          <table className="table align-middle mb-0 fs-7">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ YÊU CẦU</th>
                <th>LOẠI YÊU CẦU</th>
                <th>NGƯỜI GỬI</th>
                <th>NGÀY GỬI</th>
                <th>LÝ DO / NỘI DUNG</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Đang tải yêu cầu...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">Không có yêu cầu nào phù hợp.</td>
                </tr>
              ) : (
                filteredRequests.map((r) => {
                  const code = r.requestCode || `REQ-${r.requestId}`;
                  const type = r.requestType || 'Yêu cầu ngoại trú';
                  const creator = r.createdByNavigation?.fullName || 'Sinh viên';
                  const date = r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('vi-VN') : (r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '—');
                  const isPending = r.status === 'SUBMITTED' || r.status === 'PENDING' || r.status === 'DRAFT';

                  return (
                    <tr key={r.requestId} className="border-bottom border-light">
                      <td className="fw-bold"><code>{code}</code></td>
                      <td className="fw-semibold text-dark">{type}</td>
                      <td>{creator}</td>
                      <td className="text-muted fs-8">{date}</td>
                      <td className="text-muted fs-8" style={{ maxWidth: '260px' }}>
                        {r.reason || '—'}
                      </td>
                      <td>{getStatusBadge(r.status)}</td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-secondary" title="Xem chi tiết" onClick={() => setSelectedReq(r)}>
                            <Eye size={13} />
                          </button>
                          {isPending && (
                            <>
                              <button className="btn btn-outline-success" title="Phê duyệt" onClick={() => handleApprove(r)} disabled={actionLoading}>
                                <CheckCircle2 size={13} />
                              </button>
                              <button className="btn btn-outline-danger" title="Từ chối" onClick={() => handleOpenReject(r)} disabled={actionLoading}>
                                <XCircle size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem chi tiết yêu cầu */}
      {selectedReq && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">Chi Tiết Yêu Cầu: {selectedReq.requestCode || selectedReq.requestId}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedReq(null)} />
              </div>
              <div className="modal-body d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded-2">
                  <div><strong>Mã yêu cầu:</strong> <code>{selectedReq.requestCode || selectedReq.requestId}</code></div>
                  <div><strong>Loại yêu cầu:</strong> {selectedReq.requestType}</div>
                  <div><strong>Người gửi:</strong> {selectedReq.createdByNavigation?.fullName || 'Sinh viên'}</div>
                  <div><strong>Ngày gửi:</strong> {selectedReq.submittedAt ? new Date(selectedReq.submittedAt).toLocaleString('vi-VN') : (selectedReq.createdAt ? new Date(selectedReq.createdAt).toLocaleString('vi-VN') : '—')}</div>
                </div>
                <div>
                  <h6 className="fw-bold text-muted fs-8 text-uppercase">Nội dung / Lý do:</h6>
                  <p className="p-3 border rounded-2 bg-white text-dark mb-0 fs-7">{selectedReq.reason || 'Không có mô tả thêm.'}</p>
                </div>
                {selectedReq.rejectionReason && (
                  <div>
                    <h6 className="fw-bold text-danger fs-8 text-uppercase">Lý do từ chối:</h6>
                    <p className="p-3 border border-danger rounded-2 bg-light text-danger mb-0 fs-7">{selectedReq.rejectionReason}</p>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted fs-8">Trạng thái:</span>
                  {getStatusBadge(selectedReq.status)}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setSelectedReq(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Từ chối yêu cầu */}
      {rejectModalReq && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-danger">Từ Chối Yêu Cầu</h5>
                <button type="button" className="btn-close" onClick={() => setRejectModalReq(null)} />
              </div>
              <form onSubmit={handleConfirmReject}>
                <div className="modal-body">
                  <p className="text-muted fs-7">
                    Bạn đang từ chối yêu cầu <strong>{rejectModalReq.requestCode || rejectModalReq.requestId}</strong> của sinh viên. Vui lòng nhập lý do để gửi phản hồi:
                  </p>
                  <textarea 
                    className="form-control form-control-sm" 
                    rows="3" 
                    required 
                    placeholder="Nhập lý do từ chối chi tiết..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={() => setRejectModalReq(null)}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-danger" disabled={actionLoading}>
                    {actionLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
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
