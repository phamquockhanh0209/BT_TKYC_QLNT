import React from 'react';
import { Search, RotateCcw, Eye, ChevronLeft, ChevronRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const STATUS_BADGE = {
  SUBMITTED:    { label: 'CHỜ XỬ LÝ', bg: '#fef3c7' },
  UNDER_REVIEW: { label: 'ĐANG XÉT DUYỆT', bg: '#e0e7ff' },
  PROCESSING:   { label: 'ĐANG XỬ LÝ', bg: '#e0e7ff' },
  APPROVED:     { label: 'ĐÃ DUYỆT', bg: '#dcfce7' },
  ACTIVE:       { label: 'ĐANG HIỆU LỰC', bg: '#dcfce7' },
  REJECTED:     { label: 'YÊU CẦU BỔ SUNG / TỪ CHỐI', bg: '#fee2e2' },
  OVERDUE:      { label: 'QUÁ HẠN SLA', bg: '#ffedd5' },
  DRAFT:        { label: 'BẢN NHÁP', bg: '#f1f5f9' },
};

export default function WorkQueueTable({
  items = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  selectedStatus = 'ALL',
  onStatusChange,
  selectedFaculty = 'ALL',
  onFacultyChange,
  onRefresh,
  onProcess
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return { date: '—', time: '' };
    const d = new Date(dateStr);
    return {
      date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
      time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    };
  };

  const getSlaInfo = (item) => {
    const sla = item.slaTrackings?.[0];
    if (!sla || !sla.dueAt) return { text: 'Không có SLA', type: 'normal' };
    
    if (sla.status === 'COMPLETED' || item.status === 'APPROVED') {
      return { text: 'Đã hoàn thành', type: 'completed' };
    }

    const due = new Date(sla.dueAt);
    const now = new Date();
    const diffHours = Math.round((due - now) / (1000 * 60 * 60));

    if (diffHours < 0) {
      return { text: `Quá hạn ${Math.abs(diffHours)}h`, type: 'overdue' };
    }
    if (diffHours <= 12) {
      return { text: `Còn ${diffHours}h (Gấp)`, type: 'urgent' };
    }
    const days = Math.ceil(diffHours / 24);
    return { text: `Còn ${days} ngày`, type: 'normal' };
  };

  // Trích xuất danh sách các Khoa duy nhất
  const faculties = Array.from(new Set(items.map(i => i.student?.faculty).filter(Boolean)));

  // Lọc phía client
  const filtered = items.filter(item => {
    // 1. Search term
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const code = (item.registrationCode || '').toLowerCase();
      const name = (item.student?.fullName || '').toLowerCase();
      const mssv = (item.student?.studentCode || '').toLowerCase();
      if (!code.includes(q) && !name.includes(q) && !mssv.includes(q)) return false;
    }

    // 2. Status
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'PENDING') {
        if (!['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(item.status)) return false;
      } else if (item.status !== selectedStatus) {
        return false;
      }
    }

    // 3. Faculty
    if (selectedFaculty !== 'ALL' && item.student?.faculty !== selectedFaculty) {
      return false;
    }

    return true;
  });

  return (
    <div className="app-card-clean mb-4">
      {/* Tiêu đề bảng công việc */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold fs-5 mb-0 text-uppercase" style={{ color: 'var(--text-dark)', letterSpacing: '0.04em' }}>
          DANH SÁCH HỒ SƠ CẦN XỬ LÝ
        </h3>
        <span className="badge bg-light text-dark border fw-bold fs-8">
          {filtered.length} hồ sơ
        </span>
      </div>

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="row g-2 align-items-center mb-3">
        {/* Ô tìm kiếm */}
        <div className="col-lg-4 col-md-12">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 fs-7"
              placeholder="Tìm kiếm theo MSSV, họ tên, mã..."
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Dropdown Trạng thái */}
        <div className="col-lg-3 col-sm-4">
          <select 
            className="form-select fs-7" 
            value={selectedStatus}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SUBMITTED">Chờ xử lý (Mới nộp)</option>
            <option value="UNDER_REVIEW">Đang xét duyệt (Qua thẩm định)</option>
            <option value="APPROVED">Đã phê duyệt</option>
            <option value="REJECTED">Yêu cầu bổ sung / Từ chối</option>
          </select>
        </div>

        {/* Dropdown Khoa/Viện */}
        <div className="col-lg-3 col-sm-4">
          <select 
            className="form-select fs-7"
            value={selectedFaculty}
            onChange={(e) => onFacultyChange && onFacultyChange(e.target.value)}
          >
            <option value="ALL">Tất cả Khoa/Viện</option>
            {faculties.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Nút Làm mới */}
        <div className="col-lg-2 col-sm-4 text-lg-end">
          <button 
            type="button" 
            onClick={onRefresh}
            className="btn btn-outline-secondary fs-7 d-inline-flex align-items-center gap-1 w-100 justify-content-center"
          >
            <RotateCcw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* Bảng hồ sơ */}
      <div className="table-responsive">
        <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 6px' }}>
          <thead className="bg-light">
            <tr className="text-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.03em' }}>
              <th className="py-2 ps-3 border-0">Mã hồ sơ</th>
              <th className="py-2 border-0">Sinh viên</th>
              <th className="py-2 border-0">Khoa/Viện</th>
              <th className="py-2 border-0">Ngày nộp</th>
              <th className="py-2 border-0">Trạng thái</th>
              <th className="py-2 border-0">SLA</th>
              <th className="py-2 pe-3 text-end border-0">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted fs-7">
                  <div className="spinner-border spinner-border-sm mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
                  <div>Đang tải dữ liệu hồ sơ...</div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted fs-7">
                  Không tìm thấy hồ sơ nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const badge = STATUS_BADGE[item.status] || { label: 'CHƯA XÁC ĐỊNH', bg: '#f1f5f9' };
                const dateObj = formatDate(item.submittedAt || item.createdAt);
                const slaInfo = getSlaInfo(item);
                const student = item.student || {};

                return (
                  <tr key={item.registrationId} className="border-bottom border-light bg-white">
                    {/* Mã hồ sơ */}
                    <td className="ps-3 py-3 fw-bold fs-7" style={{ color: 'var(--primary-color)' }}>
                      {item.registrationCode || `#${item.registrationId}`}
                    </td>

                    {/* Sinh viên */}
                    <td className="py-3">
                      <div className="fw-bold text-dark fs-7 lh-sm">{student.fullName || '—'}</div>
                      <small className="text-muted fs-8">MSSV: {student.studentCode || '—'}</small>
                    </td>

                    {/* Khoa/Viện */}
                    <td className="py-3 text-muted fs-7">
                      {student.faculty || '—'}
                    </td>

                    {/* Ngày nộp */}
                    <td className="py-3 fs-7">
                      <div className="text-dark fw-medium lh-sm">{dateObj.date}</div>
                      <small className="text-muted fs-8">{dateObj.time}</small>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3">
                      <span 
                        className="badge fw-bold px-2 py-1 text-uppercase" 
                        style={{ backgroundColor: badge.bg, color: '#000', borderRadius: '4px', fontSize: '0.72rem' }}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* SLA */}
                    <td className="py-3 fs-7">
                      <span className={`d-inline-flex align-items-center gap-1 fw-semibold ${
                        slaInfo.type === 'overdue' ? 'text-danger' : 
                        slaInfo.type === 'urgent' ? 'text-warning' : 
                        slaInfo.type === 'completed' ? 'text-success' : 'text-muted'
                      }`}>
                        {slaInfo.type === 'overdue' && <AlertTriangle size={13} />}
                        {slaInfo.type === 'urgent' && <Clock size={13} />}
                        {slaInfo.type === 'completed' && <CheckCircle2 size={13} />}
                        {slaInfo.text}
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="py-3 pe-3 text-end">
                      <button 
                        type="button" 
                        onClick={() => onProcess && onProcess(item)}
                        className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 fs-8 fw-semibold px-2 py-1"
                        style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                      >
                        <Eye size={14} /> Xử lý
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
  );
}
