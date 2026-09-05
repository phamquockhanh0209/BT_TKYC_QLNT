import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, RotateCcw, Filter, CheckCircle2 } from 'lucide-react';
import officerService from '../../../api/officerService';
import authService from '../../../api/authService';
import ProcessRegistrationModal from '../dashboard/ProcessRegistrationModal';

const STATUS_BADGE = {
  SUBMITTED:    { label: 'CHỜ XỬ LÝ', bg: '#fef3c7' },
  UNDER_REVIEW: { label: 'ĐANG XÉT DUYỆT', bg: '#e0e7ff' },
  PROCESSING:   { label: 'ĐANG XỬ LÝ', bg: '#e0e7ff' },
  APPROVED:     { label: 'ĐÃ DUYỆT', bg: '#dcfce7' },
  ACTIVE:       { label: 'ĐANG HIỆU LỰC', bg: '#dcfce7' },
  REJECTED:     { label: 'BỔ SUNG / TỪ CHỐI', bg: '#fee2e2' },
  DRAFT:        { label: 'BẢN NHÁP', bg: '#f1f5f9' },
};

export default function OfficerRegistrationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedReg, setSelectedReg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await officerService.getWorkQueue({ status: 'ALL' });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách hồ sơ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcessClick = async (reg) => {
    try {
      const detail = await officerService.getRegistrationDetail(reg.registrationId);
      setSelectedReg(detail);
      setShowModal(true);
    } catch {
      setSelectedReg(reg);
      setShowModal(true);
    }
  };

  const handleApprove = async (reg, note) => {
    try {
      setSubmitting(true);
      const user = authService.getCurrentUser();
      await officerService.processRegistration(reg.registrationId, {
        action: 'APPROVE',
        note: note || 'Cán bộ Quản lý phê duyệt chính thức.',
        approverId: user?.userId
      });
      setShowModal(false);
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ['Mã hồ sơ', 'MSSV', 'Họ tên', 'Khoa', 'Địa chỉ', 'Ngày nộp', 'Trạng thái'];
    const rows = items.map(i => [
      i.registrationCode || `#${i.registrationId}`,
      i.student?.studentCode || '',
      `"${i.student?.fullName || ''}"`,
      `"${i.student?.faculty || ''}"`,
      `"${[i.addresses?.[0]?.addressLine, i.addresses?.[0]?.ward, i.addresses?.[0]?.district].filter(Boolean).join(', ')}"`,
      i.submittedAt ? new Date(i.submittedAt).toLocaleDateString('vi-VN') : '',
      i.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_ho_so_ngoai_tru_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = items.filter(i => {
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const code = (i.registrationCode || '').toLowerCase();
      const name = (i.student?.fullName || '').toLowerCase();
      const mssv = (i.student?.studentCode || '').toLowerCase();
      if (!code.includes(q) && !name.includes(q) && !mssv.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Toàn Bộ Hồ Sơ Ngoại Trú ({items.length} Hồ sơ)</h2>
          <p className="text-muted mb-0">Quản lý, phân loại và phê duyệt hồ sơ đăng ký ngoại trú toàn trường</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            onClick={handleExportCSV}
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7"
          >
            <Download size={16} /> Xuất Excel / CSV
          </button>
        </div>
      </div>

      {/* Tabs lọc nhanh trạng thái */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {[
          { key: 'ALL', label: 'Tất cả' },
          { key: 'SUBMITTED', label: 'Chờ xử lý' },
          { key: 'UNDER_REVIEW', label: 'Đang xét duyệt' },
          { key: 'APPROVED', label: 'Đã duyệt' },
          { key: 'REJECTED', label: 'Bổ sung / Từ chối' },
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
                placeholder="Tìm theo MSSV, họ tên, mã hồ sơ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2 ms-auto text-end">
            <button type="button" onClick={loadData} className="btn btn-outline-secondary fs-7 w-100 d-flex align-items-center justify-content-center gap-1">
              <RotateCcw size={15} /> Làm mới
            </button>
          </div>
        </div>

        {/* Bảng hồ sơ */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>MÃ HỒ SƠ</th>
                <th>SINH VIÊN</th>
                <th>KHOA / LỚP</th>
                <th>ĐỊA CHỈ NGOẠI TRÚ</th>
                <th>NGÀY NỘP</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end pe-3">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted fs-7">
                    <div className="spinner-border spinner-border-sm mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
                    <div>Đang tải hồ sơ...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted fs-7">
                    Không có hồ sơ nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const badge = STATUS_BADGE[item.status] || { label: 'CHƯA XÁC ĐỊNH', bg: '#f1f5f9' };
                  const student = item.student || {};
                  const addr = item.addresses?.[0];

                  return (
                    <tr key={item.registrationId}>
                      <td className="fw-bold fs-7" style={{ color: 'var(--primary-color)' }}>
                        {item.registrationCode || `#${item.registrationId}`}
                      </td>
                      <td>
                        <div className="fw-bold text-dark fs-7">{student.fullName || '—'}</div>
                        <small className="text-muted fs-8">{student.studentCode || '—'}</small>
                      </td>
                      <td className="fs-7 text-muted">
                        <div>{student.faculty || '—'}</div>
                        <small>{student.className || ''}</small>
                      </td>
                      <td className="fs-7">
                        {[addr?.addressLine, addr?.ward, addr?.district].filter(Boolean).join(', ') || 'Chưa cập nhật'}
                      </td>
                      <td className="fs-7 text-muted">
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td>
                        <span 
                          className="badge fw-bold px-2 py-1 text-uppercase"
                          style={{ backgroundColor: badge.bg, color: '#000', fontSize: '0.72rem' }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <button 
                          type="button" 
                          onClick={() => handleProcessClick(item)}
                          className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 fs-8 fw-semibold"
                          style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                        >
                          <Eye size={14} /> Xem & Xử lý
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

      <ProcessRegistrationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        registration={selectedReg}
        onApprove={handleApprove}
        onRequestInfo={() => setShowModal(false)}
        onReject={() => setShowModal(false)}
        submitting={submitting}
      />
    </div>
  );
}
