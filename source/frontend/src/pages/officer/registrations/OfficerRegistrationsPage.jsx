import React from 'react';
import { Filter, Download, Plus } from 'lucide-react';

export default function OfficerRegistrationsPage() {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Toàn Bộ Hồ Sơ Ngoại Trú (24 Chờ xử lý)</h2>
          <p className="text-muted mb-0">Quản lý, phân loại và phê duyệt hồ sơ đăng ký ngoại trú toàn trường</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7">
            <Download size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      <div className="app-card-clean">
        <p className="text-muted fs-7 mb-0">
          Danh sách hồ sơ ngoại trú đầy đủ với tính năng lọc theo kỳ học, khoa, trạng thái duyệt và hạn SLA.
        </p>
      </div>
    </div>
  );
}
