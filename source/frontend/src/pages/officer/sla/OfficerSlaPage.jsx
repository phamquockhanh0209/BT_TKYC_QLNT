import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function OfficerSlaPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Giám Sát SLA & Quá Hạn (5 Quá hạn)</h2>
        <p className="text-muted mb-0">Theo dõi thời hạn xử lý hồ sơ (SLA 72 giờ) và các trường hợp bị leo thang (Escalation)</p>
      </div>

      <div className="app-card-clean">
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <AlertTriangle size={18} />
          <span>Có 5 hồ sơ đã vượt quá thời hạn cam kết SLA xử lý 72 giờ cần được giải quyết ngay.</span>
        </div>
        <p className="text-muted fs-7 mb-0">Hệ thống tự động cảnh báo và thông báo tới Trưởng phòng khi có hồ sơ quá hạn.</p>
      </div>
    </div>
  );
}
