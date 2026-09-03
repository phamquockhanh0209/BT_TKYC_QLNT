import React from 'react';
import { CheckCheck, Download } from 'lucide-react';

export default function ReviewerProcessedPage() {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Hồ Sơ Đã Xử Lý</h2>
          <p className="text-muted mb-0">Danh sách các hồ sơ ngoại trú đã được phê duyệt hoặc từ chối chính thức</p>
        </div>
        <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 fs-7">
          <Download size={16} /> Xuất Báo Cáo
        </button>
      </div>

      <div className="app-card-clean">
        <p className="text-muted fs-7 mb-0">Hồ sơ đã hoàn tất quy trình thẩm định bởi Reviewer.</p>
      </div>
    </div>
  );
}
