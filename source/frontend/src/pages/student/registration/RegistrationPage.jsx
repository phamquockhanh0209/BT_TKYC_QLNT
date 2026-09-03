import React from 'react';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';

export default function RegistrationPage() {
  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý Hồ Sơ Ngoại Trú</h2>
          <p className="text-muted mb-0">Theo dõi đợt đăng ký cư trú ngoại trú của sinh viên qua các học kỳ</p>
        </div>
        <button className="btn btn-success d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
          <Plus size={18} /> Khai báo hồ sơ mới
        </button>
      </div>

      <div className="app-card-clean">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                <th>MÃ HỒ SƠ</th>
                <th>KỲ HỌC</th>
                <th>ĐỊA CHỈ NGOẠI TRÚ</th>
                <th>NGÀY NỘP</th>
                <th>TRẠNG THÁI</th>
                <th className="text-end">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold text-dark">HS-2026-001</td>
                <td>Học kỳ 1 (2026 - 2027)</td>
                <td>123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng</td>
                <td>15/08/2026</td>
                <td><span className="badge-pill-custom badge-active">ACTIVE</span></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-secondary">Xem chi tiết</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
