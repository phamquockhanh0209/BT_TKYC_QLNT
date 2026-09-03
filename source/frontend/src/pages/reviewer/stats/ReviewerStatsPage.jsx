import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ReviewerStatsPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Thống Kê Hiệu Suất Thẩm Định</h2>
        <p className="text-muted mb-0">Biểu đồ tỷ lệ phê duyệt, thời gian thẩm định trung bình và phân bố kết quả</p>
      </div>

      <div className="app-card-clean">
        <p className="text-muted fs-7 mb-0">Thống kê chỉ số hoàn thành đúng hạn của Reviewer.</p>
      </div>
    </div>
  );
}
