import React, { useState, useEffect } from 'react';
import { FileText, Files, History, RefreshCw, Send, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import ReviewerQueueSidebar from './ReviewerQueueSidebar';
import DossierDetailCard from './DossierDetailCard';
import DossierResidenceInfo from './DossierResidenceInfo';
import DossierDocumentsTab from './DossierDocumentsTab';
import DossierHistoryTab from './DossierHistoryTab';
import ReviewerTimelineWidget from './ReviewerTimelineWidget';
import ReviewerGuideWidget from './ReviewerGuideWidget';
import ReviewerActionButtons from './ReviewerActionButtons';
import reviewerService from '../../../api/reviewerService';
import authService from '../../../api/authService';

/**
 * Trang Không gian xét duyệt hồ sơ dành cho Reviewer (Review Workspace)
 * Kết nối dữ liệu thật từ Backend API
 */
export default function ReviewerWorkspacePage() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedReg, setSelectedReg] = useState(null);
  const [activeTab, setActiveTab] = useState('INFO'); // 'INFO' | 'DOCS' | 'HISTORY'
  const [filterStatus, setFilterStatus] = useState('SUBMITTED');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal State
  const [actionModal, setActionModal] = useState({
    open: false,
    type: '', // 'PASS' | 'REQUEST_INFO' | 'REJECT' | 'NOTE'
    title: '',
    note: ''
  });

  // 1. Tải danh sách hàng đợi
  const loadQueue = async (targetId = null) => {
    try {
      setLoadingQueue(true);
      const data = await reviewerService.getReviewQueue({
        status: filterStatus,
        search: searchTerm
      });
      const list = Array.isArray(data) ? data : [];
      setItems(list);

      // Nếu có targetId hoặc chưa chọn item nào -> chọn item đầu tiên
      const currentTarget = targetId || selectedId;
      const found = list.find(i => i.registrationId === currentTarget);
      if (found) {
        setSelectedId(found.registrationId);
        loadDetail(found.registrationId);
      } else if (list.length > 0) {
        setSelectedId(list[0].registrationId);
        loadDetail(list[0].registrationId);
      } else {
        setSelectedId(null);
        setSelectedReg(null);
      }
    } catch (err) {
      console.error('Lỗi tải hàng đợi:', err);
      setMessage({ type: 'danger', text: 'Không thể tải danh sách hàng đợi xét duyệt.' });
    } finally {
      setLoadingQueue(false);
    }
  };

  // 2. Tải chi tiết hồ sơ khi chọn item
  const loadDetail = async (id) => {
    if (!id) return;
    try {
      setLoadingDetail(true);
      const detail = await reviewerService.getRegistrationDetail(id);
      setSelectedReg(detail);
    } catch (err) {
      console.error('Lỗi tải chi tiết hồ sơ:', err);
      setMessage({ type: 'danger', text: 'Không thể tải chi tiết hồ sơ.' });
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [filterStatus]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadQueue();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectRegistration = (item) => {
    setSelectedId(item.registrationId);
    loadDetail(item.registrationId);
  };

  const refreshSelectedDetail = async () => {
    if (selectedReg?.registrationId) {
      await loadDetail(selectedReg.registrationId);
    }
  };

  // Mở modal hành động
  const openActionModal = (type) => {
    if (!selectedReg) return;
    const titles = {
      PASS: 'Xác nhận hồ sơ hợp lệ (Chuyển tiếp duyệt)',
      REQUEST_INFO: 'Yêu cầu sinh viên bổ sung giấy tờ',
      REJECT: 'Từ chối hồ sơ ngoại trú',
      NOTE: 'Thêm ghi chú nội bộ'
    };
    const defaultNotes = {
      PASS: 'Hồ sơ và tài liệu minh chứng hợp lệ, chuyển cán bộ quản lý phê duyệt.',
      REQUEST_INFO: '',
      REJECT: '',
      NOTE: ''
    };
    setActionModal({
      open: true,
      type: type,
      title: titles[type] || 'Thao tác hồ sơ',
      note: defaultNotes[type] || ''
    });
  };

  // Xử lý gửi thẩm định
  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!selectedReg) return;

    if ((actionModal.type === 'REQUEST_INFO' || actionModal.type === 'REJECT') && !actionModal.note.trim()) {
      alert('Vui lòng nhập lý do cụ thể.');
      return;
    }

    try {
      setSubmitting(true);
      const currentUser = authService.getCurrentUser();

      await reviewerService.submitReviewAction(selectedReg.registrationId, {
        action: actionModal.type,
        note: actionModal.note.trim(),
        approverId: currentUser?.userId
      });

      const successMsgs = {
        PASS: `Đã thẩm định hồ sơ ${selectedReg.registrationCode || `#${selectedReg.registrationId}`} đạt yêu cầu!`,
        REQUEST_INFO: `Đã gửi yêu cầu bổ sung giấy tờ cho sinh viên.`,
        REJECT: `Đã từ chối hồ sơ ${selectedReg.registrationCode || `#${selectedReg.registrationId}`}.`
      };

      setMessage({ type: 'success', text: successMsgs[actionModal.type] || 'Thao tác thành công.' });
      setActionModal({ open: false, type: '', title: '', note: '' });

      // Làm mới hàng đợi
      await loadQueue(selectedReg.registrationId);
    } catch (err) {
      console.error('Lỗi thẩm định hồ sơ:', err);
      alert(err?.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviewer-workspace-wrapper">
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="row g-3">
        {/* === CỘT 1 (Trái): Danh sách chờ xét duyệt === */}
        <div className="col-xl-3 col-lg-4 col-12">
          <ReviewerQueueSidebar 
            items={items}
            selectedId={selectedId}
            onSelectRegistration={handleSelectRegistration}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loadingQueue}
          />
        </div>

        {/* === CỘT 2 (Giữa): Bàn soi chi tiết hồ sơ & Giấy tờ === */}
        <div className="col-xl-6 col-lg-8 col-12">
          {loadingDetail ? (
            <div className="app-card-clean p-5 text-center text-muted">
              <div className="spinner-border mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
              <div>Đang tải chi tiết hồ sơ...</div>
            </div>
          ) : (
            <>
              {/* Thông tin sinh viên & Thông tin hồ sơ */}
              <DossierDetailCard registration={selectedReg} />

              {/* 3 Tabs làm việc */}
              <div className="d-flex align-items-center gap-1 border-bottom mb-3" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('INFO')}
                  className={`btn btn-link text-decoration-none py-2 px-3 fw-bold fs-7 d-inline-flex align-items-center gap-2 ${
                    activeTab === 'INFO' ? 'text-success border-bottom border-2 border-success' : 'text-secondary'
                  }`}
                  style={{ color: activeTab === 'INFO' ? 'var(--primary-color) !important' : undefined }}
                >
                  <FileText size={16} /> Thông tin nơi ở & chủ trọ
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('DOCS')}
                  className={`btn btn-link text-decoration-none py-2 px-3 fw-bold fs-7 d-inline-flex align-items-center gap-2 ${
                    activeTab === 'DOCS' ? 'text-success border-bottom border-2 border-success' : 'text-secondary'
                  }`}
                  style={{ color: activeTab === 'DOCS' ? 'var(--primary-color) !important' : undefined }}
                >
                  <Files size={16} /> Giấy tờ đính kèm ({selectedReg?.documents?.length || 0}/4)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('HISTORY')}
                  className={`btn btn-link text-decoration-none py-2 px-3 fw-bold fs-7 d-inline-flex align-items-center gap-2 ${
                    activeTab === 'HISTORY' ? 'text-success border-bottom border-2 border-success' : 'text-secondary'
                  }`}
                  style={{ color: activeTab === 'HISTORY' ? 'var(--primary-color) !important' : undefined }}
                >
                  <History size={16} /> Lịch sử thẩm định ({selectedReg?.approvals?.length || 0})
                </button>
              </div>

              {/* Nội dung theo Tab đang chọn */}
              {activeTab === 'INFO' && <DossierResidenceInfo registration={selectedReg} />}
              {activeTab === 'DOCS' && (
                <DossierDocumentsTab
                  documents={selectedReg?.documents || []}
                  onDocumentVerified={refreshSelectedDetail}
                />
              )}
              {activeTab === 'HISTORY' && <DossierHistoryTab registration={selectedReg} />}
            </>
          )}
        </div>

        {/* === CỘT 3 (Phải): Tiến trình + Tài liệu hướng dẫn + Quyết định xét duyệt === */}
        <div className="col-xl-3 col-lg-12 col-12">
          {/* 1. Tiến trình xử lý (Vertical Stepper) */}
          <ReviewerTimelineWidget />

          {/* 2. Tài liệu hướng dẫn (PDF) */}
          <ReviewerGuideWidget />

          {/* 3. Khối Nút Hành Động Quyết Định */}
          <ReviewerActionButtons 
            onApprove={() => openActionModal('PASS')}
            onRequestInfo={() => openActionModal('REQUEST_INFO')}
            onReject={() => openActionModal('REJECT')}
            onAddNote={() => openActionModal('NOTE')}
          />
        </div>
      </div>

      {/* Modal Thao tác thẩm định */}
      {actionModal.open && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-3">
                <h6 className="modal-title fw-bold d-flex align-items-center gap-2">
                  {actionModal.type === 'PASS' && <CheckCircle2 size={18} className="text-success" />}
                  {actionModal.type === 'REQUEST_INFO' && <AlertCircle size={18} className="text-warning" />}
                  {actionModal.type === 'REJECT' && <XCircle size={18} className="text-danger" />}
                  {actionModal.title}
                </h6>
                <button type="button" className="btn-close" onClick={() => setActionModal({ ...actionModal, open: false })}></button>
              </div>
              <form onSubmit={handleConfirmAction}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-muted fs-8">Hồ sơ thẩm định</label>
                    <input
                      type="text"
                      className="form-control bg-light fs-7 fw-semibold"
                      value={`${selectedReg?.registrationCode || `#${selectedReg?.registrationId}`} — ${selectedReg?.student?.fullName || ''} (${selectedReg?.student?.studentCode || ''})`}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold fs-7">
                      {actionModal.type === 'PASS' ? 'Ghi chú thẩm định' : 'Lý do / Nội dung chi tiết'} <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control fs-7"
                      rows="4"
                      placeholder={
                        actionModal.type === 'PASS'
                          ? 'Nhập ghi chú thẩm định (mặc định: Đầy đủ hồ sơ, hợp lệ)...'
                          : actionModal.type === 'REQUEST_INFO'
                          ? 'Mô tả rõ loại giấy tờ sinh viên cần bổ sung hoặc chụp lại (VD: Ảnh CCCD bị mờ, thiếu CT07)...'
                          : 'Nhập lý do từ chối hồ sơ ngoại trú...'
                      }
                      value={actionModal.note}
                      onChange={(e) => setActionModal({ ...actionModal, note: e.target.value })}
                      required={actionModal.type !== 'PASS'}
                    />
                  </div>
                </div>
                <div className="modal-footer py-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-light" 
                    onClick={() => setActionModal({ ...actionModal, open: false })}
                    disabled={submitting}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-sm text-white d-inline-flex align-items-center gap-1 ${
                      actionModal.type === 'PASS' ? 'btn-success' : actionModal.type === 'REQUEST_INFO' ? 'btn-warning' : 'btn-danger'
                    }`}
                    style={actionModal.type === 'PASS' ? { backgroundColor: 'var(--primary-color)' } : undefined}
                    disabled={submitting}
                  >
                    <Send size={14} /> {submitting ? 'Đang lưu...' : 'Xác nhận'}
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

