import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function ReviewerReportsPage() {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Báo Cáo Thẩm Định & Xét Duyệt</h2>
          <p className="text-muted mb-0">Biên bản thẩm định hồ sơ ngoại trú định kỳ gửi Ban Giám hiệu</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7">
          <Download size={16} /> Xuất PDF
        </button>
      </div>

      <div className="app-card-clean">
        <p className="text-muted fs-7 mb-0">Hệ thống tổng hợp danh sách các hồ sơ đủ điều kiện và không đủ điều kiện.</p>
      </div>
    </div>
  );
}
