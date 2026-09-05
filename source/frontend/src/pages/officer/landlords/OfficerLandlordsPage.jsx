import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Home, Phone, CreditCard, MapPin } from 'lucide-react';
import officerService from '../../../api/officerService';

export default function OfficerLandlordsPage() {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await officerService.getLandlords();
      setLandlords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách chủ trọ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = landlords.filter(l => {
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const name = (l.fullName || '').toLowerCase();
      const phone = (l.phone || '').toLowerCase();
      const idNum = (l.identityNumber || '').toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !idNum.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Danh Mục Chủ Trọ & Cơ Sở Ngoại Trú ({landlords.length})</h2>
          <p className="text-muted mb-0">Quản lý cơ sở dữ liệu các chủ nhà trọ liên kết trên địa bàn</p>
        </div>
        <button type="button" onClick={loadData} className="btn btn-outline-secondary fs-7 d-inline-flex align-items-center gap-1">
          <RotateCcw size={15} /> Làm mới
        </button>
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
                placeholder="Tìm theo họ tên chủ trọ, số điện thoại, CCCD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bảng chủ trọ */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted fs-8">
                <th>HỌ VÀ TÊN CHỦ TRỌ</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>SỐ CCCD / CMND</th>
                <th>EMAIL</th>
                <th>GHI CHÚ CƠ SỞ</th>
                <th>NGÀY CẬP NHẬT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted fs-7">
                    <div className="spinner-border spinner-border-sm mb-2" role="status" style={{ color: 'var(--primary-color)' }} />
                    <div>Đang tải danh sách chủ trọ...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted fs-7">
                    Không tìm thấy chủ trọ nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.landlordId}>
                    <td>
                      <div className="fw-bold text-dark fs-7 d-flex align-items-center gap-2">
                        <Home size={16} className="text-success" />
                        {l.fullName}
                      </div>
                    </td>
                    <td className="fs-7 fw-semibold text-primary">
                      <Phone size={13} className="me-1 inline text-muted" />
                      {l.phone || '—'}
                    </td>
                    <td className="fs-7 text-dark">
                      <CreditCard size={13} className="me-1 inline text-muted" />
                      {l.identityNumber || '—'}
                    </td>
                    <td className="fs-7 text-muted">{l.email || '—'}</td>
                    <td className="fs-7 text-muted" style={{ maxWidth: '260px' }}>
                      <div className="text-truncate">{l.note || 'Cơ sở nhà trọ sinh viên'}</div>
                    </td>
                    <td className="fs-7 text-muted">
                      {l.updatedAt || l.createdAt ? new Date(l.updatedAt || l.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
