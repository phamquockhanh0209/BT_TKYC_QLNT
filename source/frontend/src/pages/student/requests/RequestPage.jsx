import React from 'react';
import { Plus, Clock, CheckCircle } from 'lucide-react';

export default function RequestPage() {
  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Yêu Cầu & Khiếu Nại (1 đang xử lý)</h2>
          <p className="text-muted mb-0">Các yêu cầu gia hạn, xác nhận giấy tờ ngoại trú gửi tới cán bộ</p>
        </div>
        <button className="btn btn-success d-inline-flex align-items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Plus size={18} /> Gửi yêu cầu mới
        </button>
      </div>

      <div className="app-card-clean">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                <th>MÃ YÊU CẦU</th>
                <th>LOẠI YÊU CẦU</th>
                <th>NỘI DUNG</th>
                <th>NGÀY GỬI</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold">YC-2026-089</td>
                <td>Gia hạn thời gian thuê trọ</td>
                <td>Gia hạn hợp đồng thuê nhà thêm 1 năm học 2026 - 2027</td>
                <td>01/09/2026</td>
                <td>
                  <span className="badge-pill-custom badge-pending">
                    <Clock size={12} /> ĐANG XỬ LÝ
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
