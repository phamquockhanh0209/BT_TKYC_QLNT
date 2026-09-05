import React from 'react';
import { History, UserCheck, ShieldCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function DossierHistoryTab({ registration = null }) {
  if (!registration) {
    return <div className="text-muted text-center py-4">Chưa có thông tin lịch sử.</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const student = registration.student || {};
  const approvals = Array.isArray(registration.approvals) ? registration.approvals : [];

  const historyList = [];

  // 1. Mốc sinh viên nộp hồ sơ
  if (registration.submittedAt || registration.createdAt) {
    historyList.push({
      id: 'submitted',
      actor: student.fullName || 'Sinh viên',
      role: 'Sinh viên',
      action: 'Nộp hồ sơ khai báo ngoại trú',
      time: formatDate(registration.submittedAt || registration.createdAt),
      note: `Hồ sơ ${registration.registrationCode || ''} được nộp thành công lên hệ thống kèm tài liệu minh chứng.`,
      isSuccess: true
    });
  }

  // 2. Các mốc phê duyệt / thẩm định
  approvals.forEach((app, idx) => {
    const isApproved = app.decision === 'APPROVED';
    historyList.push({
      id: app.approvalId || idx,
      actor: app.approver?.fullName || 'Cán bộ xét duyệt',
      role: 'Reviewer / Officer',
      action: isApproved ? 'Thẩm định hồ sơ đạt yêu cầu' : 'Yêu cầu bổ sung / Từ chối hồ sơ',
      time: formatDate(app.decidedAt),
      note: app.reason || (isApproved ? 'Hồ sơ và tài liệu hợp lệ' : 'Chưa đạt yêu cầu'),
      isSuccess: isApproved
    });
  });

  // 3. Mốc từ chối (nếu có rejectedAt mà chưa có approval record)
  if (registration.rejectedAt && !approvals.some(a => a.decision === 'REJECTED')) {
    historyList.push({
      id: 'rejected',
      actor: 'Cán bộ xét duyệt',
      role: 'Cán bộ',
      action: 'Từ chối / Yêu cầu bổ sung',
      time: formatDate(registration.rejectedAt),
      note: registration.rejectionReason || 'Hồ sơ chưa đạt yêu cầu',
      isSuccess: false
    });
  }

  return (
    <div className="d-flex flex-column gap-3">
      {historyList.map((item) => (
        <div key={item.id} className="app-card-clean p-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fw-bold fs-7 text-dark">
              {item.actor} <small className="text-muted fw-normal">({item.role})</small>
            </span>
            <small className="text-muted fs-8">{item.time}</small>
          </div>
          <div className={`fw-semibold fs-7 mb-1 d-flex align-items-center gap-1 ${item.isSuccess ? 'text-success' : 'text-danger'}`}>
            {item.isSuccess ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {item.action}
          </div>
          <p className="text-muted fs-8 mb-0 bg-light p-2 rounded">
            "{item.note}"
          </p>
        </div>
      ))}
    </div>
  );
}

