import React from 'react';
import { Search, SlidersHorizontal, ChevronRight, Clock, AlertCircle } from 'lucide-react';

const STATUS_BADGE = {
  SUBMITTED:    { label: 'CHỜ DUYỆT', bg: '#fef3c7', color: '#b45309' },
  UNDER_REVIEW: { label: 'ĐANG XÉT DUYỆT', bg: '#e0e7ff', color: '#3730a3' },
  PROCESSING:   { label: 'ĐANG XỬ LÝ', bg: '#e0e7ff', color: '#3730a3' },
  APPROVED:     { label: 'ĐÃ DUYỆT', bg: '#dcfce7', color: '#15803d' },
  ACTIVE:       { label: 'HIỆU LỰC', bg: '#dcfce7', color: '#15803d' },
  REJECTED:     { label: 'BỔ SUNG/TỪ CHỐI', bg: '#fee2e2', color: '#b91c1c' },
  OVERDUE:      { label: 'QUÁ HẠN SLA', bg: '#ffedd5', color: '#c2410c' },
  DRAFT:        { label: 'BẢN NHÁP', bg: '#f1f5f9', color: '#475569' },
};

export default function ReviewerQueueSidebar({
  items = [],
  selectedId = null,
  onSelectRegistration,
  filterStatus = 'SUBMITTED',
  onFilterChange,
  searchTerm = '',
  onSearchChange,
  loading = false
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Đếm số lượng theo filter
  const counts = {
    ALL: items.length,
    SUBMITTED: items.filter(i => i.status === 'SUBMITTED').length,
    UNDER_REVIEW: items.filter(i => ['UNDER_REVIEW', 'PROCESSING'].includes(i.status)).length,
    REJECTED: items.filter(i => i.status === 'REJECTED').length,
  };

  const filterTabs = [
    { key: 'SUBMITTED', label: 'Chờ duyệt' },
    { key: 'UNDER_REVIEW', label: 'Đang xử lý' },
    { key: 'REJECTED', label: 'Bổ sung' },
    { key: 'OVERDUE', label: 'Quá hạn' },
    { key: 'ALL', label: 'Tất cả' },
  ];

  return (
    <div className="app-card-clean p-3 d-flex flex-column h-100" style={{ minHeight: '680px' }}>
      {/* Tiêu đề cột hàng đợi */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="text-uppercase fw-bold text-dark fs-7" style={{ letterSpacing: '0.04em' }}>
          HÀNG ĐỢI XÉT DUYỆT
        </div>
        <span className="badge bg-light text-dark fw-bold border">
          {items.length} hồ sơ
        </span>
      </div>

      {/* Tabs lọc nhanh trạng thái */}
      <div className="d-flex gap-1 mb-2 pb-2 overflow-auto" style={{ borderBottom: '1px solid #f1f5f9' }}>
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`btn btn-sm px-2 py-1 fs-8 text-nowrap rounded-pill ${
              filterStatus === tab.key ? 'btn-dark fw-bold' : 'btn-light text-muted'
            }`}
            onClick={() => onFilterChange && onFilterChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ô tìm kiếm */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0 text-muted p-2">
            <Search size={14} />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0 fs-8"
            placeholder="Tìm theo MSSV, họ tên, mã..."
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách các thẻ hồ sơ cuộn dọc */}
      <div className="d-flex flex-column gap-2 flex-grow-1 overflow-auto pe-1" style={{ maxHeight: '560px' }}>
        {loading ? (
          <div className="py-5 text-center text-muted fs-8">
            <div className="spinner-border spinner-border-sm mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
            <div>Đang tải hàng đợi...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-5 text-center text-muted fs-8">
            <Clock size={24} className="mb-2 opacity-50" />
            <div>Không có hồ sơ nào trong mục này.</div>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = item.registrationId === selectedId;
            const badge = STATUS_BADGE[item.status] || { label: item.status, bg: '#f1f5f9', color: '#475569' };
            const student = item.student || {};
            const docCount = item.documents?.length || 0;

            return (
              <div
                key={item.registrationId}
                onClick={() => onSelectRegistration && onSelectRegistration(item)}
                className={`p-3 rounded-3 border cursor-pointer transition position-relative ${
                  isSelected ? 'bg-light border-success shadow-xs' : 'bg-white'
                }`}
                style={{ 
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--primary-color) !important' : 'var(--border-color)' 
                }}
              >
                {/* Header card: Mã hồ sơ + Badge trạng thái */}
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fw-bold fs-7" style={{ color: isSelected ? 'var(--primary-color)' : '#334155' }}>
                    {item.registrationCode || `#${item.registrationId}`}
                  </span>
                  <span 
                    className="badge fw-bold px-2 py-1"
                    style={{ backgroundColor: badge.bg, color: badge.color, fontSize: '0.66rem' }}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Tên sinh viên */}
                <div className="d-flex align-items-center justify-content-between">
                  <div className={`fw-bold fs-7 ${isSelected ? 'text-success' : 'text-dark'}`}>
                    {student.fullName || '—'}
                  </div>
                  <ChevronRight size={16} className="text-muted" />
                </div>

                {/* MSSV & Khoa/Lớp */}
                <div className="text-muted fs-8 mt-1">
                  MSSV: <strong>{student.studentCode || '—'}</strong> • Lớp: {student.className || '—'}
                </div>
                <div className="d-flex align-items-center justify-content-between text-muted fs-8 mt-1">
                  <span>Nộp: {formatDate(item.submittedAt || item.createdAt)}</span>
                  <span className="badge bg-light text-secondary border fs-8">
                    {docCount}/4 giấy tờ
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

