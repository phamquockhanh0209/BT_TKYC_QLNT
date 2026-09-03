import React from 'react';
import { History, UserCheck, ShieldCheck } from 'lucide-react';

export default function DossierHistoryTab() {
  const historyItems = [
    {
      id: 1,
      actor: "Nguyễn Văn Cán Bộ",
      role: "Cán bộ tiếp nhận",
      action: "Kiểm tra bước đầu & chuyển hồ sơ sang Reviewer",
      time: "03/09/2026 11:15",
      note: "Hồ sơ đã được kiểm tra bước đầu. Sinh viên cung cấp đầy đủ giấy tờ cơ bản."
    },
    {
      id: 2,
      actor: "Nguyễn Văn An",
      role: "Sinh viên",
      action: "Nộp hồ sơ ngoại trú học kỳ 1 (2026 - 2027)",
      time: "03/09/2026 10:30",
      note: "Tạo hồ sơ và nộp 4 tài liệu đính kèm"
    }
  ];

  return (
    <div className="d-flex flex-column gap-3">
      {historyItems.map((item) => (
        <div key={item.id} className="app-card-clean p-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fw-bold fs-7 text-dark">{item.actor} <small className="text-muted fw-normal">({item.role})</small></span>
            <small className="text-muted fs-8">{item.time}</small>
          </div>
          <div className="fw-semibold fs-7 text-success mb-1">{item.action}</div>
          <p className="text-muted fs-8 mb-0 bg-light p-2 rounded">
            "{item.note}"
          </p>
        </div>
      ))}
    </div>
  );
}
