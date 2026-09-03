import React from 'react';
import { Bell } from 'lucide-react';

export default function OfficerNotificationsPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Thông Báo Hệ Thống (3 Mới)</h2>
        <p className="text-muted mb-0">Cảnh báo hồ sơ mới nộp, nhắc nhở SLA và thông báo trao đổi với sinh viên</p>
      </div>

      <div className="app-card-clean">
        <p className="text-muted fs-7 mb-0">Danh sách các thông báo công việc gửi tới cán bộ tiếp nhận.</p>
      </div>
    </div>
  );
}
