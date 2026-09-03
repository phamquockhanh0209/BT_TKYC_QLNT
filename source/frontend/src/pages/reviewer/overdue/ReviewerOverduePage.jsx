import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ReviewerOverduePage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Hồ Sơ Quá Hạn Xét Duyệt</h2>
        <p className="text-muted mb-0">Các hồ sơ đã quá thời hạn quy định thẩm định SLA cần được giải quyết gấp</p>
      </div>

      <div className="app-card-clean">
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <AlertTriangle size={18} />
          <span>Danh sách hồ sơ cần ưu tiên xử lý ngay để tránh báo cáo vi phạm SLA.</span>
        </div>
      </div>
    </div>
  );
}
