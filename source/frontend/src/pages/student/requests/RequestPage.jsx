import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, AlertTriangle, FileText, Send, X, RefreshCw, MapPin } from 'lucide-react';
import authService from '../../../api/authService';
import studentService from '../../../api/studentService';

const STATUS_CONFIG = {
  SUBMITTED:    { label: 'CHỜ XÁC NHẬN',   badgeClass: 'badge-pending',  icon: <Clock size={13} /> },
  UNDER_REVIEW: { label: 'ĐANG XÉT DUYỆT', badgeClass: 'badge-pending',  icon: <Clock size={13} /> },
  PROCESSING:   { label: 'ĐANG XỬ LÝ',     badgeClass: 'badge-pending',  icon: <Clock size={13} /> },
  APPROVED:     { label: 'ĐÃ DUYỆT',        badgeClass: 'badge-active',   icon: <CheckCircle size={13} /> },
  ACTIVE:       { label: 'HOẠT ĐỘNG',       badgeClass: 'badge-active',   icon: <CheckCircle size={13} /> },
  REJECTED:     { label: 'BỊ TỪ CHỐI',      badgeClass: 'badge-rejected', icon: <AlertTriangle size={13} /> },
  DRAFT:        { label: 'BẢN NHÁP',        badgeClass: 'badge-draft',    icon: <FileText size={13} /> },
};

// FIX: Đồng bộ với DB CHECK constraint và backend Constants
const REQUEST_TYPE_OPTIONS = [
  { value: 'RENEWAL',        label: 'Gia hạn thời gian thuê trọ' },
  { value: 'CHANGE_ADDRESS', label: 'Thay đổi nơi ở ngoại trú' },
  { value: 'TERMINATION',    label: 'Chấm dứt hợp đồng tạm trú' },
];

// Label hiển thị trong bảng
const TYPE_LABELS = {
  RENEWAL:        'Gia hạn thời gian thuê trọ',
  CHANGE_ADDRESS: 'Thay đổi nơi ở ngoại trú',
  TERMINATION:    'Chấm dứt hợp đồng tạm trú',
  // Giữ lại label cũ cho dữ liệu lịch sử đã có trong DB
  RENEW:          'Gia hạn thời gian thuê trọ',
  TERMINATE:      'Chấm dứt hợp đồng tạm trú',
};

export default function RequestPage() {
  const [items, setItems] = useState([]);
  const [activeReg, setActiveReg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [requestType, setRequestType] = useState('RENEWAL'); // FIX: default RENEWAL thay vì RENEW
  const [reason, setReason] = useState('');
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  // FIX: Thêm state cho địa chỉ mới (dành cho CHANGE_ADDRESS)
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newCity, setNewCity] = useState('');

  // Đọc query param ?type=CHANGE_ADDRESS từ URL (khi redirect từ ResidencePage)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    if (typeParam && REQUEST_TYPE_OPTIONS.some(o => o.value === typeParam)) {
      setRequestType(typeParam);
      setShowModal(true);
      // Xóa query param khỏi URL mà không reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const currentUser = authService.getCurrentUser();
      const code = currentUser?.username || currentUser?.student?.studentCode;

      if (!code) {
        setError('Không xác định được thông tin sinh viên.');
        return;
      }

      const student = await studentService.getStudentByCode(code);
      if (!student?.studentId) {
        setError('Không tìm thấy hồ sơ sinh viên.');
        return;
      }

      const registrations = await studentService.getRegistrationsByStudent(student.studentId);
      const regList = Array.isArray(registrations) ? registrations : [];

      // Tìm hồ sơ active nhất
      const currentReg = regList.find(r => ['APPROVED', 'ACTIVE', 'SUBMITTED', 'PROCESSING'].includes(r.status)) || regList[0];
      setActiveReg(currentReg || null);

      // Thu thập tất cả yêu cầu
      const compiledItems = [];

      // 1. Hồ sơ đăng ký ngoại trú (mỗi hồ sơ là 1 yêu cầu đăng ký)
      for (const reg of regList) {
        const addr = reg.addresses?.[0];
        const addrText = addr
          ? [addr.addressLine, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')
          : 'Chưa có thông tin địa chỉ';

        compiledItems.push({
          id: `reg-${reg.registrationId}`,
          code: reg.registrationCode || `HS-${reg.registrationId}`,
          type: 'Đăng ký ngoại trú mới',
          content: `Khai báo nơi ở ngoại trú: ${addrText}`,
          date: reg.submittedAt || reg.createdAt,
          status: reg.status,
          isRegistration: true
        });

        // 2. Lấy các yêu cầu phụ đính kèm hồ sơ này (nếu có)
        try {
          const subRequests = await studentService.getRequestsByRegistration(reg.registrationId);
          if (Array.isArray(subRequests)) {
            for (const req of subRequests) {
              compiledItems.push({
                id: `req-${req.requestId}`,
                code: req.requestCode || `YC-${req.requestId}`,
                type: TYPE_LABELS[req.requestType] || req.requestType,
                content: req.reason || 'Yêu cầu xử lý hồ sơ',
                date: req.submittedAt || req.createdAt,
                status: req.status,
                isRegistration: false
              });
            }
          }
        } catch {
          // Bỏ qua nếu chưa có bảng yêu cầu con
        }
      }

      setItems(compiledItems);
    } catch (err) {
      console.error('Lỗi nạp danh sách yêu cầu:', err);
      setError('Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const pendingCount = items.filter(
    item => ['SUBMITTED', 'PROCESSING', 'UNDER_REVIEW'].includes(item.status)
  ).length;

  // Reset form khi đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setReason('');
    setNewAddressLine('');
    setNewWard('');
    setNewDistrict('');
    setNewCity('');
    setFormMsg({ type: '', text: '' });
    setRequestType('RENEWAL');
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setFormMsg({ type: 'danger', text: 'Vui lòng nhập lý do/nội dung chi tiết.' });
      return;
    }
    // FIX: Validate địa chỉ mới khi loại CHANGE_ADDRESS
    if (requestType === 'CHANGE_ADDRESS' && !newAddressLine.trim()) {
      setFormMsg({ type: 'danger', text: 'Vui lòng nhập địa chỉ mới khi báo chuyển trọ.' });
      return;
    }
    if (!activeReg) {
      setFormMsg({ type: 'danger', text: 'Bạn cần có hồ sơ ngoại trú trước khi tạo yêu cầu mới.' });
      return;
    }

    try {
      setSubmitting(true);
      setFormMsg({ type: '', text: '' });
      const currentUser = authService.getCurrentUser();
      const code = `YC-${Date.now().toString().slice(-6)}`;

      // FIX: Gửi đúng requestType (RENEWAL/TERMINATION/CHANGE_ADDRESS)
      // và thêm các trường địa chỉ mới nếu là CHANGE_ADDRESS
      await studentService.createRequest({
        registrationId: activeReg.registrationId,
        createdBy: currentUser?.userId,
        requestCode: code,
        requestType: requestType,          // FIX: RENEWAL / CHANGE_ADDRESS / TERMINATION
        status: 'SUBMITTED',
        reason: reason.trim(),
        submittedAt: new Date().toISOString(),
        // FIX: Thêm trường địa chỉ mới (chỉ có giá trị khi CHANGE_ADDRESS)
        newAddressLine: requestType === 'CHANGE_ADDRESS' ? newAddressLine.trim() : null,
        newWard:        requestType === 'CHANGE_ADDRESS' ? newWard.trim()        : null,
        newDistrict:    requestType === 'CHANGE_ADDRESS' ? newDistrict.trim()    : null,
        newCity:        requestType === 'CHANGE_ADDRESS' ? newCity.trim()        : null,
      });

      setFormMsg({ type: 'success', text: 'Gửi yêu cầu thành công!' });
      setTimeout(() => {
        handleCloseModal();
        loadData();
      }, 1000);
    } catch (err) {
      setFormMsg({
        type: 'danger',
        text: err?.response?.data?.message || 'Không thể tạo yêu cầu. Vui lòng thử lại.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Yêu Cầu &amp; Khiếu Nại {pendingCount > 0 && <span className="text-warning fs-5">({pendingCount} đang xử lý)</span>}
          </h2>
          <p className="text-muted mb-0">Theo dõi hồ sơ đăng ký ngoại trú và các yêu cầu gửi tới cán bộ nhà trường</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1" onClick={loadData}>
            <RefreshCw size={16} /> Làm mới
          </button>
          <button
            className="btn btn-success d-inline-flex align-items-center gap-2"
            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} /> Gửi yêu cầu mới
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="app-card-clean">
        {loading ? (
          <div className="py-5 text-center text-muted">
            <div className="spinner-border mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
            <div>Đang tải dữ liệu yêu cầu...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-5 text-center text-muted">
            <p className="fs-5 mb-2">Hiện tại bạn chưa có yêu cầu hay hồ sơ nào đang xử lý.</p>
            <p className="fs-7 text-secondary">
              Khi bạn nộp hồ sơ khai báo ngoại trú hoặc gửi yêu cầu gia hạn, thông tin sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                  <th>MÃ YÊU CẦU / HỒ SƠ</th>
                  <th>LOẠI YÊU CẦU</th>
                  <th>NỘI DUNG</th>
                  <th>NGÀY GỬI</th>
                  <th>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || {
                    label: item.status,
                    badgeClass: 'badge-draft',
                    icon: null
                  };
                  return (
                    <tr key={item.id}>
                      <td className="fw-bold text-dark">{item.code}</td>
                      <td>
                        <span className="fw-semibold">{item.type}</span>
                      </td>
                      <td style={{ maxWidth: '420px' }}>
                        <span className="text-muted fs-7">{item.content}</span>
                      </td>
                      <td>{formatDate(item.date)}</td>
                      <td>
                        <span className={`badge-pill-custom ${cfg.badgeClass} d-inline-flex align-items-center gap-1`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal gửi yêu cầu mới */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Gửi Yêu Cầu Mới</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleCreateRequest}>
                <div className="modal-body">
                  {formMsg.text && (
                    <div className={`alert alert-${formMsg.type} py-2 mb-3`} style={{ fontSize: '0.9rem' }}>
                      {formMsg.text}
                    </div>
                  )}

                  {!activeReg && (
                    <div className="alert alert-warning py-2 mb-3" style={{ fontSize: '0.85rem' }}>
                      Bạn chưa có hồ sơ ngoại trú nào trong hệ thống. Vui lòng khai báo ngoại trú trước.
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Hồ sơ liên quan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={activeReg ? `${activeReg.registrationCode || 'HS-' + activeReg.registrationId} (${activeReg.status})` : 'Chưa có hồ sơ'}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Loại yêu cầu</label>
                    <select
                      className="form-select"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                    >
                      {REQUEST_TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* FIX: Hiển thị form địa chỉ mới chỉ khi loại CHANGE_ADDRESS */}
                  {requestType === 'CHANGE_ADDRESS' && (
                    <div className="mb-3 p-3 rounded" style={{ backgroundColor: '#f0f9f4', border: '1px solid #c3e6cb' }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <MapPin size={16} className="text-success" />
                        <span className="fw-semibold text-success">Địa chỉ nơi ở mới</span>
                        <span className="text-danger">*</span>
                      </div>
                      <div className="row g-2">
                        <div className="col-12">
                          <label className="form-label fw-semibold fs-7">Số nhà / Tên đường <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="VD: 123 Nguyễn Văn Linh"
                            value={newAddressLine}
                            onChange={(e) => setNewAddressLine(e.target.value)}
                            required={requestType === 'CHANGE_ADDRESS'}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold fs-7">Phường / Xã</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="VD: Phường Tân Phú"
                            value={newWard}
                            onChange={(e) => setNewWard(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold fs-7">Quận / Huyện</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="VD: Quận 9"
                            value={newDistrict}
                            onChange={(e) => setNewDistrict(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold fs-7">Tỉnh / Thành phố</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="VD: TP. Hồ Chí Minh"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {requestType === 'CHANGE_ADDRESS' ? 'Lý do chuyển trọ' : 'Lý do / Nội dung chi tiết'}
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder={
                        requestType === 'RENEWAL'
                          ? 'Mô tả lý do gia hạn, thời gian thuê trọ mới...'
                          : requestType === 'CHANGE_ADDRESS'
                          ? 'Mô tả lý do chuyển sang nơi ở mới...'
                          : requestType === 'TERMINATION'
                          ? 'Mô tả lý do chấm dứt tạm trú ngoại trú...'
                          : 'Mô tả chi tiết lý do và mong muốn gửi tới cán bộ xét duyệt...'
                      }
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={handleCloseModal}>
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success d-inline-flex align-items-center gap-1"
                    style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                    disabled={submitting || !activeReg}
                  >
                    <Send size={16} /> {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
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
